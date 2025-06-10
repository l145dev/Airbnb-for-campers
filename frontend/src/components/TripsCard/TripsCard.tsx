import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import TripsDialogPatch from "../TripsDialog/TripsDialogPatch";
import TripsDialogPost from "../TripsDialog/TripsDialogPost";

interface TripDetails {
    property_id: number;
    property_name: string;
    owner: string;
    owner_id: number;
    reviews_count: number;
    average_rating: number;
    image_url: string;
    booking_id: number;
    checkin: string;
    checkout: string;
    guests: number;
    price_paid: number;
    booking_status: string;
}

const TripsCard: React.FC<{ trip: TripDetails, type: 'confirmed' | 'passed' | 'reviewed', onDataRefresh: () => void }> = ({ trip, type, onDataRefresh }) => {
    return (
        <>
            <Card>
                <CardContent className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4'>
                        <div className='aspect-square min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px] rounded-lg overflow-hidden bg-gray-200'>
                            <img src={trip.image_url} alt="Property" className='h-full w-full object-cover' />
                        </div>
                        <div className='flex flex-col justify-between'>
                            <div>
                                <h3 className='font-semibold text-lg'>{trip.property_name}</h3>
                                <p className='text-sm text-gray-500'>{trip.owner}</p>
                            </div>

                            <div className='flex flex-row gap-1 items-center text-sm'>
                                <Star fill='black' height={12} width={12} />
                                <span>{trip.average_rating} <span className='text-gray-500'>({trip.reviews_count} reviews)</span></span>
                            </div>
                        </div>
                    </div>

                    <h2>Booking Details</h2>
                    <div className='trip-details flex flex-col gap-2'>
                        <div className='trip-details-booking flex flex-row justify-between'>
                            <span>Booking Number</span>
                            <span>#{trip.booking_id}</span>
                        </div>
                        <div className='trip-details-dates flex flex-row justify-between'>
                            <span>Dates</span>
                            <span>{new Date(trip.checkin).toLocaleDateString()} - {new Date(trip.checkout).toLocaleDateString()}</span>
                        </div>
                        <div className='trip-details-guests flex flex-row justify-between'>
                            <span>Guests</span>
                            <span>{trip.guests}</span>
                        </div>
                        <div className="trip-details-price flex flex-row justify-between">
                            <span>Paid</span>
                            <span>${trip.price_paid}</span>
                        </div>
                    </div>

                    <div className="trip-details-actions flex flex-row justify-between">
                        {type === 'confirmed' ? (
                            // confirmed
                            <>
                                <Button size={'sm'} variant='destructive' disabled>
                                    Cancel
                                </Button>

                                <Link to={`/property?property_id=${trip.property_id}`}>
                                    <span className="underline">View Property</span>
                                </Link>
                            </>
                        ) : type === 'passed' ? (
                            // passed
                            <>
                                {/* open dialog -> on dialog btn post review */}
                                {/* <Button size={'sm'} variant='default'>
                                    Review
                                </Button> */}
                                <TripsDialogPost property_name={trip.property_name} property_id={trip.property_id} onReviewPosted={onDataRefresh} />

                                <Link to={`/property?property_id=${trip.property_id}`}>
                                    <span className="underline">View Property</span>
                                </Link>
                            </>
                        ) : (
                            // reviewed
                            <>
                                {/* open dialog, get review -> on dialog btn edit/delete review */}
                                {/* <Button size={'sm'} variant='default'>
                                    Edit Review
                                </Button> */}
                                <TripsDialogPatch property_name={trip.property_name} property_id={trip.property_id} onReviewUpdated={onDataRefresh} />

                                <Link to={`/property?property_id=${trip.property_id}`}>
                                    <span className="underline">View Property</span>
                                </Link>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default TripsCard;