import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

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

// send the code to user's email
router.post("/code", limiter, async (req, res, next) => {
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
            subject: `Password Reset Request`,
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

        return res.status(200).json({ success: true });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

router.post("/email", async (req, res, next) => {
    const { email, code } = req.body;

    try {

    }

    catch (error) {

    }
})

export default router;