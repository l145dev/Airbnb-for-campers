import { Router } from 'express';
import { PrismaClient } from "@prisma/client";
import isAuthenticated from '../middleware/auth.js';

const prisma = new PrismaClient();

const router = Router();

// get the trips
router.get("/", isAuthenticated, async (req, res, next) => {
    try {
        const bookings = await prisma.bookings.findMany({
            where: {
                guest_id: req.user.user_id
            },

            orderBy: {
                booking_id: 'desc'
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
                reviews_count: "0",
                average_rating: "N/A",
                image_url: "N/A",
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

            // get property image
            const mainImage = await prisma.property_images.findFirst({
                where: {
                    property_id: parseInt(property.property_id),
                    is_main: true
                },

                select: {
                    image_url: true
                }
            })

            if (mainImage) {
                tempObj.image_url = mainImage.image_url;
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

        // wait for promise to resolve
        const resolvedDetails = await Promise.all(promises);

        return res.status(200).json({ success: true, resolvedDetails })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// get review details if there are any
router.get("/review", isAuthenticated, async (req, res, next) => {
    const { property_id } = req.query;

    if (!property_id) {
        return res.status(400).json({ error: "Cannot find property" });
    }

    try {
        // get property
        const property = await prisma.properties.findUnique({
            where: {
                property_id: parseInt(property_id)
            },

            select: {
                property_name: true
            }
        })

        if (!property) {
            return res.status(400).json({ error: "Property not found" })
        }

        const property_name = property.property_name;

        // get review details (editing review)
        const review = await prisma.reviews.findFirst({
            where: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id
            },

            select: {
                review_id: true,
                comment: true,
                rating: true,
            }
        })

        if (!review) {
            const returnObj = {
                property_name
            }

            return res.status(200).json({ returnObj })
        }

        const returnObj = {
            property_name,
            review_id: review.review_id,
            comment: review.comment,
            rating: review.rating
        }

        return res.status(200).json({ returnObj })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// post a review
router.post("/review", isAuthenticated, async (req, res, next) => {
    const { property_id, comment, rating } = req.body;

    // check for missing mandatory  details
    if (!rating) {
        return res.status(400).json({ error: "Rating is mandatory" });
    }

    if (!property_id) {
        return res.status(400).json({ error: "Property not found" });
    }

    try {
        // chheck if duplicate exists
        const dupe = await prisma.reviews.findFirst({
            where: {
                guest_id: req.user.user_id,
                property_id: parseInt(property_id)
            }
        })

        if (dupe) {
            return res.status(409).json({ error: "Cannot review same property multiple times." })
        }

        // create the review
        const review = await prisma.reviews.create({
            data: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id,
                comment: comment,
                rating: parseFloat(rating)
            }
        })

        // get booking id
        const booking = await prisma.bookings.findFirst({
            where: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id
            },
            select: {
                booking_id: true
            }
        })

        if (!booking) {
            return res.status(400).json({ error: "Booking not found" });
        }

        // update booking status to reviewed
        await prisma.bookings.update({
            where: {
                booking_id: parseInt(booking.booking_id)
            },

            data: {
                booking_status: "reviewed"
            }
        })

        return res.status(200).json({ review });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// edit a review
router.patch("/review", isAuthenticated, async (req, res, next) => {
    const property_id = req.body.property_id;
    const updates = req.body; // const { property_id, comment, rating } = req.body;

    if (!property_id) {
        return res.status(400).json({ error: "Review not found" })
    }

    try {
        // get existing review
        const oldReview = await prisma.reviews.findFirst({
            where: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id
            },

            select: {
                review_id: true,
                property_id: true,
                comment: true,
                rating: true,
                guest_id: true
            }
        })

        if (!oldReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (oldReview.guest_id !== req.user.user_id) {
            return res.status(400).json({ error: "You cannot edit this review" });
        }

        // new review storage
        const newReview = {};

        for (const item in oldReview) {
            // ignore prototypes in object (preventing unwanted JS behavior)
            if (updates.hasOwnProperty(item)) {
                // check if exists and update needed
                if (oldReview[item] !== undefined && oldReview[item] !== updates[item]) {
                    newReview[item] = updates[item];
                }
            }
        }

        // check if nothing is updated
        if (Object.keys(newReview).length === 0) {
            // no db operation needed because nothing was updated
            return res.status(200).json({ newReview });
        }

        // update user with new details
        const updated = await prisma.reviews.update({
            where: {
                review_id: parseInt(oldReview.review_id)
            },

            data: newReview,

            select: {
                property_id: true,
                comment: true,
                rating: true,
            }
        })

        // return success with updated details
        return res.status(200).json({ updated });
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

// delete review
router.delete("/review", isAuthenticated, async (req, res, next) => {
    const { property_id } = req.body;

    if (!property_id) {
        return res.status(400).json({ error: "Review not found" })
    }

    try {
        // get review to compare user ids
        const review = await prisma.reviews.findFirst({
            where: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id
            },

            select: {
                guest_id: true,
                review_id: true
            }
        })

        if (!review) {
            return res.status(400).json({ error: "Review not found" })
        }

        // dont allow unauthorized deletions
        if (review.guest_id !== req.user.user_id) {
            return res.status(400).json({ error: "You cannot delete this review" });
        }

        // delete the review
        const deletedReview = await prisma.reviews.delete({
            where: {
                review_id: parseInt(review.review_id)
            }
        })

        // get booking id
        const booking = await prisma.bookings.findFirst({
            where: {
                property_id: parseInt(property_id),
                guest_id: req.user.user_id
            },

            select: {
                booking_id: true
            }
        })

        // update booking status to passed
        await prisma.bookings.update({
            where: {
                booking_id: parseInt(booking.booking_id)
            },

            data: {
                booking_status: "passed"
            }
        })

        return res.status(200).json({ deletedReview })
    }

    catch (error) {
        // unexpected error, log error
        console.log(error);
        return res.status(500).json({ error: "An error occured, please try again." })
    }
})

export default router;