const checkPropertyAvailability = async (propertyId, checkin, checkout, prisma) => {
    try {
        // check if checkin or checkout exists
        if (checkin || checkout) {
            // get bookings of property
            const property_bookings = await prisma.bookings.findMany({
                where: {
                    property_id: propertyId,
                },

                orderBy: {
                    check_out_date: "desc",
                },
            });

            let available = true;

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
                if (checkout && available) {
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


            return available;
        }
        return true; // If no checkin or checkout provided, consider it available
    }

    catch (error) {
        console.error("Error checking property availability:", error);
        return false; // Return false in case of an error
    }
}

export default checkPropertyAvailability;