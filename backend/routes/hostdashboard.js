import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import isAuthenticated from "../middleware/auth.js";
import isHost from "../utils/isHost.js";
import axios from "axios";

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

// get details to modifying property details
router.get("/modify", isAuthenticated, async (req, res, next) => {
    const { property_id } = req.query;

    if (!property_id) {
        return res.status(400).json({ success: false, error: "No property_id provided" });
    }

    try {
        // save host id
        const host_id = parseInt(req.user.user_id);

        // check if host
        const is_owner = await isHost(host_id, prisma);

        if (!is_owner) {
            return res.status(401).json({ success: false, error: "You are not registered as a host" });
        }

        // get property details
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },

            select: {
                property_id: true,
                property_name: true,
                property_description: true,
                city: true,
                country: true,
                property_type: true,
                check_in_time: true,
                check_out_time: true,
                price_per_night: true,
                capacity: true,
                note_from_owner: true,
                longitude: true,
                latitude: true,
            }
        })

        if (!property) {
            return res.status(400).json({ success: false, error: "No property found" });
        }

        // fix up property details
        // checkin checkout
        property.check_in_time = new Date(property.check_in_time).getHours();
        property.check_out_time = new Date(property.check_out_time).getHours();

        // get road and housenumber -> street address
        // this opensource api is a blessing 🙏
        const url = `https://nominatim.openstreetmap.org/reverse.php?lat=${property.latitude}&lon=${property.longitude}&zoom=18&format=jsonv2`
        const location = await axios.get(url);
        const houseNumber = location.data.address.house_number;
        const road = location.data.address.road;
        const streetAddress = `${houseNumber} ${road}`;

        // get postcode
        const postcode = location.data.address.postcode;

        // get property details
        const amenities = await prisma.property_details.findUnique({
            where: {
                property_id: parseInt(property_id)
            }
        })

        const returnObj = {
            ...property,
            amenities: amenities,
            streetAddress,
            postcode
        }

        return res.status(200).json({ success: true, returnObj })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// modify the property
// get details to modifying property details
router.patch("/modify", isAuthenticated, async (req, res, next) => {
    const { property_id, property_name, property_description, street_address, postcode, city, country, property_type, check_in_time_raw, check_out_time_raw, price_per_night, capacity, note_from_owner } = req.body;
    const amenities_updates = req.body.amenities;

    if (!property_id) {
        return res.status(400).json({ success: false, error: "No property_id provided" });
    }

    try {
        // save host id
        const host_id = parseInt(req.user.user_id);

        // check if host
        const is_owner = await isHost(host_id, prisma);

        if (!is_owner) {
            return res.status(401).json({ success: false, error: "You are not registered as a host" });
        }

        // find exact address to put into long/lat, implicit location validation
        const cleanedAddress = street_address.replace(" ", "+");
        const cleanedCity = city.replace(" ", "+");
        const cleanedCountry = country.replace(" ", "+")
        const url = `https://nominatim.openstreetmap.org/search.php?street=${cleanedAddress}&city=${cleanedCity}&country=${cleanedCountry}&postalcode=${parseInt(postcode)}&format=jsonv2`;
        const locations = await axios.get(url);

        if (locations.data.length <= 0) {
            return res.status(400).json({ success: false, error: "Location not found, maybe it's the street address? Correct street address format: 110 Broadway" });
        }

        // get first (most accurate location)
        const location = locations.data[0];

        // get long/lat
        const longitude = location.lon;
        const latitude = location.lat;

        // checkin and checkout formatting -> logic accross codebase can be improved a lot for accuracy & consistency, no time to do that for now, this is also the reason why i hate working with dates in code
        const check_in_time = new Date(Date.UTC(1970, 0, 1, parseInt(check_in_time_raw), 0, 0));
        const check_out_time = new Date(Date.UTC(1970, 0, 1, parseInt(check_out_time_raw), 0, 0));

        // object with all values to possibly update
        const updates = {
            property_name,
            property_description,
            longitude,
            latitude,
            check_in_time,
            check_out_time,
            city,
            country,
            property_type,
            price_per_night,
            capacity,
            note_from_owner
        }

        // get existing property
        const oldProperty = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },
        })

        if (!oldProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        // update property
        const newProperty = {};

        // iterate through values
        for (const item in oldProperty) {
            // ignore prototypes in object (preventing unwanted JS behavior)
            if (updates.hasOwnProperty(item)) {
                // check if exists and update needed
                if (oldProperty[item] !== undefined && oldProperty[item] !== updates[item]) {
                    newProperty[item] = updates[item];
                }
            }
        }

        // get existing property details
        const oldAmenities = await prisma.property_details.findUnique({
            where: {
                property_id: parseInt(property_id)
            }
        })

        if (!oldAmenities) {
            return res.status(404).json({ error: "Property details (facilities & amenities) not found" });
        }

        // update property details
        const newAmenities = {};

        // iterate through values
        for (const item in oldAmenities) {
            // ignore prototypes in object (preventing unwanted JS behavior)
            if (amenities_updates.hasOwnProperty(item)) {
                // check if exists and update needed
                if (oldAmenities[item] !== undefined && oldAmenities[item] !== amenities_updates[item]) {
                    newAmenities[item] = amenities_updates[item];
                }
            }
        }

        let updateNeededProperty = true;
        let updateNeededAmenities = true;

        // console.log(newProperty); // uncomment this to see the bug (javascript thinks these variables are different from DB because of incorrect assumption of datatypes -> mismatch between JS and PostgreSQL)

        // check if nothing is updated
        if (Object.keys(newProperty).length === 0) {
            // no db operation needed because nothing was updated
            updateNeededProperty = false;
        }

        // check if nothing is updated
        if (Object.keys(newAmenities).length === 0) {
            // no db operation needed because nothing was updated
            updateNeededAmenities = false;
        }

        // both updated
        if (updateNeededAmenities && updateNeededProperty) {
            // update property with new details
            const updatedProperty = await prisma.properties.update({
                where: {
                    property_id: parseInt(property_id)
                },

                data: newProperty,
            })

            // update property details with new details
            const updatedAmenities = await prisma.property_details.update({
                where: {
                    property_id: parseInt(property_id)
                },

                data: newAmenities,
            })

            const returnObj = {
                ...updatedProperty,
                amenities: updatedAmenities
            }

            return res.status(200).json({ success: true, returnObj, message: "amenities and property updated" })
        }

        // property details updated
        else if (updateNeededAmenities && !updateNeededProperty) {
            // update property details with new details
            const updatedAmenities = await prisma.property_details.update({
                where: {
                    property_id: parseInt(property_id)
                },

                data: newAmenities,
            })

            const returnObj = {
                ...oldProperty,
                amenities: updatedAmenities
            }

            return res.status(200).json({ success: true, returnObj, message: "amenities updated" })
        }

        // property updated
        else if (!updateNeededAmenities && updateNeededProperty) {
            // update property with new details
            const updatedProperty = await prisma.properties.update({
                where: {
                    property_id: parseInt(property_id)
                },

                data: newProperty,
            })

            const returnObj = {
                ...updatedProperty,
                amenities: oldAmenities
            }

            return res.status(200).json({ success: true, returnObj, message: "property updated" })
        }

        return res.status(200).json({ success: true, message: "No updates made." })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// publish/unpublish property 
router.patch("/publish", isAuthenticated, async (req, res, next) => {
    const { property_id, published } = req.body;

    if (!property_id) {
        return res.status(400).json({ success: false, error: "No property_id provided" });
    }

    try {
        // save host id
        const host_id = parseInt(req.user.user_id);

        // check if host
        const is_owner = await isHost(host_id, prisma);

        if (!is_owner) {
            return res.status(401).json({ success: false, error: "You are not registered as a host" });
        }

        // update activity state of property
        const property = await prisma.properties.update({
            where: {
                property_id: parseInt(property_id)
            },

            data: {
                is_active: !published // opposite of current state (toggle)
            }
        })

        return res.status(200).json({ success: true, property });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;