import { useEffect, useState } from 'react';
import './Host.css';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { LoaderCircle, MinusIcon, PlusIcon, Search, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandItem } from '@/components/ui/command';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
// map
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import marker from '../../assets/images/Map-Marker-PNG-HD.png';
import MarketClusterGroup from 'react-leaflet-cluster';

interface PropertyImage {
    image_id: number;
    property_id: number;
    image_url: string;
    alt_text: string;
    is_main: boolean;
}

interface Property {
    property_id: number;
    property_name: string;
    average_rating: string;
    price_per_night: string;
    capacity: number;
    property_images: PropertyImage[];
    longitude: string;
    latitude: string;
}

interface ReturnObject {
    properties: Property[];
    averageNightPrice: number;
    totalNightsValue: number;
    is_owner: boolean;
}

async function fetchData(searchParams: URLSearchParams): Promise<ReturnObject> {
    try {
        const response = await axios.get(`https://airbnb-for-campers.onrender.com/host?${searchParams.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        return response.data.returnObj;
    }

    catch (error) {
        toast.error("Error fetching data", {
            description: new Date().toLocaleString(),
        });
        console.error('Error fetching data:', error);
        throw error;
    }
}

const Host = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['host', searchParams.toString()],
        queryFn: () => fetchData(searchParams),
    });

    // custom icon for leaflet
    const customPin = new Icon({
        iconUrl: marker,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    const [nights, setNights] = useState<number[]>([Number(searchParams.get("nights")) || 7]);

    const [location, setLocation] = useState<string>(searchParams.get("city") || "");
    const [guests, setGuests] = useState<number>(() => {
        const guestsParam = searchParams.get("guests");
        return guestsParam ? parseInt(guestsParam, 10) : 0;
    });
    const [propType, setPropType] = useState<string>(searchParams.get("propType") || "");

    const [totalNightsValue, setTotalNightsValue] = useState<number>(0);
    const [averageNightPrice, setAverageNightPrice] = useState<number>(0);

    useEffect(() => {
        if (data && data !== undefined) {
            setTotalNightsValue(data.totalNightsValue);
            setAverageNightPrice(data.averageNightPrice);
        }
    }, [data]);

    const handleUpdate = () => {
        const queryParams = new URLSearchParams();

        // only append to params when available
        if (location !== "") {
            queryParams.append("city", location);
        }

        if (nights[0] !== 0) {
            queryParams.append("nights", nights[0].toString());
        }

        if (guests !== 0) {
            queryParams.append("guests", guests.toString());
        }

        if (propType !== "") {
            queryParams.append("property_type", propType.toLowerCase());
        }

        const queryString = queryParams.toString();
        navigate(`/host?${queryString}`);
    }

    const becomeHost = async () => {
        try {
            const response = await axios.post("https://airbnb-for-campers.onrender.com/host", {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })

            if (response.status === 200) {
                toast.success("Successfully became host!", {
                    description: new Date().toLocaleString(),
                })
            }

            else {
                toast.error("Could not become host!", {
                    description: new Date().toLocaleString(),
                });
            }
        }

        catch (error) {
            toast.error("Could not become host", {
                description: new Date().toLocaleString(),
            });
            console.error('Could not become host:', error);
            throw error;
        }
    }

    // im lazy to work with skeleton atm
    if (isLoading) {
        return (
            <>
                <div className='host flex justify-center items-center'>
                    <LoaderCircle className='animate-spin' height={48} width={48} />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <div className='host flex justify-center items-center'>
                    <h1>Error!</h1>
                    <h2>{error.message}</h2>
                </div>
            </>
        )
    }

    return (
        <>
            <Toaster closeButton />
            {/* SPA */}
            <div className='host'>
                <div className='host-container flex flex-row items-center justify-around h-full w-full px-64 gap-12'>
                    <div className='info-container flex flex-col items-center text-center gap-4'>
                        <span className='text-4xl font-semibold'>
                            Your camp could make ${totalNightsValue} on Airbnb camping
                        </span>

                        <p>
                            {nights[0]} nights · <span className='underline'>${averageNightPrice}/night</span>
                        </p>

                        <div className='w-[70%]'>
                            <Slider defaultValue={nights} max={30} step={1} onValueChange={(val) => {
                                setNights(val);
                                setTotalNightsValue(averageNightPrice * val[0]);
                            }} className='my-4' />
                        </div>

                        <div className='search flex flex-row gap-4 w-min border rounded-full p-2 mb-2 items-center px-4'>
                            <button onClick={handleUpdate}>
                                <Search color='#3D8B40' />
                            </button>
                            <div className='search-options flex flex-row'>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={'ghost'}>
                                            {location || "Hogsmeade"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search locations..."
                                                value={location}
                                                onValueChange={(value) => setLocation(value)}
                                            />
                                            <CommandItem onSelect={(value) => setLocation(value)}>
                                                Devon
                                            </CommandItem>
                                            <CommandItem onSelect={(value) => setLocation(value)}>
                                                Cornwall
                                            </CommandItem>
                                            <CommandItem onSelect={(value) => setLocation(value)}>
                                                Wiltshire
                                            </CommandItem>
                                            <CommandItem onSelect={(value) => setLocation(value)}>
                                                Hogsmeade
                                            </CommandItem>
                                            <CommandItem onSelect={(value) => setLocation(value)}>
                                                The Midlands
                                            </CommandItem>
                                            <CommandItem onSelect={(value) => setLocation(value)}>
                                                Gloucestershire
                                            </CommandItem>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <div className='text-gray-500 flex flex-row items-center'>
                                    ·
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={'ghost'}>
                                                {propType || "Any property type"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search locations..."
                                                    value={propType}
                                                    onValueChange={(value) => setPropType(value)}
                                                />
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Any property type
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Cabins
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Tents
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    RV
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Treehouses
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Glamping
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Farms
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Yurts
                                                </CommandItem>
                                                <CommandItem onSelect={(value) => setPropType(value)}>
                                                    Unique
                                                </CommandItem>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    ·
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={'ghost'}>
                                                {guests > 0 ? `${guests} Guest${guests > 1 ? "s" : ""}` : "Anyone"}
                                            </Button>

                                        </PopoverTrigger>
                                        <PopoverContent className="w-48">
                                            <div className="flex items-center justify-between p-2 gap-2">
                                                <span>Guests</span>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setGuests(Math.max(0, guests - 1))}>
                                                        <MinusIcon className="w-4 h-4" />
                                                    </Button>
                                                    <span>{guests}</span>
                                                    <Button variant="ghost" size="icon" onClick={() => setGuests(guests + 1)}>
                                                        <PlusIcon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <div className='controls flex flex-row gap-4'>
                            <Link to={"/host-dashboard"}>
                                <Button variant={'outline'}>
                                    Host Dashboard
                                </Button>
                            </Link>

                            <Button variant={'default'} onClick={becomeHost}>
                                Become a host
                            </Button>
                        </div>
                    </div>

                    <div className='map-container h-[60%] w-auto aspect-square bg-blue-100 rounded-lg overflow-hidden'>
                        <MapContainer
                            center={[55.41569239101371, -1.7058667577187978]} // castle where harry potter was filmed
                            zoom={3}
                            scrollWheelZoom={true}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MarketClusterGroup>
                                {Array.isArray(data?.properties) && data.properties.map((property: Property) => (
                                    <Marker position={[Number(property.latitude), Number(property.longitude)]} icon={customPin} key={property.property_id}>
                                        <Popup>
                                            <div className='flex flex-row gap-4'>
                                                <div className='aspect-square min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px] rounded-lg overflow-hidden'>
                                                    <img src={property.property_images[0].image_url} alt="Property" className='h-full w-full object-cover' />
                                                </div>
                                                <div className='flex flex-col justify-between'>
                                                    <div>
                                                        <h3 className='font-semibold text-lg'>{property.property_name}</h3>
                                                        <p className='text-sm text-gray-500'>${property.price_per_night}/night</p>
                                                    </div>

                                                    <div className='flex flex-row gap-1 items-center text-sm'>
                                                        <Star fill='black' height={12} width={12} />
                                                        <span>{property.average_rating} · <span className='text-gray-500'>{property.capacity} Guests</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`/property?property_id=${property.property_id}`}>
                                                <Button variant={'default'} className='w-full mt-2'>
                                                    View Listing
                                                </Button>
                                            </Link>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MarketClusterGroup>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Host;