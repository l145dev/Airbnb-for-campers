import { Router } from 'express';
import isAuthenticated from '../middleware/auth.js';

const router = Router();

// logout user
router.post('/', isAuthenticated, (req, res, next) => {
    // logout user by terminating session and removing cookie

    try {
        // end session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ error: "Failed to destroy session." });
            }

            // clear cookie
            res.clearCookie('connect.sid');

            return res.status(200).json({
                success: true,
            });
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." });
    }
})

export default router;