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
router.post('/update', isAuthenticated, async (req, res, next) => {
    // get (new) values from frontend
    const { fn, ln, phone, pfp } = req.body;

    // get user
    const user = await prisma.users.findUnique({
        where: {
            user_id: req.user.user_id
        }
    })

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        // update firstname
        if (fn !== user.first_name) {
            await prisma.users.update({
                where: {
                    user_id: req.user.user_id
                },

                data: {
                    first_name: fn
                }
            })
        }

        // update lastname
        if (ln !== user.last_name) {
            await prisma.users.update({
                where: {
                    user_id: req.user.user_id
                },

                data: {
                    last_name: ln
                }
            })
        }

        // update phone number
        if (phone !== user.phone_number) {
            await prisma.users.update({
                where: {
                    user_id: req.user.user_id
                },

                data: {
                    phone_number: phone
                }
            })
        }

        // update profile picture
        if (pfp !== user.profile_picture) {
            await prisma.users.update({
                where: {
                    user_id: req.user.user_id
                },

                data: {
                    profile_picture: pfp
                }
            })
        }

        const updatedUser = await prisma.users.findUnique({
            where: {
                user_id: req.user.user_id
            },

            select: {
                first_name: true,
                last_name: true,
                phone_number: true,
                profile_picture: true,
            }
        });

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser })
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." });
    }
})

export default router;