import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import isAuthenticated from "../middleware/auth.js";
import isHost from "../utils/isHost.js";

const router = Router();

const prisma = new PrismaClient();

const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
};

// get all properties by host
router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        // save host id
        const host_id = parseInt(req.user.user_id);

        // check if host
        const is_owner = await isHost(host_id, prisma);

        if (!is_owner) {
            return res.status(401).json({ success: false, error: "You are not registered as a host" });
        }

        // get properties
        const properties = await prisma.properties.findMany({
            where: {
                owner_id: host_id
            },

            select: {
                property_id: true,
                property_name: true,
                city: true,
                country: true,
                average_rating: true,
                is_active: true
            }
        })

        // get more details for each property
        const promises = properties.map(async (property) => {
            // initial final property object
            const tempObj = {
                ...property,
                reviewCount: 0,
                nextBooking: "N/A",
                totalRevenue: 0,
                totalBookings: 0,
                adr: 0
            }

            // get total review count
            const reviewCount = await prisma.reviews.count({
                where: {
                    property_id: parseInt(property.property_id)
                }
            })

            if (reviewCount) {
                tempObj.reviewCount = reviewCount;
            }

            // get next booking
            const nextBookingRaw = await prisma.bookings.findFirst({
                where: {
                    property_id: parseInt(property.property_id),
                    booking_status: "confirmed" // to come bookings only
                },

                orderBy: {
                    check_in_date: "desc"
                },

                select: {
                    check_in_date: true,
                    check_out_date: true
                }
            })

            if (nextBookingRaw) {
                const formattedCheckinDate = formatDate(nextBookingRaw.check_in_date);
                const formattedCheckoutDate = formatDate(nextBookingRaw.check_out_date);

                const nextBooking = `${formattedCheckinDate} - ${formattedCheckoutDate}`;

                tempObj.nextBooking = nextBooking;

            }

            // get property statistics (total revenue, total bookings, ADR (total revenue / total bookings))
            // total revenue
            const totalRevenueRaw = await prisma.bookings.aggregate({
                where: {
                    property_id: parseInt(property.property_id)
                },

                _sum: {
                    total_price: true
                }
            })

            const totalRevenue = Math.round(totalRevenueRaw._sum.total_price)

            if (totalRevenue) {
                tempObj.totalRevenue = totalRevenue;
            }

            // total bookings
            const totalBookings = await prisma.bookings.count({
                where: {
                    property_id: parseInt(property.property_id),
                }
            })

            if (totalBookings) {
                tempObj.totalBookings = totalBookings;
            }

            // calculate ADR if both constants exist
            if (totalRevenue && totalBookings) {
                const adr = totalRevenue / totalBookings;

                tempObj.adr = adr;
            }

            return tempObj;
        })

        // wait for promise to resolve to avoid empty objects to be sent
        const resolvedPromise = await Promise.all(promises);

        res.status(200).json({ success: true, resolvedPromise })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;