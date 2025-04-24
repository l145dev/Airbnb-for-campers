import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import isAuthenticated from '../middleware/auth.js';

const prisma = new PrismaClient();

const router = Router();

router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const bookings = await prisma.bookings.findMany({
            where: {
                guest_id: req.user.user_id
            }
        })

        // no bookings
        if (bookings.length <= 0) {
            return res.status(404).json({ success: true, message: "No bookings found!" });
        }

        // gives back an array of objects (bookings)
        const promises = bookings.map(async (booking) => {
            const tempObj = {
                property_id: booking.property_id,
                property_name: "N/A",
                owner: "N/A",
                owner_id: "N/A",
                reviews_count: "N/A",
                average_rating: "N/A",
                booking_id: booking.booking_id,
                checkin: booking.check_in_date,
                checkout: booking.check_out_date,
                guests: booking.number_of_guests,
                price_paid: parseInt(booking.total_price),
                booking_status: booking.booking_status
            }

            // get property info
            const property = await prisma.properties.findUnique({
                where: {
                    property_id: parseInt(booking.property_id)
                },

                select: {
                    property_id: true,
                    property_name: true,
                    average_rating: true,
                    owner_id: true
                }
            })

            if (property) {
                tempObj.property_name = property.property_name;
                tempObj.average_rating = parseFloat(property.average_rating);
            }

            // get owner
            const owner = await prisma.users.findUnique({
                where: {
                    user_id: parseInt(property.owner_id)
                },

                select: {
                    first_name: true,
                    last_name: true,
                    user_id: true
                }
            })

            if (owner) {
                tempObj.owner_id = parseInt(owner.user_id);
                tempObj.owner = owner.first_name + " " + owner.last_name;
            }

            // get review count
            const reviewCount = await prisma.reviews.count({
                where: {
                    property_id: parseInt(booking.property_id)
                }
            })

            if (reviewCount) {
                tempObj.reviews_count = parseInt(reviewCount);
            }

            // return object
            return tempObj;
        })

        const resolvedDetails = await Promise.all(promises);

        return res.status(200).json({ success: true, resolvedDetails })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;