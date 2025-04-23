const checkPropertyAvailability = async (propertyId, checkin, checkout, prisma) => {
    try {
        if (checkin && checkout) {
            const property_bookings = await prisma.bookings.findMany({
                where: {
                    property_id: propertyId,
                },
            });

            const [ciyear, cimonth, cidate] = checkin.split("-");
            const checkinDate = new Date(parseInt(ciyear), parseInt(cimonth) - 1, parseInt(cidate));
            checkinDate.setHours(0, 0, 0, 0);

            const [cyear, cmonth, cdate] = checkout.split("-");
            const checkoutDate = new Date(parseInt(cyear), parseInt(cmonth) - 1, parseInt(cdate));
            checkoutDate.setHours(0, 0, 0, 0);

            const isOverlapping = property_bookings.some(booking => {
                const bookingCheckIn = new Date(booking.check_in_date);
                bookingCheckIn.setHours(0, 0, 0, 0);
                const bookingCheckOut = new Date(booking.check_out_date);
                bookingCheckOut.setHours(0, 0, 0, 0);

                return checkinDate < bookingCheckOut && checkoutDate > bookingCheckIn;
            });

            return !isOverlapping; // If there's no overlap, the property is available

        }
        return true; // If no checkin or checkout provided, consider it available
    } catch (error) {
        console.error("Error checking property availability:", error);
        return false;
    }
};

export default checkPropertyAvailability;