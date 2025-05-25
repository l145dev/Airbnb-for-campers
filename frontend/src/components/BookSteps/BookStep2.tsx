import { Link, useNavigate } from "react-router-dom";
import { Separator } from "../ui/separator";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface BookStep2Props {
    property_id: string;
    checkin: string;
    checkout: string;
    guests: number;
}

interface ReturnObj {
    property_id: number;
    note_from_owner: string;
    owner_id: number;
    price_per_night: string;
    user_email: string;
    booking_id: number;
}

interface ApiResponse {
    success: boolean;
    returnObj: ReturnObj;
}

const fetchSuccessDetails = async (BookStep2Props: BookStep2Props): Promise<ApiResponse | undefined> => {
    const response = await axios.get(`http://localhost:3000/booking/success?property_id=${BookStep2Props.property_id}&checkin=${BookStep2Props.checkin}&checkout=${BookStep2Props.checkout}&guests=${BookStep2Props.guests}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
    if (response.status === 200) {
        return response.data;
    }
    else {
        toast.error('Error fetching property details', {
            description: new Date().toLocaleString()
        });
        return undefined;
    }
}

const BookStep2: React.FC<BookStep2Props> = ({ property_id, checkin, checkout, guests }) => {
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery<ApiResponse, Error>({
        queryKey: ['booking-confirmation', property_id, checkin, checkout, guests],
        queryFn: async () => {
            const result = await fetchSuccessDetails({ property_id, checkin, checkout, guests });
            if (!result) {
                throw new Error('Failed to fetch booking details');
            }
            return result;
        },
        enabled: !!property_id && !!checkin && !!checkout && !!guests,
    });

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

            {isLoading ? (
                <>
                    <div className='camp-secured flex flex-col gap-4'>
                        <Skeleton className="h-6 w-40" />

                        <div className='camp-secured-details flex flex-col gap-4'>
                            <div className='camp-secured-booking-number flex flex-col gap-2'>
                                <Skeleton className="h-4 w-32" />
                                <div className='flex flex-row gap-2 items-center text-gray-500'>
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>

                            <div className='camp-secured-note-from-owner flex flex-col gap-2'>
                                <Skeleton className="h-4 w-32" />
                                <div className='flex flex-row gap-2 items-center text-gray-500'>
                                    <Skeleton className="h-4 w-60" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='additional-info mt-4 flex flex-row justify-between gap-4'>
                        <div className='additional-info-confirmation flex flex-row gap-2 px-2 py-1 rounded-md'>
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                        </div>

                        <div className='additional-info-view-all-trips'>
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </>
            ) : isError ? (
                <div className='camp-secured flex flex-col gap-4'>
                    <h2>Camp was not secured!</h2>
                    <p>Something went wrong.</p>
                </div>
            ) : (
                <>
                    <div className='camp-secured flex flex-col gap-4'>
                        <h2>Camp secured</h2>
                        <div className='camp-secured-details flex flex-col gap-4'>
                            <div className='camp-secured-booking-number flex flex-col gap-2'>
                                <h3 className='font-medium'>Booking number</h3>
                                <div
                                    className={`flex flex-row gap-2 items-center text-gray-500`}>
                                    <span>{data?.returnObj.booking_id}</span>
                                </div>
                            </div>

                            <div className='camp-secured-note-from-owner flex flex-col gap-2'>
                                <h3 className='font-medium'>Note from owner</h3>
                                <div className={`flex flex-row gap-2 items-center text-gray-500`}>
                                    <span>{data?.returnObj.note_from_owner}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='additional-info mt-4 flex flex-row justify-between gap-4'>
                        <div className='additional-info-confirmation flex flex-row gap-2 px-2 py-1 rounded-md bg-green-200 items-center'>
                            <CheckCircle height={16} width={16} />
                            <div className='text-sm'>
                                Confirmation sent to <span className='underline'>{data?.returnObj.user_email}</span>
                            </div>
                        </div>

                        <div className='additional-info-view-all-trips'>
                            <Link to='/trips'>
                                <span className='underline'>View all trips</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default BookStep2;