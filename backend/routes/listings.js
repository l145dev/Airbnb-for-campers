import { Router } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

/* get listings. */
router.get('/', async (req, res, next) => {
    try {
        const listings = await prisma.properties.findMany();

        // loop through all listings, promises will register all listings as objects in an array
        const promises = listings.map(async (item) => {
            // object with all listing data needed
            const tempObj = {
                city: item.city,
                country: item.country,
                owner: "",
                price_per_night: item.price_per_night,
                rating: item.average_rating
            }

            // owner
            try {
                // get owner name of property
                const owner = await prisma.users.findFirst({
                    where: {
                        user_id: item.owner_id
                    }
                })

                // store owner name in tempobj
                tempObj.owner = owner.first_name + " " + owner.last_name;
            }

            catch (error) {
                console.log("error: " + error);
                tempObj.owner = "Unknown";
            }

            // return object (gets stored in promises array because of map usage)
            return tempObj;
        })

        // resolve all promises before returning data
        const resolvedListings = await Promise.all(promises);

        // send returnlistings to display on frontend
        return res.status(200).json(resolvedListings);
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
});

export default router;