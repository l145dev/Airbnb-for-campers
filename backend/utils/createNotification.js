const createNotification = async (notification_type, notification_message, user_id, prisma) => {
    // booking_confirmation, new_review, booking_reminder, property_saved (notification_type)
    if (!notification_type || !notification_message || !user_id || !prisma) {
        return { success: false, error: "Missing parameters" };
    }

    try {
        const notification = await prisma.notifications.create({
            data: {
                user_id: parseInt(user_id),
                notification_type: notification_type,
                notification_message: notification_message,
            }
        });

        return { success: true, notification };
    }

    catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error: "Error creating notification" };
    }
};

export default createNotification;
