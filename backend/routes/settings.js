import { json, Router } from 'express';
import { PrismaClient } from "@prisma/client";
import isAuthenticated from '../middleware/auth.js';

const prisma = new PrismaClient();

const router = Router();

// convert iso time to local time (for registration date)
function convertISOToLocal(isoString) {
    // Create a Date object from the ISO string
    const date = new Date(isoString);

    // Get the local time components
    const localDateString = date.toLocaleString();

    return localDateString;
}

/* get account details with auth token. */
router.get('/', isAuthenticated, async (req, res, next) => {
    // req.user (contains user_id and email) already defined by isAuthenticated

    try {
        const user = await prisma.users.findUnique({
            where: {
                user_id: req.user.user_id
            }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            fn: user.first_name,
            ln: user.last_name,
            email: user.email,
            phone: user.phone_number,
            pfp: user.profile_picture,
            is_owner: user.is_owner,
            registration_date: convertISOToLocal(user.registration_date)
        })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
});

// when user presses update, update profile details
router.patch('/update', isAuthenticated, async (req, res, next) => {
    // get (new) values from frontend
    const updates = req.body; // { first_name, last_name, phone_number, profile_picture }

    // get existing user
    const oldUser = await prisma.users.findUnique({
        where: {
            user_id: req.user.user_id
        },

        select: {
            first_name: true,
            last_name: true,
            phone_number: true,
            profile_picture: true
        }
    })

    if (!oldUser) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        // new user details storage
        const newUser = {};

        // iterate through values
        for (const item in oldUser) {
            // ignore prototypes in object (preventing unwanted JS behavior)
            if (updates.hasOwnProperty(item)) {
                // check if exists and update needed
                if (oldUser[item] !== undefined && oldUser[item] !== updates[item]) {
                    newUser[item] = updates[item];
                }
            }
        }

        // check if nothing is updated
        if (Object.keys(newUser).length === 0) {
            // no db operation needed because nothing was updated
            return res.status(200).json(oldUser);
        }

        // update user with new details
        const updated = await prisma.users.update({
            where: {
                user_id: req.user.user_id
            },

            data: newUser,

            select: {
                first_name: true,
                last_name: true,
                phone_number: true,
                profile_picture: true
            }
        })

        // return success with updated details
        return res.status(200).json(updated);
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." });
    }
})

export default router;