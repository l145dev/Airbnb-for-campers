import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

const prisma = new PrismaClient();

// get notifications
router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        // retrieve notifs
        const notification = await prisma.notifications.findMany({
            where: {
                user_id: parseInt(req.user.user_id)
            }
        })

        // update all notifications retrieved to be read
        await prisma.notifications.updateMany({
            where: {
                user_id: parseInt(req.user.user_id),
                is_read: false
            },
            data: {
                is_read: true
            }
        });

        return res.status(200).json({ notification });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// (moved to util for accessibility accross files)
// add notifications 
// router.post("/", isAuthenticated, async (req, res, next) => {
//     // booking_confirmation, new_review, booking_reminder, property_saved (notification_type)
//     const { notification_type, notification_message, } = req.body;

//     if (!notification_type || !notification_message) {
//         return res.status(400).json({ success: false, error: "Missing parameters" });
//     }

//     try {
//         const notification = await prisma.notifications.create({
//             data: {
//                 user_id: parseInt(req.user.user_id),
//                 notification_type: notification_type,
//                 notification_message: notification_message,
//             }
//         })

//         return res.status(200).json({ success: true, notification });
//     }

//     catch (error) {
//         // unexpected error, log error
//         console.log(error);
//         return res.status(500).json({ error: "An error occured, please try again." })
//     }
// })

// delete notification
router.delete("/", isAuthenticated, async (req, res, next) => {
    const { notification_id } = req.body;

    if (!notification_id) {
        return res.status(400).json({ success: false, error: "Didn't receive notification id" });
    }

    try {
        // check if record found
        const notification = await prisma.notifications.findFirst({
            where: {
                user_id: parseInt(req.user.user_id),
                notification_id: parseInt(notification_id)
            }
        })

        // check if notif exists
        if (!notification) {
            return res.status(400).json({ success: false, error: "Notification could not be deleted." });
        }

        // delete notification
        const deleted_notification = await prisma.notifications.delete({
            where: {
                user_id: parseInt(req.user.user_id),
                notification_id: parseInt(notification_id)
            }
        })

        // check if deleted
        if (!deleted_notification) {
            return res.status(400).json({ success: false, error: "Notification could not be deleted." });
        }

        return res.status(200).json({ success: true, deleted_notification });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;