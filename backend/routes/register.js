import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const router = Router();

// for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* registration process. */
router.post('/', async (req, res, next) => {
    // Check if a session already exists
    if (req.session && req.session.loggedIn && req.session.userId) {
        return res.status(200).json({
            message: "You are already logged in.",
            user_id: req.session.userId,
            email: req.session.email
        });
    }


    // get email and password
    const { fn, ln, email, pwd } = req.body;

    try {
        // checking for availability
        if (!email || !pwd || !fn || !ln) {
            return res.status(400).json({ error: "Missing details.", errorType: "All" });
        }

        // validate email
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format.", errorType: "Email" });
        }

        // validate password 
        if (pwd.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters.", errorType: "Password" });
        }

        // check if user is found (check for dupe, email is unique)
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        });

        if (user) {
            return res.status(400).json({ error: "Email already exists, try logging in", errorType: "Email" });
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

        // store details in session, toggle session logged in state
        req.session.userId = newUser.user_id;
        req.session.email = newUser.email;
        req.session.loggedIn = true;

        return res.status(200).json(
            {
                message: "User successfully registered!",
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
