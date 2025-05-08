import './Notification.css'
import { Check, X, MessageSquare, Bell, Heart } from "lucide-react"
import { Button } from "../ui/button"

interface NotificationProps {
    notification_id: number;
    message: string;
    time: string;
    is_read: boolean;
    type: string;
    onDelete: (id: number) => void;
}

const Notification: React.FC<NotificationProps> = ({ notification_id, message, time, is_read, type, onDelete }) => {
    const handleDelete = () => {
        onDelete(notification_id); // callback to notifications.tsx
    }

    return (
        <div className='notification' key={notification_id}>
            <div className='main-notification-content'>
                <div className={`icon-container ${type}`}>
                    {type === 'booking_confirmation' ? (
                        <>
                            <Check color='white' />
                        </>
                    ) : (
                        <>
                            {type === 'new_review' ? (
                                <>
                                    <MessageSquare color='white' />
                                </>
                            ) : (
                                <>
                                    {type === 'booking_reminder' ? (
                                        <>
                                            <Bell color='white' />
                                        </>
                                    ) : (
                                        <>
                                            <Heart color='white' />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className='text-container'>
                    <h4>
                        {message}
                    </h4>

                    <p>
                        {time}
                    </p>
                </div>
            </div>

            <Button variant={'ghost'} onClick={handleDelete}>
                <X />
            </Button>
        </div>
    )
}

export default Notification;