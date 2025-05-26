import { useEffect, useState } from 'react';
import './Trips.css';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TripsCard from '@/components/TripsCard/TripsCard';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import notrips from '@/assets/images/notrips.jpg';
import notripshistory from '@/assets/images/notripshistory.jpg';

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

interface ApiResponse {
    success: boolean;
    resolvedDetails: TripDetails[];
}

const fetchTrips = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get('http://localhost:3000/trips', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        toast.error("Failed to fetch trips. Please refresh page to try again.", {
            description: new Date().toLocaleTimeString(),
        });
        console.error("Error fetching trips:", error);
        throw error;
    }
}

const Trips = () => {
    const { data, isLoading, isError } = useQuery<ApiResponse>({
        queryKey: ['trips'],
        queryFn: fetchTrips,
        enabled: true,
    });

    const [upcomingTrips, setUpcomingTrips] = useState<TripDetails[]>([]);
    const [pastTrips, setPastTrips] = useState<TripDetails[]>([]);

    useEffect(() => {
        if (data?.resolvedDetails && data.resolvedDetails.length > 0) {
            const past: TripDetails[] = [];
            const upcoming: TripDetails[] = [];

            data.resolvedDetails.forEach(trip => {
                if (trip.booking_status === "passed" || trip.booking_status === "reviewed") {
                    past.push(trip);
                } else {
                    upcoming.push(trip);
                }
            });

            setPastTrips(past);
            setUpcomingTrips(upcoming);
        }
    }, [data]);

    return (
        <>
            <Toaster closeButton />
            <div className='trips flex flex-col gap-4'>
                <h1>Trips</h1>

                {isError ? (
                    <div className='flex flex-col items-center justify-center'>
                        <h2 className='text-xl font-semibold'>Error fetching trips</h2>
                        <p className='text-gray-600'>Please refresh the page to try again.</p>
                    </div>
                ) : (
                    <>
                        <div className='upcoming-trips flex flex-col gap-4'>
                            <h2>Upcoming Trips</h2>
                            {isLoading ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                        <Card className="max-h-[435px] w-full">
                                            <CardContent className="flex flex-col gap-4">
                                                <div className="flex flex-row gap-4">
                                                    <div className="aspect-square min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px] rounded-lg overflow-hidden">
                                                        <Skeleton className="h-full w-full" />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <Skeleton className="h-6 w-32" />
                                                            <Skeleton className="mt-2 h-4 w-48" />
                                                        </div>
                                                        <div className="flex flex-row gap-1 items-center text-sm">
                                                            <Skeleton className="h-4 w-4 rounded-full" />
                                                            <Skeleton className="h-4 w-20" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Skeleton className="h-6 w-24" />
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-28" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-4 w-24" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-16" />
                                                        <Skeleton className="h-4 w-12" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-12" />
                                                        <Skeleton className="h-4 w-10" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <Skeleton className="h-8 w-24" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="max-h-[435px] w-full">
                                            <CardContent className="flex flex-col gap-4">
                                                <div className="flex flex-row gap-4">
                                                    <div className="aspect-square min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px] rounded-lg overflow-hidden">
                                                        <Skeleton className="h-full w-full" />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <Skeleton className="h-6 w-32" />
                                                            <Skeleton className="mt-2 h-4 w-48" />
                                                        </div>
                                                        <div className="flex flex-row gap-1 items-center text-sm">
                                                            <Skeleton className="h-4 w-4 rounded-full" />
                                                            <Skeleton className="h-4 w-20" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Skeleton className="h-6 w-24" />
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-28" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-4 w-24" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-16" />
                                                        <Skeleton className="h-4 w-12" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-12" />
                                                        <Skeleton className="h-4 w-10" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <Skeleton className="h-8 w-24" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {upcomingTrips.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                            {upcomingTrips.map((trip) => (
                                                <TripsCard key={trip.booking_id} type="confirmed" trip={trip} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex flex-row h-[300px] w-full rounded-lg items-center justify-center border'>
                                            <div className='flex flex-[3] flex-col p-8 h-full justify-between'>
                                                <div>
                                                    <h3 className='text-xl font-semibold'>No trips booked yet!</h3>
                                                    <p className='text-gray-600'>Time to start dusting off your bags and start planning your next adventure!</p>
                                                </div>

                                                <Link to="/listings">
                                                    <Button variant={'default'}>
                                                        Start searching
                                                    </Button>
                                                </Link>
                                            </div>

                                            <div className='flex-[5] h-full overflow-hidden rounded-r-lg'>
                                                <img src={notrips} alt="Upcoming Trip" className='h-full w-full object-cover' />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>

                        <div className='past-trips flex flex-col gap-4'>
                            <h2>Past Trips</h2>
                            {isLoading ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                        <Card className="max-h-[435px] w-full">
                                            <CardContent className="flex flex-col gap-4">
                                                <div className="flex flex-row gap-4">
                                                    <div className="aspect-square min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px] rounded-lg overflow-hidden">
                                                        <Skeleton className="h-full w-full" />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <Skeleton className="h-6 w-32" />
                                                            <Skeleton className="mt-2 h-4 w-48" />
                                                        </div>
                                                        <div className="flex flex-row gap-1 items-center text-sm">
                                                            <Skeleton className="h-4 w-4 rounded-full" />
                                                            <Skeleton className="h-4 w-20" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Skeleton className="h-6 w-24" />
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-28" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-4 w-24" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-16" />
                                                        <Skeleton className="h-4 w-12" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-12" />
                                                        <Skeleton className="h-4 w-10" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <Skeleton className="h-8 w-24" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="max-h-[435px] w-full">
                                            <CardContent className="flex flex-col gap-4">
                                                <div className="flex flex-row gap-4">
                                                    <div className="aspect-square min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px] rounded-lg overflow-hidden">
                                                        <Skeleton className="h-full w-full" />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <Skeleton className="h-6 w-32" />
                                                            <Skeleton className="mt-2 h-4 w-48" />
                                                        </div>
                                                        <div className="flex flex-row gap-1 items-center text-sm">
                                                            <Skeleton className="h-4 w-4 rounded-full" />
                                                            <Skeleton className="h-4 w-20" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Skeleton className="h-6 w-24" />
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-28" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-20" />
                                                        <Skeleton className="h-4 w-24" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-16" />
                                                        <Skeleton className="h-4 w-12" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <Skeleton className="h-4 w-12" />
                                                        <Skeleton className="h-4 w-10" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-between">
                                                    <Skeleton className="h-8 w-24" />
                                                    <Skeleton className="h-4 w-32" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {pastTrips.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                            {pastTrips.map((trip) => (
                                                <TripsCard
                                                    key={trip.booking_id}
                                                    type={trip.booking_status === "reviewed" ? "reviewed" : "passed"}
                                                    trip={trip}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex flex-row h-[300px] w-full rounded-lg items-center justify-center border'>
                                            <div className='flex-[5] h-full overflow-hidden rounded-l-lg'>
                                                <img src={notripshistory} alt="Upcoming Trip" className='h-full w-full object-cover' />
                                            </div>

                                            <div className='flex flex-[3] flex-col p-8 h-full justify-between'>
                                                <div>
                                                    <h3 className='text-xl font-semibold'>No past trips!</h3>
                                                    <p className='text-gray-600'>Your past trips will appear here once they are available.</p>
                                                </div>

                                                <Link to="/listings">
                                                    <Button variant={'default'}>
                                                        Start searching
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div >
        </>
    )
}

export default Trips;