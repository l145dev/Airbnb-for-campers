import './Notifications.css';
import Notification from '@/components/Notification/Notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Notification {
    notification_id: number;
    user_id: number;
    notification_type: string;
    notification_message: string;
    is_read: boolean;
    created_at: string;
}

const fetchNotifications = async () => {
    const response = await axios.get('https://airbnb-for-campers.onrender.com/notifications', {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
    return response.data.notification;
};

const deleteNotification = async (notificationId: number) => {
    return axios.delete(`https://airbnb-for-campers.onrender.com/notifications`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            notification_id: notificationId
        },
        withCredentials: true,
    });
};

const Notifications = () => {
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(['notifications'], (oldData: Notification[] | undefined) =>
                oldData?.filter(notification => notification.notification_id !== deletedId)
            );
        },
    });


    if (error) return (
        <>
            <div className='notifications'>
                <h1>Notifications</h1>
                <div className='notifications-container'>
                    <p>Error fetching notifications</p>
                </div>
            </div>
        </>
    );

    return (
        <div className='notifications'>
            <h1>Notifications</h1>
            <div className='notifications-container'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : notifications?.length > 0 ? (
                    notifications.map((notification) => (
                        <Notification
                            key={notification.notification_id}
                            notification_id={notification.notification_id}
                            message={notification.notification_message}
                            time={notification.created_at}
                            is_read={notification.is_read}
                            type={notification.notification_type}
                            onDelete={() => deleteMutation.mutate(notification.notification_id)}
                        />
                    ))
                ) : (
                    <p>No notifications found</p>
                )}
            </div>
        </div>
    );
};

export default Notifications;
