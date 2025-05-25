import './Book.css';
import { data, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import BookStep1 from '@/components/BookSteps/BookStep1';
import BookStep2 from '@/components/BookSteps/BookStep2';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover } from '@/components/ui/popover';

interface PriceDetails {
    property_id: string;
    property_name: string;
    average_rating: string;
    owner_full_name: string;
    reviews_count: number;
    price_per_night: string;
    main_image: string;
}

interface ApiResponse {
    success: boolean;
    allDetails: PriceDetails;
}

const fetchPropertyDetails = async (property_id: string | null): Promise<ApiResponse | undefined> => {
    try {
        const response = await axios.get(`http://localhost:3000/booking/pricecard?property_id=${property_id}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        if (response.status === 200) {
            return response.data as ApiResponse;
        }
        else {
            toast.error('Error fetching property details', {
                description: new Date().toLocaleString()
            });
            return undefined;
        }
    }

    catch (error) {
        toast.error('Error fetching property details', {
            description: new Date().toLocaleString()
        });
        console.error('Error fetching property details:', error);
        return undefined;
    }
}

const Book = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const property_id = searchParams.get('property_id');
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const guests = searchParams.get('guests');
    const success = searchParams.get('success');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['propertyDetails', property_id],
        queryFn: () => fetchPropertyDetails(property_id),
        enabled: !!property_id // should only run if property_id is not null
    })

    // function to get the duration of stay
    const getDuration = () => {
        if (checkin && checkout && new Date(checkin) instanceof Date && new Date(checkout) instanceof Date) {
            const fromDate = new Date(checkin);
            const toDate = new Date(checkout);
            const duration = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
            return duration;
        }
        return 0;
    };

    const getNightsTotalPrice = (duration: number) => {
        if (data?.allDetails && duration > 0) {
            const pricePerNight = parseFloat(data.allDetails.price_per_night);
            return (pricePerNight * duration);
        }
        return 0;
    };

    const renderStep = () => {
        if (!property_id || !checkin || !checkout || !guests) {
            return (
                <>
                    <div className='book-step flex flex-row justify-center items-center h-full w-full'>
                        <div className='h-full w-full flex justify-center items-center flex-col gap-4'>
                            <h1>
                                Oops! You did not select all parameters to book!
                            </h1>
                            <h2>
                                Please select all parameters to book!
                            </h2>
                            <div className='flex flex-row gap-2'>
                                <Button variant='outline' onClick={() => navigate(-1)}>
                                    Back
                                </Button>
                                <Button variant='default' onClick={() => navigate('/')}>
                                    Home
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )
        }

        else {
            if (success && success === 'true') {
                return (
                    <>
                        {/* this is the success page */}
                        <BookStep2 property_id={property_id} checkin={checkin} checkout={checkout} guests={Number(guests)} />
                    </>
                )
            }

            else {
                return <BookStep1 property_id={property_id} checkin={checkin} checkout={checkout} guests={Number(guests)} />
            }
        }
    }

    return (
        <>
            <div className='book flex flex-col gap-4'>
                <div className='book-header flex items-center gap-4'>
                    <Button variant='ghost' size='icon' onClick={() => navigate(-1)}>
                        <ChevronLeft width={24} height={24} />
                    </Button>
                    <h1>
                        Request to book
                    </h1>
                </div>

                <div className='book-step flex flex-row'>
                    <div className='property-info flex-[5]'>
                        {renderStep()}
                    </div>

                    <Separator orientation='vertical' className='h-full mx-4' />

                    <div className='property-payment flex-[3] relative '>
                        <div className='payment-card flex flex-col gap-4' style={{ position: 'sticky', top: 'calc(1rem + 80px)' }}>
                            <Card>
                                <CardContent className='flex flex-col gap-4'>
                                    <div className='flex flex-row gap-4'>
                                        <div className='aspect-square h-[150px] w-[150px] rounded-lg overflow-hidden'>
                                            <img src={`https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/propertyimages//${data?.allDetails?.main_image}`} alt={data?.allDetails?.property_name} />
                                        </div>
                                        <div className='flex flex-col justify-between'>
                                            <div>
                                                <h3 className='font-semibold text-lg'>{data?.allDetails?.property_name}</h3>
                                                <p className='text-sm text-gray-500'>{data?.allDetails?.owner_full_name}</p>
                                            </div>

                                            <div className='flex flex-row gap-1 items-center text-sm'>
                                                <Star fill='black' height={12} width={12} />
                                                <span>{data?.allDetails?.average_rating} <span className='text-gray-500'>({data?.allDetails?.reviews_count} reviews)</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <h2>Price details</h2>
                                    <div className='price-details flex flex-col gap-2'>
                                        <div className='price-details-item flex flex-row justify-between'>
                                            {/* dont care about optimization right now, would use useState for duration */}
                                            <span>${data?.allDetails?.price_per_night} x {getDuration()} nights</span>
                                            <span>${getNightsTotalPrice(getDuration())}</span>
                                        </div>
                                        <div className='price-details-item flex flex-row justify-between'>
                                            <span>Service fee</span>
                                            <span>$20</span>
                                        </div>
                                        <div className='price-details-item flex flex-row justify-between'>
                                            <span>Tax</span>
                                            {/* tax always 0 because no one likes taxes */}
                                            <span>$0</span>
                                        </div>
                                    </div>

                                    <Separator orientation='horizontal' className='my-0' />

                                    <div className='price-total flex flex-row justify-between'>
                                        <h3 className='font-semibold text-xl'>Total</h3>
                                        <h3 className='font-semibold text-xl'>${getNightsTotalPrice(getDuration()) + 20}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Book;