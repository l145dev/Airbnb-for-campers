import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import checkPropertyAvailability from '../utils/availability.js';
import isAuthenticated from '../middleware/auth.js';
import isHost from '../utils/isHost.js';
import axios from 'axios';

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

        // only list properties thatt ar eactive
        where_clause.is_active = true;

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
                property_name: true,
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
                owner: "N/A",
                property_image: "N/A",
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
            let available = await checkPropertyAvailability(item.property_id, checkin, checkout, prisma);

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

// add listing
router.post("/", isAuthenticated, async (req, res, next) => {
    const { is_active, property_name, property_description, street_address, postcode, city, country, property_type, check_in_time_raw, check_out_time_raw, price_per_night, capacity, note_from_owner } = req.body;
    const amenities_add = req.body.amenities; // object of booleans
    const images_add = req.body.images; // array of images

    try {
        // save host id
        const owner_id = parseInt(req.user.user_id);

        // check if host
        const is_owner = await isHost(owner_id, prisma);

        if (!is_owner) {
            return res.status(401).json({ success: false, error: "You are not registered as a host" });
        }

        // find exact address to put into long/lat, implicit location validation
        const cleanedAddress = street_address.replaceAll(" ", "+");
        const cleanedCity = city.replaceAll(" ", "+");
        const cleanedCountry = country.replaceAll(" ", "+")
        const url = `https://nominatim.openstreetmap.org/search.php?street=${cleanedAddress}&city=${cleanedCity}&country=${cleanedCountry}&postalcode=${parseInt(postcode)}&format=jsonv2`;
        console.log(url);
        const locations = await axios.get(url);

        if (locations.data.length <= 0) {
            return res.status(400).json({ success: false, error: "Location not found, maybe it's the street address? Correct street address format: 110 Broadway" });
        }

        // get first (most accurate location)
        const location = locations.data[0];

        // get long/lat
        const longitude = location.lon;
        const latitude = location.lat;

        // check if property with this long/lat already exists -> dupe!
        const dupe = await prisma.properties.findFirst({
            where: {
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude)
            }
        })

        if (dupe) {
            return res.status(409).json({ success: false, error: "Property at this location already exists." });
        }

        // checkin and checkout formatting -> logic accross codebase can be improved a lot for accuracy & consistency, no time to do that for now, this is also the reason why i hate working with dates in code
        const check_in_time = new Date(Date.UTC(1970, 0, 1, parseInt(check_in_time_raw), 0, 0));
        const check_out_time = new Date(Date.UTC(1970, 0, 1, parseInt(check_out_time_raw), 0, 0));

        // object with all values to add
        const property_data = {
            property_name,
            property_description,
            owner_id,
            longitude,
            latitude,
            check_in_time,
            check_out_time,
            city,
            country,
            property_type,
            price_per_night,
            capacity,
            note_from_owner,
            is_active // if true, instantly publish, if not, save for later
        }

        // add values
        const property = await prisma.properties.create({
            data: property_data
        })

        if (!property) {
            return res.status(400).json({ success: false, error: "Could not create property. Issue: Adding property" });
        }

        // object with values to add for property details
        const amenities_data = {
            property_id: parseInt(property.property_id),
            ...amenities_add
        }

        // add values
        const amenties = await prisma.property_details.create({
            data: amenities_data
        })

        if (!amenties) {
            return res.status(400).json({ success: false, error: "Could not create property. Issue: Adding amenities & facilities" });
        }

        // check if images have been provided
        if (images_add.length > 0) {
            // first image is main
            const image = await prisma.property_images.create({
                data: {
                    property_id: parseInt(property.property_id),
                    image_url: images_add[0],
                    is_main: true
                }
            })

            if (!image) {
                res.status(400).json({ success: false, error: "Something went wrong while uploading images." });
            }

            // add rest of the images if there are more
            if (images_add.length > 1) {
                // add rest of the images
                for (let i = 1; i < images_add.length; i++) {
                    const image = await prisma.property_images.create({
                        data: {
                            property_id: parseInt(property.property_id),
                            image_url: images_add[i],
                            is_main: false
                        }
                    })

                    if (!image) {
                        res.status(400).json({ success: false, error: "Something went wrong while uploading images." });
                    }
                }
            }
        }

        else {
            return res.status(400).json({ success: false, error: "Must at least provide 1 image of property." })
        }

        // get images which have been created (cannot access because of scope so need to call it here, could optimize this but im lazy)
        const images = await prisma.property_images.findMany({
            where: {
                property_id: parseInt(property.property_id)
            }
        })

        // create an object with all data together
        const returnObj = {
            ...property,
            amenities: amenties,
            images: [...images]
        }

        return res.status(200).json({ success: true, returnObj });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;