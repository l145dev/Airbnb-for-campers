import './Property.css';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from "react-day-picker";
import { Progress } from "@/components/ui/progress"
import { Share, Heart, Star, Car, Bath, Dog, Flame, Mountain, ParkingMeter, UtensilsCrossed, ShowerHead, Bubbles, Target, Key, MessageSquare, MapPinned, Tag, DoorOpen, Book } from 'lucide-react';
import { useState } from 'react';
import { Footer } from '@/components/Footer/Footer';

// map
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import marker from '../../assets/images/Map-Marker-PNG-HD.png';

const Property = () => {
    // save states
    const [saved, setSaved] = useState<boolean>(false);
    const [hoverSaved, setHoveredSaved] = useState<boolean>(false);

    // date picker states
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 4, 24), // replace with selected date -> remember months are 0-indexed
        to: new Date(2025, 4, 30), // replace with selected date
    });

    // custom icon for leaflet
    const customPin = new Icon({
        iconUrl: marker,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48]
    });

    // progress bar states
    const [progressFive, setProgressFive] = useState<number>(75); // replace with 5 star value
    const [progressFour, setProgressFour] = useState<number>(10); // replace with 4 star value
    const [progressThree, setProgressThree] = useState<number>(5); // replace with 3 star value
    const [progressTwo, setProgressTwo] = useState<number>(0); // replace with 2 star value
    const [progressOne, setProgressOne] = useState<number>(10); // replace with 1 star value

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
                                <span>4.7</span> · <span className='underline'>100 reviews</span>
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

                        <div className='property-amenities flex flex-col gap-4'>
                            <h2>Amenities</h2>
                            <div className="grid grid-rows-2 grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Car />
                                    <span>Parking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dog />
                                    <span>Pet friendly</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Flame />
                                    <span>Campfire pit</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bath />
                                    <span>Private bathroom</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShowerHead />
                                    <span>Private shower</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UtensilsCrossed />
                                    <span>Kitchen</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ParkingMeter />
                                    <span>Power sockets</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mountain />
                                    <span>Scenic views</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">
                                Show all amenities
                            </Button>
                        </div>

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
                                    initialFocus
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

                    <div className='reviews-overview-details grid grid-cols-7 gap-4'>
                        <div className='overall-rating flex flex-col gap-2'>
                            <h3 className='text-sm font-semibold'>Overall rating</h3>
                            <div className="rating-progresses flex flex-col items-center gap-1">
                                <div className='rating-progress flex flex-row gap-2 items-center'>
                                    <span className='text-xs'>5</span>
                                    <Progress value={progressFive} className='w-32 h-1' />
                                </div>
                                <div className='rating-progress flex flex-row gap-2 items-center'>
                                    <span className='text-xs'>4</span>
                                    <Progress value={progressFour} className='w-32 h-1' />
                                </div>
                                <div className='rating-progress flex flex-row gap-2 items-center'>
                                    <span className='text-xs'>3</span>
                                    <Progress value={progressThree} className='w-32 h-1' />
                                </div>
                                <div className='rating-progress flex flex-row gap-2 items-center'>
                                    <span className='text-xs'>2</span>
                                    <Progress value={progressTwo} className='w-32 h-1' />
                                </div>
                                <div className='rating-progress flex flex-row gap-2 items-center'>
                                    <span className='text-xs'>1</span>
                                    <Progress value={progressOne} className='w-32 h-1' />
                                </div>
                            </div>
                        </div>

                        <div className='cleansiness-rating flex flex-col justify-between border-l border-border pl-4'>
                            <div className='cleansiness-rating-header flex flex-col gap-2'>
                                <h3 className='text-sm font-semibold'>Cleansiness</h3>
                                <span className='text-xl font-semibold'>4.5</span>
                            </div>

                            <Bubbles width={32} height={32} />
                        </div>

                        <div className='accuracy-rating flex flex-col justify-between border-l border-border pl-4'>
                            <div className='accuracy-rating-header flex flex-col gap-2'>
                                <h3 className='text-sm font-semibold'>Accuracy</h3>
                                <span className='text-xl font-semibold'>4.8</span>
                            </div>

                            <Target width={32} height={32} />
                        </div>

                        <div className='checking-rating flex flex-col justify-between border-l border-border pl-4'>
                            <div className='checking-rating-header flex flex-col gap-2'>
                                <h3 className='text-sm font-semibold'>Check-in</h3>
                                <span className='text-xl font-semibold'>4.7</span>
                            </div>

                            <Key width={32} height={32} />
                        </div>

                        <div className='communication-rating flex flex-col justify-between border-l border-border pl-4'>
                            <div className='communication-rating-header flex flex-col gap-2'>
                                <h3 className='text-sm font-semibold'>Communication</h3>
                                <span className='text-xl font-semibold'>4.9</span>
                            </div>

                            <MessageSquare width={32} height={32} />
                        </div>

                        <div className='location-rating flex flex-col justify-between border-l border-border pl-4'>
                            <div className='location-rating-header flex flex-col gap-2'>
                                <h3 className='text-sm font-semibold'>Location</h3>
                                <span className='text-xl font-semibold'>4.6</span>
                            </div>

                            <MapPinned width={32} height={32} />
                        </div>

                        <div className='value-rating flex flex-col justify-between border-l border-border pl-4'>
                            <div className='value-rating-header flex flex-col gap-2'>
                                <h3 className='text-sm font-semibold'>Value</h3>
                                <span className='text-xl font-semibold'>4.5</span>
                            </div>

                            <Tag width={32} height={32} />
                        </div>
                    </div>
                </div>

                <Separator orientation='horizontal' className='my-0' />

                <div className='reviews grid grid-rows-3 gap-8'>
                    <div className='reviews-top grid grid-cols-2 gap-8'>
                        <div className='review-card flex flex-col gap-2'>
                            <div className='review-card-header flex flex-row items-center gap-2'>
                                <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                    <img src="https://placehold.co/100x100" alt="Reviewer" className="w-full h-full object-cover" />
                                </div>
                                <div className='reviewer-details'>
                                    <h3>Reviewer name</h3>
                                    <p className='text-sm text-gray-500'>City, Country</p>
                                </div>
                            </div>

                            <div className='review-card-body'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span>
                            </div>
                        </div>

                        <div className='review-card flex flex-col gap-2'>
                            <div className='review-card-header flex flex-row items-center gap-2'>
                                <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                    <img src="https://placehold.co/100x100" alt="Reviewer" className="w-full h-full object-cover" />
                                </div>
                                <div className='reviewer-details'>
                                    <h3>Reviewer name</h3>
                                    <p className='text-sm text-gray-500'>City, Country</p>
                                </div>
                            </div>

                            <div className='review-card-body'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span>
                            </div>
                        </div>
                    </div>

                    <div className='reviews-middle grid grid-cols-2 gap-8'>
                        <div className='review-card flex flex-col gap-2'>
                            <div className='review-card-header flex flex-row items-center gap-2'>
                                <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                    <img src="https://placehold.co/100x100" alt="Reviewer" className="w-full h-full object-cover" />
                                </div>
                                <div className='reviewer-details'>
                                    <h3>Reviewer name</h3>
                                    <p className='text-sm text-gray-500'>City, Country</p>
                                </div>
                            </div>

                            <div className='review-card-body'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span>
                            </div>
                        </div>

                        <div className='review-card flex flex-col gap-2'>
                            <div className='review-card-header flex flex-row items-center gap-2'>
                                <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                    <img src="https://placehold.co/100x100" alt="Reviewer" className="w-full h-full object-cover" />
                                </div>
                                <div className='reviewer-details'>
                                    <h3>Reviewer name</h3>
                                    <p className='text-sm text-gray-500'>City, Country</p>
                                </div>
                            </div>

                            <div className='review-card-body'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span>
                            </div>
                        </div>
                    </div>

                    <div className='reviews-bottom grid grid-cols-2 gap-8'>
                        <div className='review-card flex flex-col gap-2'>
                            <div className='review-card-header flex flex-row items-center gap-2'>
                                <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                    <img src="https://placehold.co/100x100" alt="Reviewer" className="w-full h-full object-cover" />
                                </div>
                                <div className='reviewer-details'>
                                    <h3>Reviewer name</h3>
                                    <p className='text-sm text-gray-500'>City, Country</p>
                                </div>
                            </div>

                            <div className='review-card-body'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span>
                            </div>
                        </div>

                        <div className='review-card flex flex-col gap-2'>
                            <div className='review-card-header flex flex-row items-center gap-2'>
                                <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                    <img src="https://placehold.co/100x100" alt="Reviewer" className="w-full h-full object-cover" />
                                </div>
                                <div className='reviewer-details'>
                                    <h3>Reviewer name</h3>
                                    <p className='text-sm text-gray-500'>City, Country</p>
                                </div>
                            </div>

                            <div className='review-card-body'>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                <Star fill='black' height={16} width={16} />
                                <span>4.7</span>
                            </div>
                        </div>
                    </div>
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