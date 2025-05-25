import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import isAuthenticated from '../middleware/auth.js';
import checkPropertyAvailability from '../utils/availability.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import createNotification from '../utils/createNotification.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_TEST_KEY);

const prisma = new PrismaClient();

const router = Router();

const calcNights = (checkinDate, checkoutDate) => {
    // Calculate the difference in milliseconds
    const differenceInMilliseconds = checkoutDate.getTime() - checkinDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    // The number of nights is one less than the number of days between check-in and check-out
    return differenceInDays;
}

// check if login/register needs to be shown or directly the payment info
router.get("/", isAuthenticated, (req, res, next) => {
    res.status(200).json({ success: true, message: "User is authenticated" });
})

// if user updates dates
router.post("/update/dates", async (req, res, next) => {
    const { property_id } = req.body;
    let checkin = req.body.checkin;
    let checkout = req.body.checkout;

    if (!property_id || !checkin || !checkout) {
        return res.status(400).json({ error: "Missing parameter." });
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
        if (!dates_available) {
            return res.status(400).json({ success: false, error: "Dates not available." });
        }

        return res.status(200).json({ success: true, message: "Dates available" });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

router.post("/update/guests", async (req, res, next) => {
    const { property_id, guests } = req.body;

    if (!guests) {
        return res.status(400).json({ error: "Missing parameter." });
    }

    try {
        // get main property info
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },

            select: {
                capacity: true
            }
        })

        if (!property) {
            return res.status(404).json({ error: "Property not found!" });
        }

        // check guest capacity
        const capacity = property.capacity;

        if (guests) {
            if (capacity < guests) {
                return res.status(400).json({ success: false, error: "Too many guests" });
            }

            return res.status(200).json({ success: true, message: "Within guest limit" });
        }

        return res.status(400).json({ success: false, error: "Property capacity not found." });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// payment gateway (normal)
router.post("/pay", isAuthenticated, async (req, res, next) => {
    const { property_id, checkin, checkout, guests } = req.body;

    if (!property_id || !checkin || !checkout || !guests) {
        return res.status(400).json({ error: "Missing parameter." });
    }

    try {
        // get property details
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },

            select: {
                property_name: true,
                price_per_night: true
            }
        })

        // nights calculcation
        // process checkin and checkout
        const [ciyear, cimonth, cidate] = checkin.split("-");
        const checkinDate = new Date(ciyear, cimonth - 1, cidate);

        const [coyear, comonth, codate] = checkout.split("-");
        const checkoutDate = new Date(coyear, comonth - 1, codate);

        const numberOfNights = calcNights(checkinDate, checkoutDate);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'bancontact', 'paypal'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        unit_amount: ((property.price_per_night * numberOfNights) + 20) * 100, // convert amount eg 200 eur into cents -> 200000
                        product_data: {
                            name: property.property_name,
                        },
                    },
                    quantity: 1
                }
            ],
            success_url: `http://localhost:5173/book?property_id=${property_id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&success=true`, //success page (booking confirmed page)
            cancel_url: `http://localhost:5173/property?property_id=${property_id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}` // canceled page (back to propertydetails)
        })

        return res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe payment error:", error);
        return res.status(500).json({ error: "Payment failed. Please try again." });
    }
});

// payyement gateway (klarna)
router.post("/pay/klarna", async (req, res, next) => {
    const { property_id, checkin, checkout, guests } = req.body;

    if (!property_id || !checkin || !checkout || !guests) {
        return res.status(400).json({ error: "Missing parameter." });
    }

    try {
        // get property details
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },

            select: {
                property_name: true,
                price_per_night: true
            }
        })

        // nights calculcation
        // process checkin and checkout
        const [ciyear, cimonth, cidate] = checkin.split("-");
        const checkinDate = new Date(ciyear, cimonth - 1, cidate);

        const [coyear, comonth, codate] = checkout.split("-");
        const checkoutDate = new Date(coyear, comonth - 1, codate);

        const numberOfNights = calcNights(checkinDate, checkoutDate);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['klarna'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        unit_amount: ((property.price_per_night * numberOfNights) + 20) * 100, // convert amount eg 200 eur into cents -> 200000
                        product_data: {
                            name: property.property_name,
                        },
                    },
                    quantity: 1
                }
            ],
            success_url: `http://localhost:5173/book?property_id=${property_id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}&success=true`, //success page (booking confirmed page)
            cancel_url: `http://localhost:5173/property?property_id=${property_id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}` // canceled page (back to propertydetails)
        })

        return res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe payment error:", error);
        return res.status(500).json({ error: "Payment failed. Please try again." });
    }
})

// unsecured route, would not do this in a real project, a db table with payment success token linked to user on success and checking if its correct here would be my way of solving this
router.get("/success", isAuthenticated, async (req, res, next) => {
    const { property_id, guests } = req.query;
    let checkin = req.query.checkin;
    let checkout = req.query.checkout;

    if (!property_id || !guests || !checkin || !checkout) {
        return res.status(400).json({ error: "Missing parameter." });
    }

    try {
        // get property details
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },
            select: {
                property_id: true,
                property_name: true,
                note_from_owner: true,
                owner_id: true,
                price_per_night: true,
            }
        })

        // get user details
        const user = await prisma.users.findUnique({
            where: {
                user_id: req.user.user_id
            },

            select: {
                email: true
            }
        })

        const user_email = user.email;

        // process checkin and checkout -> overlapping bookings check
        const [ciyear, cimonth, cidate] = checkin.split("-");
        const checkinDate = new Date(ciyear, cimonth - 1, cidate);

        const [coyear, comonth, codate] = checkout.split("-");
        const checkoutDate = new Date(coyear, comonth - 1, codate);

        const numberOfNights = calcNights(checkinDate, checkoutDate);

        // Check for existing overlapping bookings for the same property and user
        const overlappingBooking = await prisma.bookings.findFirst({
            where: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id,
                OR: [
                    {
                        check_in_date: { lte: checkoutDate },
                        check_out_date: { gt: checkinDate },
                    },
                    // Optional: Consider bookings that start exactly on the requested checkout or end exactly on the requested checkin as non-overlapping. Remove these conditions if you want to strictly disallow even these edge cases.
                    // {
                    //     check_in_date: checkinDate,
                    //     check_out_date: checkoutDate
                    // }
                ],
            },
        });

        if (overlappingBooking) {
            return res.status(409).json({ success: false, error: "You already made this booking." })
        }

        // create booking
        const booking = await prisma.bookings.create({
            data: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id,
                check_in_date: checkinDate,
                check_out_date: checkoutDate,
                total_price: numberOfNights * property.price_per_night,
                booking_status: "confirmed",
                number_of_guests: parseInt(guests)
            }
        })

        const booking_id = booking.booking_id;

        // object which will be returned in case success
        const returnObj = {
            ...property,
            user_email,
            booking_id
        };

        const formatDate = (date) => {
            const options = { day: 'numeric', month: 'long' };
            return date.toLocaleDateString('en-US', options);
        };

        const formattedCheckinDate = formatDate(checkinDate);
        const formattedCheckoutDate = formatDate(checkoutDate);

        // example usage of create notification (will only use it here to not complicate things, due to time limit)
        createNotification(
            "booking_confirmation",
            `Your booking at ${property.property_name} from ${formattedCheckinDate} to ${formattedCheckoutDate} has been confirmed.`,
            req.user.user_id,
            prisma
        );

        res.status(200).json({ success: true, returnObj })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// get property details, but return only some details
router.get("/pricecard", async (req, res, next) => {
    const { property_id } = req.query;

    if (!property_id) {
        return res.status(404).json({ error: "Property not found!" });
    }

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

        // get property owner
        const owner = await prisma.users.findUnique({
            where: {
                user_id: property.owner_id
            }
        })

        if (!owner) {
            return res.status(404).json({ error: "Owner not found!" });
        }

        const owner_full_name = owner.first_name + " " + owner.last_name;

        // get reviews count
        const reviews_count = await prisma.reviews.count({
            where: {
                property_id: parseInt(property_id)
            }
        })

        // get property main image
        const property_main_image = await prisma.property_images.findFirst({
            where: {
                property_id: parseInt(property_id),
                is_main: true
            }
        })

        const allDetails = {
            property_id,
            property_name: property.property_name,
            average_rating: property.average_rating,
            owner_full_name,
            price: property.price,
            reviews_count,
            price_per_night: property.price_per_night,
            main_image: property_main_image.image_url
        }

        return res.status(200).json({ allDetails });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;