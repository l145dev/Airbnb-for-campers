import { Router } from "express";
import { PrismaClient } from "@prisma/client";
// import isAuthenticated from "../middleware/auth.js"; // probably dont need auth for this
import isHost from "../utils/isHost.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

const prisma = new PrismaClient();

// get host intro or smth my mind cant think of what to write here
router.get("/", async (req, res, next) => {
    let { city, country, nights, property_type, guests } = req.query;

    // conditional whereclause
    const whereClause = {};

    // to speed up dev time
    if (!city) {
        // could use geolocation
        whereClause.city = "Hogsmeade";
    }

    if (!country) {
        // could use geolocation
        whereClause.country = "United Kingdom";
    }

    if (!nights) {
        // default 7 nights
        nights = 7;
    }

    if (!guests && !isNaN(parseInt(guests))) {
        // lower than or equal to guests
        whereClause.capacity = { lte: parseInt(guests) };
    }

    if (!property_type) {
        // add to where clause anyways (prisma handles null/undefined implicitly)
        whereClause.property_type = property_type;
    }

    try {
        // get all properties
        const properties = await prisma.properties.findMany({
            where: whereClause,

            select: {
                property_id: true,
                property_name: true,
                average_rating: true,
                price_per_night: true,
                capacity: true,
                property_images: true,
                longitude: true,
                latitude: true
            }
        });

        // calculate average prices of property in city
        const totalSum = properties.reduce((sum, property) => {
            return sum + parseInt(property.price_per_night);
        }, 0);

        if (properties.length <= 0) {
            return res.status(400).json({ message: "No properties in this city." });
        }

        const averageNightPrice = Math.round(totalSum / properties.length);

        const totalNightsValue = averageNightPrice * parseInt(nights);

        let is_owner = false;

        // check if user is already a host
        if (req.session && req.session.loggedIn && req.session.userId) {
            is_owner = await isHost(parseInt(req.session.userId), prisma);
        }

        // create return object with all info
        const returnObj = {
            properties: properties,
            averageNightPrice: averageNightPrice,
            totalNightsValue: totalNightsValue,
            is_owner: is_owner
        }

        return res.status(200).json({ returnObj })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

router.post("/", isAuthenticated, async (req, res, next) => {
    // become a host
    try {
        await prisma.users.update({
            where: {
                user_id: parseInt(req.user.user_id)
            },

            data: {
                is_owner: true
            }
        })

        return res.status(200).json({ message: "You are now a host." })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;