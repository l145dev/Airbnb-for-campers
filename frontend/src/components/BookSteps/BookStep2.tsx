import { Link, useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { CheckCircle } from "lucide-react";

interface BookStep2Props {
    property_id: string;
    checkin: string;
    checkout: string;
    guests: number;
}

// todo: program success route

const BookStep2: React.FC<BookStep2Props> = ({ property_id, checkin, checkout, guests }) => {
    const navigate = useNavigate();

    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    return (
        <>
            <div className='your-trip flex flex-col gap-4'>
                <h2>Your trip</h2>
                <div className='your-trip-details flex flex-col gap-4'>
                    <div className='your-trip-dates flex flex-col gap-2'>
                        <h3 className='font-medium'>Dates</h3>
                        <div
                            className={`flex flex-row gap-2 items-center text-gray-500`}>
                            <span>{formatDate(checkin).toLocaleDateString()} - {formatDate(checkout).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className='your-trip-guests flex flex-col gap-2'>
                        <h3 className='font-medium'>Guests</h3>
                        <div className={`flex flex-row gap-2 items-center text-gray-500`}>
                            <span>{guests} guests</span>
                        </div>
                    </div>
                </div>
            </div>

            <Separator orientation='horizontal' className='my-4' />

            <div className='camp-secured flex flex-col gap-4'>
                <h2>Camp secured</h2>
                <div className='camp-secured-details flex flex-col gap-4'>
                    <div className='camp-secured-booking-number flex flex-col gap-2'>
                        <h3 className='font-medium'>Booking number</h3>
                        <div
                            className={`flex flex-row gap-2 items-center text-gray-500`}>
                            <span>1234567890</span>
                        </div>
                    </div>

                    <div className='camp-secured-note-from-owner flex flex-col gap-2'>
                        <h3 className='font-medium'>Note from owner</h3>
                        <div className={`flex flex-row gap-2 items-center text-gray-500`}>
                            <span>This is a note from the owner</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='additional-info mt-4 flex flex-row justify-between gap-4'>
                <div className='additional-info-confirmation flex flex-row gap-2 px-2 py-1 rounded-md bg-green-200 items-center'>
                    <CheckCircle height={16} width={16} />
                    <div className='text-sm'>
                        Confirmation sent to <span className='underline'>l145@gmail.com</span>
                    </div>
                </div>

                <div className='additional-info-view-all-trips'>
                    <Link to='/trips'>
                        <span className='underline'>View all trips</span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default BookStep2;