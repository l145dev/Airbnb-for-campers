import { Router } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

/* get listings. */
router.get('/', async (req, res, next) => {
    const { propType, country, city, guests } = req.query;
    let checkin = req.query.checkin;
    let checkout = req.query.checkout;
    // proptype options: Cabin, Tent, RV, Treehouse, Glamp, Unique, Farm, Yurt
    // checkin/checkout format received is yyyy-mm-dd

    try {
        let listings = [];
        const where_clause = {};

        // transform data to correct capitalization and spelling
        if (propType) {
            // apply filters based on proptype
            switch (propType.toLowerCase()) {
                case "cabins":
                    where_clause.property_type = "Cabin"
                    break;

                case "tents":
                    where_clause.property_type = "Tent"
                    break;

                case "rv":
                    where_clause.property_type = "RV";
                    break;

                case "treehouses":
                    where_clause.property_type = "Treehouse";
                    break;

                case "glamping":
                    where_clause.property_type = "Glamp";
                    break;

                case "unique":
                    where_clause.property_type = "Unique";
                    break;

                case "farms":
                    where_clause.property_type = "Farm";
                    break;

                case "yurts":
                    where_clause.property_type = "Yurt";
                    break;

                default:
                    // filter not found
                    break;
            }
        }

        // more filters, prisma automatically applies "AND" when more filters are selected in the where clause
        if (country) {
            where_clause.country = country;
        }

        if (city) {
            where_clause.city = city;
        }

        if (guests) {
            where_clause.capacity = { gte: parseInt(guests) }; // greater than or equal to guests (minimum capacity to let all guests stay)
        }

        // checkin checkout validation
        if (checkin && checkout) {
            const [ciyear, cimonth, cidate] = checkin.split("-");
            const checkinDate = new Date(parseInt(ciyear), parseInt(cimonth) - 1, parseInt(cidate));
            const [coyear, comonth, codate] = checkout.split("-");
            const checkoutDate = new Date(parseInt(coyear), parseInt(comonth) - 1, parseInt(codate));

            if (checkinDate > checkoutDate) {
                return res.status(400).json({ error: "Check out date much be bigger than, or equal to check in date." })
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

        // listings with props needed and filter applied
        listings = await prisma.properties.findMany({
            where: where_clause,
            select: {
                property_id: true,
                property_type: true,
                city: true,
                country: true,
                owner_id: true,
                price_per_night: true,
                average_rating: true
            }
        });

        // loop through all listings, promises will register all listings as objects in an array
        const promises = listings.map(async (item) => {
            // object with all listing data needed
            const tempObj = {
                ...item,
                owner: "Unknown",
                property_image: "Unknown"
            }

            // get owner
            try {
                // get owner name of property
                const owner = await prisma.users.findUnique({
                    where: {
                        user_id: item.owner_id
                    }
                })

                // store owner name in tempobj
                tempObj.owner = owner.first_name + " " + owner.last_name;
            }

            catch (error) {
                console.log("error: " + error);
            }

            // get image
            try {
                // get main property image of property
                const image = await prisma.property_images.findFirst({
                    where: {
                        property_id: item.property_id,
                        is_main: true
                    }
                })

                // store image in tempobj
                tempObj.property_image = image.image_url;
            }

            catch (error) {
                console.log("error: " + error);
            }

            // filter booking checkin/checkout

            // available by default
            let available = true;

            try {
                // check if checkin or checkout exists
                if (checkin || checkout) {
                    // get bookings of property
                    const property_bookings = await prisma.bookings.findMany({
                        where: {
                            property_id: item.property_id
                        },

                        orderBy: {
                            check_out_date: "desc"
                        },
                    })

                    // if record of booking found
                    if (property_bookings.length > 0) {
                        // checkin filter
                        if (checkin) {
                            const [year, month, date] = checkin.split("-"); // eg 2024-9-18

                            // create checkinDate object, normalize hours
                            const checkinDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(date)); // month - 1 because monthhs are 0 indexed in JS
                            checkinDate.setHours(0, 0, 0, 0);

                            // checkin needs to happen after booking checkout
                            // additionally, check if another checkin isnt already in place
                            // NOT booking checkin <= checkin < booking checkout

                            // check if user check-in date overlaps with any existing booking (looping over property_bookings, checking if SOMETHING returns true) -> becomes opposite implying that its available
                            available = !property_bookings.some(booking => {
                                // create checkinDate booking object, normalize hours
                                const bookingCheckIn = new Date(booking.check_in_date);
                                bookingCheckIn.setHours(0, 0, 0, 0);

                                // create checkoutDate booking object, normalize hours
                                const bookingCheckOut = new Date(booking.check_out_date);
                                bookingCheckOut.setHours(0, 0, 0, 0);

                                // user check-in is within an existing booking (available becomes false if this return is true)
                                return checkinDate >= bookingCheckIn && checkinDate < bookingCheckOut;
                            });
                        }

                        // checkout filter, must have checkin and the checkin must return available true
                        if (checkout && checkin && available) {
                            // chheckout date
                            const [year, month, date] = checkout.split("-"); // eg 2024-9-19

                            const checkoutDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(date)); // JS month is 0 indexed so minus 1
                            checkoutDate.setHours(0, 0, 0, 0);

                            // checkout needs to happen before booking checkin
                            // NOT booking checkin < checkout <= booking checkout

                            // check if user check-out date overlaps with any existing booking (looping over property_bookings, checking if SOMETHING returns true) -> becomes opposite implying that its available
                            available = !property_bookings.some(booking => {
                                // create checkin booking object, normalize hours
                                const bookingCheckIn = new Date(booking.check_in_date);
                                bookingCheckIn.setHours(0, 0, 0, 0);

                                // create checkout booking object, normalize hours
                                const bookingCheckOut = new Date(booking.check_out_date);
                                bookingCheckOut.setHours(0, 0, 0, 0);

                                // user check-out is within an existing booking (available becomes false if this return is true)
                                return checkoutDate > bookingCheckIn && checkoutDate <= bookingCheckOut;
                            });
                        }
                    }
                }

            }

            catch (error) {
                console.log("error: " + error);
            }

            if (available) {
                // return object (gets stored in promises array because of map usage)
                return tempObj;
            }
        })

        // resolve all promises before returning data
        const resolvedListings = (await Promise.all(promises)).filter((item) => {
            if (item !== null) {
                return item;
            }
        });

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