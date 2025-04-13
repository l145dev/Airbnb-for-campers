import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { rateLimit } from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const prisma = new PrismaClient();

const router = Router();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/* add user to db. */
router.post('/', async (req, res, next) => {
    // get email and password
    const { fn, ln, email, pwd } = req.body;

    try {
        // checking for availability
        if (!email || !pwd || !fn || !ln) {
            return res.status(400).json({ error: "Missing details." });
        }

        // check if user is found (check for dupe, email is unique)
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (user) {
            return res.status(400).json({ error: "Email already exists, try logging in" });
        }

        // hash password with bcrypt (passwords are hashed with bcrypt, salt 12)
        const pwdHashed = await bcrypt.hash(pwd, 12);

        // store in db
        const newUser = await prisma.users.create({
            data: {
                first_name: fn,
                last_name: ln,
                email: email,
                pwd: pwdHashed,
            }
        });

        const token = jwt.sign(
            { id: newUser.user_id, email: newUser.email }, // user details to add to signature
            JWT_SECRET // server jwt password
        );

        return res.status(200).json(
            {
                message: "User successfully registered!",
                token: token
            }
        );
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
});

export default router;
