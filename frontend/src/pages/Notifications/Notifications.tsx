import './Notifications.css';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Notification from '@/components/Notification/Notification';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
    interface Notification {
        notification_id: number;
        user_id: number;
        notification_type: string;
        notification_message: string;
        is_read: boolean;
        created_at: string;
    }

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('http://localhost:3000/notifications', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
                setNotifications(response.data.notification);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleDeleteNotification = async (notificationId: number) => {
        try {
            await axios.delete(`http://localhost:3000/notifications`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    notification_id: notificationId
                },
                withCredentials: true,
            });
            setNotifications(notifications.filter(notification => notification.notification_id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <>
            <div className='notifications'>
                <h1>
                    Notifications
                </h1>

                <div className='notifications-container'>
                    {notifications && notifications.length > 0 ? notifications.map((notification) => (
                        <Notification
                            key={notification.notification_id}
                            notification_id={notification.notification_id}
                            message={notification.notification_message}
                            time={notification.created_at}
                            is_read={notification.is_read}
                            type={notification.notification_type}
                            onDelete={handleDeleteNotification}
                        />
                    )) : <p>No notifications found</p>}
                </div>
            </div>
        </>
    )
}

export default Notifications;