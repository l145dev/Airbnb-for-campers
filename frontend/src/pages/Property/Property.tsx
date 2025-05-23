import './Property.css';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from "react-day-picker";
import { Share, Heart, Star, Key, DoorOpen, Book } from 'lucide-react';
import { useState } from 'react';
import { Footer } from '@/components/Footer/Footer';
import PropertyReviewsOverview from '@/components/PropertyReviewsOverview/PropertyReviewsOverview';
import PropertyReviews from '@/components/PropertyReviews/PropertyReviews';
import PropertyAmenities from '@/components/PropertyAmenities/PropertyAmenities';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import PropertySkeleton from '@/components/PropertySkeleton/PropertySkeleton';

// map
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import marker from '../../assets/images/Map-Marker-PNG-HD.png';

interface Review {
    review_id: number;
    property_id: number;
    guest_id: number;
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

    const response = await fetch(`http://localhost:3000/property?${queryString}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const Property = () => {
    const [searchParams] = useSearchParams();

    // params handling
    const queryParams: SearchParams = Object.fromEntries(searchParams.entries());

    // react query data retrieval, caching, set loading state
    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: ['property'],
        queryFn: () => fetchPropertyDetails(queryParams),
        enabled: true
    });

    // save states
    const [saved, setSaved] = useState<boolean>(false);
    const [hoverSaved, setHoveredSaved] = useState<boolean>(false);

    // date picker states
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 4, 24), // replace with selected date -> remember months are 0-indexed
        to: new Date(2025, 4, 30), // replace with selected date
    });

    // payment states
    const [guests, setGuests] = useState<number>(0);

    // custom icon for leaflet
    const customPin = new Icon({
        iconUrl: marker,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    // check if data is loading
    if (isLoading) {
        return (
            <>
                <PropertySkeleton />
            </>
        );
    }

    return (
        <>
            <div className='property flex flex-col gap-4'>
                {/* property header */}
                <div className='property-header flex flex-row justify-between items-center'>
                    <h1>Property name</h1>
                    <div className='action-buttons flex flex-row gap-2'>
                        <Button variant='ghost' onClick={() => setSaved(!saved)} onMouseEnter={() => setHoveredSaved(true)} onMouseLeave={() => setHoveredSaved(false)}>
                            <Heart fill={saved ? 'red' : hoverSaved ? 'pink' : 'none'} />
                            <p>Save</p>
                        </Button>
                        <Button variant='ghost'>
                            <Share />
                            <p>Share</p>
                        </Button>
                    </div>
                </div>

                {/* property images */}
                <div className='property-images grid grid-cols-2 gap-4'>
                    <div className='main-property-image rounded-lg overflow-hidden'>
                        <img src="https://placehold.co/600x400" alt="Property" className="w-full h-full object-cover" />
                    </div>

                    <div className='alt-property-images grid grid-cols-2 gap-4'>
                        <div className='alt-property-images-top grid grid-rows-2 gap-4'>
                            <div className='alt-property-image rounded-lg overflow-hidden'>
                                <img src="https://placehold.co/600x400" alt="Property" className="w-full h-full object-cover" />
                            </div>
                            <div className='alt-property-image rounded-lg overflow-hidden'>
                                <img src="https://placehold.co/600x400" alt="Property" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className='alt-property-images-bottom grid grid-rows-2 gap-4'>
                            <div className='alt-property-image rounded-lg overflow-hidden'>
                                <img src="https://placehold.co/600x400" alt="Property" className="w-full h-full object-cover" />
                            </div>
                            <div className='alt-property-image rounded-lg overflow-hidden'>
                                <img src="https://placehold.co/600x400" alt="Property" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* details and payment grid*/}
                <div className='property-details flex'>
                    <div className='property-info flex-[5]'>
                        <div className='property-info-main'>
                            <h2>Property type in City, Country</h2>
                            <p>Property type · Guests</p>
                            <div className="flex items-center gap-1 mt-4">
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span> · <a className='underline' href="#reviews">100 reviews</a>
                            </div>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='property-owner-info flex flex-row gap-4'>
                            <div className='property-owner-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                <img src="https://placehold.co/100x100" alt="Owner" className="w-full h-full object-cover" />
                            </div>
                            <div className='property-owner-details'>
                                <h3>Hosted by Owner</h3>
                                <p className='text-sm text-gray-500'>Superhost · 9 years hosting</p>
                            </div>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='property-description flex flex-col gap-4'>
                            <h2>Description</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        {/* Pass property amenities through here */}
                        <PropertyAmenities />

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='date-picker-section flex flex-col gap-4'>
                            <div>
                                <h2>X nights in Country</h2>
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
                                />
                            </div>
                        </div>
                    </div>

                    <Separator orientation='vertical' className='h-full mx-4' />

                    <div className='property-payment flex-[3] bg-blue-100'>
                        <div className='payment-card flex flex-col gap-4'>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-baseline gap-1'>
                                        <h2>$143</h2>
                                        <span className='text-gray-500 font-normal'>/ night</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={(e) => { e.preventDefault(); }}>
                                        <div className="flex flex-col gap-6">
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Check-in */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="checkin">Check-in</Label>
                                                    <Popover>
                                                        <PopoverTrigger className="w-full px-4 py-2 border rounded-md text-left">
                                                            {date?.from ? date.from.toLocaleDateString() : "24/05/2025"}
                                                        </PopoverTrigger>
                                                        <PopoverContent className="z-50 p-4 rounded-md shadow-lg bg-white">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date?.from}
                                                                onSelect={(newDate) => setDate({ ...date, from: newDate })}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                                {/* Check-out */}
                                                <div className="space-y-3">
                                                    <Label htmlFor="checkout">Check-out</Label>
                                                    <Popover>
                                                        <PopoverTrigger className="w-full px-4 py-2 border rounded-md text-left">
                                                            {date?.to ? date.to.toLocaleDateString() : "28/05/2025"}
                                                        </PopoverTrigger>
                                                        <PopoverContent className="z-50 p-4 rounded-md shadow-lg bg-white">
                                                            <Calendar
                                                                mode="single"
                                                                selected={date?.to}
                                                                onSelect={(newDate) => date?.from && setDate({ from: date.from, to: newDate })}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="guests">Number of Guests</Label>
                                                <Input
                                                    id="guests"
                                                    type="number"
                                                    placeholder="0"
                                                    required
                                                    value={guests}
                                                    onChange={(e) => setGuests(Number(e.target.value))}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                                                    Reserve
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center text-sm text-gray-500">
                                            You won't be charged yet.
                                        </div>

                                        <div className='price-details flex flex-col gap-2 mt-4'>
                                            <div className='price-details-item flex flex-row justify-between'>
                                                <span>$143 x 2 nights</span>
                                                <span>$286</span>
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
                                            <h3 className='font-semibold text-xl'>$306</h3>
                                        </div>
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
                            4.7 · 100 reviews
                        </h2>
                    </div>

                    {/* Pass property reviews overview eg cleansiness, overall score, etc -> better readability */}
                    <PropertyReviewsOverview />
                </div>

                <Separator orientation='horizontal' className='my-0' />

                {/* place reviews here -> pass reviews through here */}
                <div id='reviews'>
                    <PropertyReviews />
                </div>

                <Separator orientation='horizontal' className='my-0' />

                <div className='your-stay-location flex flex-col gap-4'>
                    <div className='your-stay-location-header'>
                        <h2>Where you'll be staying</h2>
                        <span className='text-gray-500'>City, Country</span>
                    </div>

                    <div className='map-container h-[400px] w-full'>
                        <MapContainer
                            center={[51.505, -0.09]}
                            zoom={13}
                            scrollWheelZoom={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[51.505, -0.09]} icon={customPin}>
                                <Popup>
                                    Property location
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>

                <Separator orientation='horizontal' className='my-0' />

                <div className='things-to-know flex flex-col gap-4'>
                    <h2>Things to know</h2>
                    <div className='grid grid-cols-3 gap-4'>
                        {/* checkin, checkout, rules */}
                        <div className='flex flex-row border-1 border-border rounded-lg p-4 items-center'>
                            <Key height={32} width={32} className='min-w-[32px] min-h-[32px]' />

                            <Separator orientation='vertical' className='h-full mr-8 ml-4' />

                            <div className='flex flex-col gap-1'>
                                <h3 className='text-sm'>Check-in</h3>
                                <span className='text-xl font-semibold'>10:00</span>
                            </div>
                        </div>

                        <div className='flex flex-row border-1 border-border rounded-lg p-4 items-center'>
                            <DoorOpen height={32} width={32} className='min-w-[32px] min-h-[32px]' />

                            <Separator orientation='vertical' className='h-full mr-8 ml-4' />

                            <div className='flex flex-col gap-1'>
                                <h3 className='text-sm'>Check-out</h3>
                                <span className='text-xl font-semibold'>16:00</span>
                            </div>
                        </div>

                        <div className='flex flex-row border-1 border-border rounded-lg p-4 items-center'>
                            <Book height={32} width={32} className='min-w-[32px] min-h-[32px]' />

                            <Separator orientation='vertical' className='h-full mr-8 ml-4' />

                            <div className='flex flex-col gap-1'>
                                <h3 className='text-sm'>Rules</h3>
                                <span className='text-xl font-semibold'>No loud music after 10 PM, respect wildlife.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Property;