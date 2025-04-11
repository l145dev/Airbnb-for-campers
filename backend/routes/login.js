import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { rateLimit } from 'express-rate-limit';

const prisma = new PrismaClient();

const router = Router();

// rate limit options (to prevent brute force attacks)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 mins interval
    max: 10, // 10 attempts
    message: "Too many login attempts, try again in 5 minutes",
    standardHeaders: true,
    legacyHeaders: false
})

/* check if login details are correct. */
router.post('/', limiter, async (req, res, next) => {
    // get email and password
    const { email, pwd } = req.body;

    try {
        // checking for pwd and email availability
        if (!email && !pwd) {
            return res.status(400).json({ error: "No email or password provided" });
        }

        else if (!email) {
            return res.status(400).json({ error: "No email provided" });
        }

        else if (!pwd) {
            return res.status(400).json({ error: "No password provided" });
        }

        // check if user is found
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({ error: "Email not found" });
        }

        // match passwords with bcrypt (passwords are hashed with bcrypt, salt 12)
        const pwdMatch = await bcrypt.compare(pwd, user.pwd);

        if (pwdMatch) {
            return res.status(200).json({ message: "User successfully logged in!" });
        }

        else {
            return res.status(401).json({ error: "Password incorrect" });
        }
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }

    finally {
        // disconnect for security
        prisma.$disconnect();
    }
});

export default router;
