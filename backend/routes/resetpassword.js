import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import isAuthenticated from "../middleware/auth.js";
import bcrypt from 'bcrypt';

const router = Router();

dotenv.config();

const prisma = new PrismaClient();

// rate limit options (to prevent email spamming)
const limiter = rateLimit({
    windowMs: 60 * 1000, // 60 second interval
    max: 1, // 1 attempt
    message: "Please wait 60 seconds to request another code.",
    standardHeaders: true,
    legacyHeaders: false
})

// nodemailer transport setup
const transporter = nodemailer.createTransport({
    host: process.env.COMBELL_SMTP_HOST,
    port: process.env.COMBELL_SMTP_PORT || 465,
    secure: true,
    auth: {
        user: process.env.COMBELL_SMTP_USER_NOREPLY,
        pass: process.env.COMBELL_SMTP_PASSWORD,
    }
});

const getRandomNumber = (min, max) => {
    // min is inclusive, max is exclusive
    return Math.round(Math.random() * (max - min) + min);
}

// check if already loggedin
router.get("/", async (req, res, next) => {
    // check if logged in
    if (req.session && req.session.loggedIn && req.session.userId) {
        const email = await prisma.users.findUnique({
            where: {
                user_id: parseInt(req.session.userId)
            },

            select: {
                email: true
            }
        })

        if (email) {
            return res.status(200).json({ email: email.email }); // lol, there is probably a better way to write this without the confusion
        }

        return res.status(400).json({ error: "Could not fetch email." });
    }

    return res.status(200).json({ error: "Not logged in." });
})

// send the code to user's email
// IMPORTANT: PUT LIMITER BACK ON AFTER TESTING
router.post("/code", async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email not provided." })
    }

    try {
        // check if user exists with the email
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        // email not found
        if (!user) {
            return res.status(400).json({ error: "Email not found." })
        }

        // create random code
        const randomInt = getRandomNumber(100000, 999999); // get random code

        // store in db, automatically set expiry for 10mins after creation in sql code
        await prisma.reset_password.create({
            data: {
                user_id: user.user_id,
                code: randomInt
            }
        })

        // send the code to the user
        const sendmail = await transporter.sendMail({
            from: process.env.COMBELL_SMTP_USER_NOREPLY,
            to: email,
            subject: `Airbnb Camping: Password Reset Request`,
            html: `<p>You have requested a password reset code to reset your password.</p>
            <p>Please use the following code to reset your password:</p>
            <h2>${randomInt}</h2>
            <p>If you did not request a reset code, feel free to ignore this email.</p>
            <p>This code will expire in 10 minutes.</p>`,
            text: `You have requested a password reset code to reset your password. Please use the following code to reset your password: ${randomInt} If you did not request a reset code, feel free to ignore this email. This code will expire in 10 minutes.` // Fallback for non-HTML email clients
        })

        if (!sendmail) {
            return res.status(500).json({ error: "Code could not be sent." })
        }

        return res.status(200).json({});
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// check if code is correct
router.post("/email", async (req, res, next) => {
    const { email, code } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email not provided." })
    }

    if (!code) {
        return res.status(400).json({ error: "Code not provided." })
    }

    try {
        // get used id
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            return res.status(400).json({ error: "Email not found." })
        }

        // get all reset rows
        const reset_code = await prisma.reset_password.findMany({
            where: {
                user_id: user.user_id,
                AND: {
                    used: false, // dont want to use used codes
                },
            }
        })

        // check if reset code exists
        if (reset_code.length === 0) {
            return res.status(400).json({ error: "No reset code found, request a reset code." })
        }

        // get last sent code
        const last_reset_code = reset_code[reset_code.length - 1];

        // details from reset table
        const dbcode = last_reset_code.code;
        const expiryDate = last_reset_code.expires_at;

        // now
        const now = new Date();

        // code expired
        if (now > expiryDate) {
            return res.status(400).json({ error: "Code expired, please request a new code." })
        }

        // incorrect code
        if (dbcode !== code) {
            return res.status(400).json({ error: "Code is not correct." })
        }

        // Check if user is already logged in
        if (!req.session.loggedIn) {
            // start session for the user (authenticate)
            req.session.userId = user.user_id;
            req.session.email = user.email;
            req.session.loggedIn = true;
        }

        // mark code as used
        await prisma.reset_password.updateMany({
            where: {
                user_id: user.user_id,
                // code: dbcode -> mark all as used (design choice)
            },

            data: {
                used: true
            }
        })

        return res.status(200).json({ success: true });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

router.patch("/change", isAuthenticated, async (req, res, next) => {
    const { pwd } = req.body;

    if (!pwd) {
        return res.status(400).json({ error: "Email not provided." })
    }

    try {
        // validate password 
        if (pwd.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters." });
        }

        // hash password with bcrypt (passwords are hashed with bcrypt, salt 12)
        const pwdHashed = await bcrypt.hash(pwd, 12);

        // change password
        const user = await prisma.users.update({
            where: {
                user_id: req.user.user_id
            },

            data: {
                pwd: pwdHashed
            }
        })

        if (!user) {
            return res.status(400).json({ error: "Could not change password, try again." })
        }

        return res.status(200).json({ success: true });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;