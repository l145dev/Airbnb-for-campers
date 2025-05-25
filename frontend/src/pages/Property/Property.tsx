import './Property.css';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from "react-day-picker";
import { Share, Heart, Star, Key, DoorOpen, Book } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/Footer/Footer';
import PropertyReviewsOverview from '@/components/PropertyReviewsOverview/PropertyReviewsOverview';
import PropertyReviews from '@/components/PropertyReviews/PropertyReviews';
import PropertyAmenities from '@/components/PropertyAmenities/PropertyAmenities';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropertySkeleton from '@/components/PropertySkeleton/PropertySkeleton';
import axios from 'axios';
import PropertyImage from '@/components/PropertyImage/PropertyImage';

// map
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import marker from '../../assets/images/Map-Marker-PNG-HD.png';
import { toast } from 'sonner';

interface Review {
    review_id: number;
    property_id: number;
    guest_id: number;
    reviewer_full_name: string;
    reviewer_url: string;
    rating: number;
    comment: string;
    review_date: string;
}

interface PropertyDetails {
    property_detail_id: number;
    property_id: number;
    parking_available: boolean;
    pet_friendly: boolean;
    has_campfire_pit: boolean;
    has_personal_restroom: boolean;
    has_shared_restroom: boolean;
    has_personal_shower: boolean;
    has_shared_shower: boolean;
    has_personal_kitchen: boolean;
    has_shared_kitchen: boolean;
    has_sockets: boolean;
    has_views: boolean;
    has_picnic_table: boolean;
    has_grill: boolean;
    has_safety_features: boolean;
    has_personal_dryer: boolean;
    has_shared_dryer: boolean;
    has_wifi: boolean;
    has_cell_service: boolean;
    has_swimming_lake: boolean;
    has_swimming_pool: boolean;
    has_hiking_trail: boolean;
    is_wheelchair_accessible: boolean;
    has_fishing: boolean;
}

interface Image {
    image_id: number;
    property_id: number;
    image_url: string;
    alt_text: string;
    is_main: boolean;
}

interface AllDetails {
    dates_available: boolean;
    guest_overflow: boolean;
    property_id: number;
    owner_id: number;
    property_name: string;
    property_description: string;
    location_name: string;
    latitude: string;
    longitude: string;
    property_type: string;
    amenities: string;
    rules: string;
    check_in_time: string;
    check_out_time: string;
    price_per_night: string;
    capacity: number;
    number_of_reviews: number;
    average_rating: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    note_from_owner: string;
    city: string;
    country: string;
    checkin: string;
    checkout: string;
    guests: string;
    owner_full_name: string;
    owner_url: string;
    property_saved: boolean;
    reviews_count: number;
    details: PropertyDetails;
    images: Image[];
    reviews: Review[];
}

interface ApiResponse {
    success: boolean;
    allDetails: AllDetails;
}

interface SearchParams {
    property_id?: number;
    guests?: number;
    checkin?: string; // Assuming date string in 'YYYY-MM-DD' format
    checkout?: string; // Assuming date string in 'YYYY-MM-DD' format
}

const fetchPropertyDetails = async (params: SearchParams): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            queryParams.append(key, value);
        }
    }
    const queryString = queryParams.toString();

    const response = await axios.get(`http://localhost:3000/property?${queryString}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
};

const saveProperty = async (propertyId: number): Promise<void> => {
    const response = await axios.post(`http://localhost:3000/property/save`, {
        property_id: propertyId,
    }, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

const checkDateError = async (checkin: string, checkout: string, property_id: number) => {
    if (checkin && checkout) {
        if (checkin > checkout) {
            return true;
        }

        try {
            const response = await axios.post(`http://localhost:3000/booking/update/dates`, {
                property_id: property_id,
                checkin: checkin,
                checkout: checkout,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                return false;
            }

            else {
                return true;
            }
        }
        catch (error) {
            return true;
        }
    }
}

const Property = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // params handling
    const queryParams: SearchParams = Object.fromEntries(searchParams.entries());

    // react query data retrieval, caching, set loading state
    const { data, isLoading, isError, error } = useQuery<ApiResponse>({
        queryKey: ['property', queryParams],
        queryFn: () => fetchPropertyDetails(queryParams),
        enabled: true
    });

    // save states
    const [saved, setSaved] = useState<boolean>(false);
    const [hoverSaved, setHoveredSaved] = useState<boolean>(false);

    // date picker states
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    // payment states
    const [guests, setGuests] = useState<number>(0);

    // date error
    const [dateError, setDateError] = useState<boolean>(false);

    // property address
    const [propAddress, setPropAddress] = useState<string>('');

    // rerendering the state(s) when data changes
    useEffect(() => {
        if (data?.allDetails) {
            setSaved(data.allDetails.property_saved);
            if (data?.allDetails.checkin && data.allDetails.checkout) {
                setDate({
                    from: new Date(data.allDetails.checkin),
                    to: new Date(data.allDetails.checkout),
                });
            }
            if (data?.allDetails.guests) {
                setGuests(Number(data.allDetails.guests));
            }

            // get property address on data change/load
            getPropertyAddress();
        }
    }, [data]);

    useEffect(() => {
        const updatedParams = new URLSearchParams(searchParams);

        if (date?.from && date?.to) {
            const checkDate = async () => {
                if (data?.allDetails.property_id) {
                    // date format: yyyy-m-dd
                    const formatDate = (date: Date) => {
                        const year = date.getFullYear();
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        return `${year}-${month}-${day}`;
                    };

                    const checkin = date.from ? formatDate(date.from) : '';
                    const checkout = date.to ? formatDate(date.to) : '';

                    if (await checkDateError(checkin, checkout, data?.allDetails.property_id)) {
                        setDateError(true);
                        toast.error('Dates not available', {
                            description: new Date().toLocaleString()
                        });
                    }
                    else {
                        setDateError(false);
                    }
                }
            }

            checkDate();

            // date format: yyyy-m-dd
            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}-${month}-${day}`;
            };
            updatedParams.set('checkin', formatDate(date.from));
            updatedParams.set('checkout', formatDate(date.to));
        }

        else {
            updatedParams.delete('checkin');
            updatedParams.delete('checkout');
        }

        if (guests > 0) {
            updatedParams.set('guests', guests.toString());
        }

        else {
            updatedParams.delete('guests');
        }

        window.history.replaceState({}, '', `${window.location.pathname}?${updatedParams}`);
    }, [date, guests]);

    // custom icon for leaflet
    const customPin = new Icon({
        iconUrl: marker,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    // function to get the duration of stay
    const getDuration = () => {
        if (date?.from && date?.to && date.from instanceof Date && date.to instanceof Date) {
            const fromDate = new Date(date.from);
            const toDate = new Date(date.to);
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

    const getPropertyAddress = async () => {
        if (data?.allDetails) {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse.php?lat=${data.allDetails.latitude}&lon=${data.allDetails.longitude}&zoom=18&format=jsonv2`)
            if (response.status === 200) {
                const formattedAddress = `${response.data.address.house_number !== undefined ? response.data.address.house_number : ''}${response.data.address.road}, ${response.data.address.postcode} ${response.data.address.city}, ${response.data.address.country}`;
                setPropAddress(formattedAddress);
            } else {
                setPropAddress(`${data.allDetails.city}, ${data.allDetails.country}`);
            }
        }
    }

    const requestBooking = () => {
        if (data?.allDetails.property_id && date?.from && date?.to && guests) {
            // date format: yyyy-m-dd
            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                return `${year}-${month}-${day}`;
            };
            const checkin = formatDate(date.from);
            const checkout = formatDate(date.to);
            navigate(`/book?property_id=${data?.allDetails.property_id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
        }
    }

    // check if data is loading
    if (isLoading) {
        return (
            <>
                <PropertySkeleton />
            </>
        );
    }

    if (isError) {
        return (
            <>
                <div className='property'>
                    <div className='h-full w-full flex justify-center items-center flex-col gap-3'>
                        <h1>
                            Oops! An unexpected error occured!
                        </h1>
                        <h2>
                            {error.message}
                        </h2>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='property flex flex-col gap-4'>
                {/* property header */}
                <div className='property-header flex flex-row justify-between items-center'>
                    <h1>{data?.allDetails.property_name}</h1>
                    <div className='action-buttons flex flex-row gap-2'>
                        <Button variant='ghost' onClick={() => {
                            if (data?.allDetails.property_id) {
                                setSaved(!saved);
                                saveProperty(data?.allDetails.property_id);
                            }
                        }}
                            onMouseEnter={() => setHoveredSaved(true)}
                            onMouseLeave={() => setHoveredSaved(false)}>
                            <Heart fill={saved ? 'red' : hoverSaved ? 'pink' : 'none'} />
                            <p>Save</p>
                        </Button>
                        <Button variant='ghost'>
                            <Share />
                            <p>Share</p>
                        </Button>
                    </div>
                </div>

                {/* property images -> pass images through this*/}
                <PropertyImage images={data?.allDetails.images ?? []} />

                {/* details and payment grid*/}
                <div className='property-details flex'>
                    <div className='property-info flex-[5]'>
                        <div className='property-info-main'>
                            <h2>Camp in {data?.allDetails.city}, {data?.allDetails.country}</h2>
                            <p>{data?.allDetails.property_type} · {data?.allDetails.capacity} guests</p>
                            <div className="flex items-center gap-1 mt-4">
                                <Star fill='black' height={16} width={16} />
                                <span>{data?.allDetails.average_rating}</span> · <a className='underline' href="#reviews">{data?.allDetails.reviews_count} reviews</a>
                            </div>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='property-owner-info flex flex-row gap-4'>
                            <div className='property-owner-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                <img src={"https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/avatar//" + data?.allDetails.owner_url} alt="Owner" className="w-full h-full object-cover bg-gray-200" />
                            </div>
                            <div className='property-owner-details'>
                                <h3>{data?.allDetails.owner_full_name}</h3>
                                <p className='text-sm text-gray-500'>Superhost · 1 year hosting</p>
                            </div>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='property-description flex flex-col gap-4'>
                            <h2>Description</h2>
                            <p>{data?.allDetails.property_description}</p>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        {/* Pass property amenities through here */}
                        <PropertyAmenities />

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='date-picker-section flex flex-col gap-4'>
                            <div>
                                {(date?.from && date?.to) ? (
                                    <>
                                        <h2>{getDuration()} nights in {data?.allDetails?.city}, {data?.allDetails?.country}</h2>
                                    </>
                                ) : (
                                    <>
                                        <h2>Select dates to live in {data?.allDetails?.city}, {data?.allDetails?.country}</h2>
                                    </>
                                )}
                                <p className='text-gray-500'>
                                    {(date?.from || date?.to) ? (
                                        <>
                                            <span>{date?.from?.toLocaleDateString()}</span> - <span>{date?.to?.toLocaleDateString()}</span>
                                        </>
                                    ) : (
                                        <span>Select dates</span>
                                    )}
                                </p>
                            </div>

                            <div className='date-picker'>
                                <Calendar
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={3}
                                    className='p-0 justify-between'
                                    showOutsideDays={false}
                                    disabled={{ before: new Date() }}
                                />
                            </div>
                        </div>
                    </div>

                    <Separator orientation='vertical' className='h-full mx-4' />

                    <div className='property-payment flex-[3] relative'>
                        <div className='payment-card flex flex-col gap-4' style={{ position: 'sticky', top: 'calc(1rem + 80px)' }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-baseline gap-1'>
                                        <h2>${data?.allDetails?.price_per_night}</h2>
                                        <span className='text-gray-500 font-normal'>/ night</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => { e.preventDefault(); requestBooking(); }}>
                                        <div className="flex flex-col gap-6">
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Check-in */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="checkin">Check-in</Label>
                                                    <Popover>
                                                        <PopoverTrigger className={`w-full px-4 py-2 border rounded-md text-left ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}>
                                                            {date?.from === undefined ? (
                                                                <span className="text-gray-500">Select Check-in</span>
                                                            ) : (
                                                                <span>{date.from.toLocaleDateString()}</span>
                                                            )}
                                                        </PopoverTrigger>
                                                        <PopoverContent className="z-50 p-4 rounded-md shadow-lg bg-white">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date?.from}
                                                                onSelect={(newDate) => setDate({ ...date, from: newDate })}
                                                                disabled={{ before: new Date() }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                {/* Check-out */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="checkout">Check-out</Label>
                                                    <Popover>
                                                        <PopoverTrigger className={`w-full px-4 py-2 border rounded-md text-left ${dateError ? 'border-red-500 focus:border-red-500' : ''}`}>
                                                            {date?.to === undefined ? (
                                                                <span className="text-gray-500">Select Check-out</span>
                                                            ) : (
                                                                <span>{date.to.toLocaleDateString()}</span>
                                                            )}
                                                        </PopoverTrigger>
                                                        <PopoverContent className="z-50 p-4 rounded-md shadow-lg bg-white">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date?.to}
                                                                onSelect={(newDate) => date?.from && setDate({ from: date.from, to: newDate })}
                                                                disabled={{ before: date?.from ? date?.from : new Date() }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="guests">Number of Guests</Label>
                                                <Input
                                                    className={`${data?.allDetails?.capacity && guests > data?.allDetails?.capacity ? 'border-red-500 focus:border-red-500' : ''}`}
                                                    id="guests"
                                                    type="number"
                                                    placeholder="Select number of guests"
                                                    required
                                                    min={0}
                                                    value={guests === 0 ? '' : guests}
                                                    onChange={(e) => { setGuests(Number(e.target.value)) }}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <Button type="submit" disabled={date?.from === undefined || date?.to === undefined || guests === 0 || (data?.allDetails?.capacity !== undefined && guests > data?.allDetails?.capacity) || dateError} className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                                                    Reserve
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center text-sm text-gray-500">
                                            You won't be charged yet.
                                        </div>

                                        {date?.from && date?.to && (
                                            <>
                                                <div className='price-details flex flex-col gap-2 mt-4'>
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

                                                <Separator orientation='horizontal' className='my-4' />

                                                <div className='price-total flex flex-row justify-between'>
                                                    <h3 className='font-semibold text-xl'>Total</h3>
                                                    <h3 className='font-semibold text-xl'>${getNightsTotalPrice(getDuration()) + 20}</h3>
                                                </div>
                                            </>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <Separator orientation='horizontal' className='my-0' />

                <div className='reviews-overview flex flex-col gap-4'>
                    <div className='reviews-overview-header flex flex-row items-center gap-2'>
                        <Star fill='black' height={24} width={24} />
                        <h2>
                            {data?.allDetails?.average_rating} · {data?.allDetails?.reviews.length} reviews
                        </h2>
                    </div>

                    {/* Pass property reviews overview eg cleansiness, overall score, etc -> better readability */}
                    <PropertyReviewsOverview averageRating={Number(data?.allDetails?.average_rating)} />
                </div>

                {data?.allDetails?.reviews && data.allDetails.reviews.length > 0 && (
                    <>
                        <Separator orientation='horizontal' className='my-0' />

                        {/* place reviews here -> pass reviews through here */}
                        <div id='reviews'>
                            <PropertyReviews reviews={data?.allDetails?.reviews ? data.allDetails.reviews : []} />
                        </div>
                    </>
                )}

                <Separator orientation='horizontal' className='my-0' />

                <div className='your-stay-location flex flex-col gap-4'>
                    <div className='your-stay-location-header'>
                        <h2>Where you'll be staying</h2>
                        <span className='text-gray-500'>{data?.allDetails?.city}, {data?.allDetails?.country}</span>
                    </div>

                    <div className='map-container h-[400px] w-full'>
                        <MapContainer
                            center={[Number(data?.allDetails?.latitude), Number(data?.allDetails?.longitude)]}
                            zoom={13}
                            scrollWheelZoom={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[Number(data?.allDetails?.latitude), Number(data?.allDetails?.longitude)]} icon={customPin}>
                                <Popup>
                                    {propAddress}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>

                <Separator orientation='horizontal' className='my-0' />

                <div className='things-to-know flex flex-col gap-4 mb-4'>
                    <h2>Things to know</h2>
                    <div className='grid grid-cols-3 gap-4'>
                        {/* checkin, checkout, rules */}
                        <div className='flex flex-row border-1 border-border rounded-lg p-4 items-center'>
                            <Key height={32} width={32} className='min-w-[32px] min-h-[32px]' />

                            <Separator orientation='vertical' className='h-full mr-8 ml-4' />

                            <div className='flex flex-col gap-1'>
                                <h3 className='text-sm'>Check-in</h3>
                                <span className='text-xl font-semibold'>{data?.allDetails?.check_in_time ? new Date(data.allDetails.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                            </div>
                        </div>

                        <div className='flex flex-row border-1 border-border rounded-lg p-4 items-center'>
                            <DoorOpen height={32} width={32} className='min-w-[32px] min-h-[32px]' />

                            <Separator orientation='vertical' className='h-full mr-8 ml-4' />

                            <div className='flex flex-col gap-1'>
                                <h3 className='text-sm'>Check-out</h3>
                                <span className='text-xl font-semibold'>{data?.allDetails?.check_out_time ? new Date(data.allDetails.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                            </div>
                        </div>

                        <div className='flex flex-row border-1 border-border rounded-lg p-4 items-center'>
                            <Book height={32} width={32} className='min-w-[32px] min-h-[32px]' />

                            <Separator orientation='vertical' className='h-full mr-8 ml-4' />

                            <div className='flex flex-col gap-1'>
                                <h3 className='text-sm'>Rules</h3>
                                <span className='text-xl font-semibold'>{data?.allDetails?.rules}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}

export default Property;