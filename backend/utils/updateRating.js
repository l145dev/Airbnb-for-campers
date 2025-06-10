const updateRating = async (property_id, prisma) => {

    // update average rating
    const reviews = await prisma.reviews.findMany({
        where: {
            property_id: parseInt(property_id)
        },

        select: {
            rating: true
        }
    })

    let average = 0;

    if (reviews && reviews.length > 0) {
        for (let i = 0; i < reviews.length; i++) {
            average += reviews[i].rating;
        }

        average = average / reviews.length;
    }

    // update average rating
    const updatedProp = await prisma.properties.update({
        where: {
            property_id: parseInt(property_id)
        },

        data: {
            average_rating: average
        }
    })

    if (!updatedProp) {
        return false;
    }

    return true;
}

export default updateRating;