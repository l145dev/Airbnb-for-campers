import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import isAuthenticated from '../middleware/auth.js';
import checkPropertyAvailability from '../utils/availability.js';

const prisma = new PrismaClient();

const router = Router();

// get property details (all)
router.get("/", async (req, res, next) => {
    const { property_id, guests } = req.query;
    let checkin = req.query.checkin;
    let checkout = req.query.checkout;

    if (!property_id) {
        return res.status(404).json({ error: "Property not found!" });
    }

    // checkin checkout validation
    if (checkin && checkout) {
        const [ciyear, cimonth, cidate] = checkin.split("-");
        const checkinDate = new Date(parseInt(ciyear), parseInt(cimonth) - 1, parseInt(cidate));
        const [coyear, comonth, codate] = checkout.split("-");
        const checkoutDate = new Date(parseInt(coyear), parseInt(comonth) - 1, parseInt(codate));

        if (checkinDate > checkoutDate) {
            return res.status(400).json({ error: "Check out date must be bigger than check in date." })
        }
    }

    // checkin date provided but no checkout
    if (checkin && !checkout) {
        const [ciyear, cimonth, cidate] = checkin.split("-");

        // create checkin date obj, add 1 day
        const checkoutDate = new Date(parseInt(ciyear), parseInt(cimonth) - 1, parseInt(cidate) + 1);

        // assign checkout
        checkout = `${checkoutDate.getFullYear()}-${checkoutDate.getMonth() + 1}-${checkoutDate.getDate()}`
    }

    // checkout date provided but no checkin
    if (checkout && !checkin) {
        const [coyear, comonth, codate] = checkout.split("-");

        // create checkindate which is 1 day before checkout (should already be done by fronted)
        const checkinDate = new Date(parseInt(coyear), parseInt(comonth) - 1, parseInt(codate) - 1);

        // assign checkin
        checkin = `${checkinDate.getFullYear()}-${checkinDate.getMonth() + 1}-${checkinDate.getDate()}`
    }

    // check availability 
    let dates_available = await checkPropertyAvailability(parseInt(property_id), checkin, checkout, prisma);

    try {
        // get main property info
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id),
                is_active: true
            }
        })

        if (!property) {
            return res.status(404).json({ error: "Property not found!" });
        }

        // check guest capacity
        const capacity = property.capacity;

        let guest_overflow = false;

        if (guests) {
            if (capacity < guests) {
                guest_overflow = true;
            }
        }

        // get property details
        const property_details = await prisma.property_details.findUnique({
            where: {
                property_id: parseInt(property_id)
            },

            // select: {
            //     property_detail_id: false,
            //     property_id: false,
            // }
        })

        // get property images
        const property_images = await prisma.property_images.findMany({
            where: {
                property_id: parseInt(property_id)
            }
        })

        // get property owner
        const owner = await prisma.users.findUnique({
            where: {
                user_id: property.owner_id
            }
        })

        const owner_full_name = owner.first_name + " " + owner.last_name;
        const owner_url = owner.profile_picture ? owner.profile_picture : "https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/avatar/default.png";

        // get property reviews
        const reviews = await prisma.reviews.findMany({
            where: {
                property_id: parseInt(property_id)
            }
        })

        // get reviewer details -> name, profile picture
        for (let i = 0; i < reviews.length; i++) {
            const reviewer = await prisma.users.findUnique({
                where: {
                    user_id: reviews[i].guest_id
                },

                select: {
                    first_name: true,
                    last_name: true,
                    profile_picture: true
                }
            })

            // add reviewer details to review
            reviews[i].reviewer_full_name = reviewer.first_name + " " + reviewer.last_name;
            reviews[i].reviewer_url = reviewer.profile_picture ? reviewer.profile_picture : "https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/avatar/default.png";
        }

        let property_saved = false;

        // check if user saved this property
        // check if logged in
        if (req.session && req.session.loggedIn && req.session.userId) {
            // check if property is saved
            const save = await prisma.user_saves.findUnique({
                where: {
                    user_id_property_id: {
                        user_id: req.session.userId,
                        property_id: parseInt(property_id)
                    }
                }
            })

            if (save) {
                property_saved = true;
            }
        }

        const allDetails = {
            dates_available,
            guest_overflow,
            ...property,
            checkin,
            checkout,
            guests,
            owner_full_name,
            owner_url,
            property_saved,
            reviews_count: reviews.length,
            details: property_details,
            images: [...property_images],
            reviews: [...reviews]
        }

        return res.status(200).json({ success: true, allDetails })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// save and unsave 
router.post("/save", isAuthenticated, async (req, res, next) => {
    const { property_id } = req.body;

    if (!property_id) {
        return res.status(404).json({ error: "Property not found!" });
    }

    try {
        // check if property is saved
        const save = await prisma.user_saves.findUnique({
            where: {
                user_id_property_id: {
                    user_id: req.user.user_id,
                    property_id: property_id
                }
            }
        })

        let message = "";

        // property needs to be unsaved
        if (save) {
            await prisma.user_saves.delete({
                where: {
                    user_id_property_id: {
                        user_id: req.user.user_id,
                        property_id: property_id
                    }
                }
            })

            message = "Unsaved";
        }

        // property needs to be saved
        else {
            await prisma.user_saves.create({
                data: {
                    user_id: req.user.user_id,
                    property_id: property_id
                }
            })

            message = "Saved";
        }

        return res.status(200).json({ success: true, message: message });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);

        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;