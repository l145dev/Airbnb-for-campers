import { Router } from 'express';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import isAuthenticated from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import Groq from "groq-sdk";
import { PrismaClient } from '@prisma/client';

const router = Router();

dotenv.config();

const prisma = new PrismaClient();

// rate limit options (to prevent email spamming)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 mins interval
    max: 1, // 1 attempt
    message: "Please wait 5 minutes to send another support request.",
    standardHeaders: true,
    legacyHeaders: false
})

// nodemailer transport setup
const transporter = nodemailer.createTransport({
    host: process.env.COMBELL_SMTP_HOST,
    port: process.env.COMBELL_SMTP_PORT || 465,
    secure: true,
    auth: {
        user: process.env.COMBELL_SMTP_USER_SUPPORT,
        pass: process.env.COMBELL_SMTP_PASSWORD,
    }
});

// groq AI for subject creation (summarizing the message into a subject)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// support logic
router.post("/", isAuthenticated, limiter, async (req, res, next) => {
    const { message } = req.body;

    // return if no message provided
    if (!message) {
        return res.status(400).json({ error: "Please provide a support message." });
    }

    try {
        // send message and receive subject line (AI)
        const completion = await groq.chat.completions
            .create({
                messages: [
                    {
                        role: "user",
                        content: `Create a short email subject line from this user's request message, only give the subject line as output: ${message}`,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            })

        // save subject from AI, if not available, make generic subject line
        const subject = completion.choices[0]?.message?.content || `Support Request from User ID: ${user.user_id}`;

        // create database entry of support
        const supportReq = await prisma.support.create({
            data: {
                user_id: req.user.user_id,
                subject_line: subject,
                message_line: message
            }
        })

        // send mail to support
        await transporter.sendMail({
            from: process.env.COMBELL_SMTP_USER_SUPPORT,
            to: process.env.COMBELL_SMTP_USER_SUPPORT,
            subject: `Support Request #${supportReq.support_id}: ${subject}`,
            text: message
        })

        // get user info
        const user = await prisma.users.findUnique({
            where: {
                user_id: req.user.user_id
            }
        })

        // send confirmation mail to user
        await transporter.sendMail({
            from: process.env.COMBELL_SMTP_USER_NOREPLY,
            to: user.email,
            subject: `Support Request #${supportReq.support_id}: ${subject}`,
            html: `<p>Hi ${user.first_name} ${user.last_name},</p>
            <p>We have received your support request and will get back to you as soon as possible.</p>
            <p>Thank you for contacting our support page.</p>
            <p>Kind regards,</p>
            <p>Airbnb Camping</p>`,
            text: `Hi ${user.first_name} ${user.last_name}, We have received your support request and will get back to you as soon as possible. Thank you for contacting our support page. Kind regards, Airbnb Camping` // Fallback for non-HTML email clients
        })

        // add support info to database
        return res.status(200).json({ success: true, subject: subject })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;