import './Property.css';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Share, Heart, Star, Car, Bath, Dog, Flame, Mountain, ParkingMeter, UtensilsCrossed, ShowerHead } from 'lucide-react';
import { useState } from 'react';

const Property = () => {
    // save states
    const [saved, setSaved] = useState<boolean>(false);
    const [hoverSaved, setHoveredSaved] = useState<boolean>(false);

    // date picker state
    const [selectedCheckin, setSelectedCheckin] = useState<Date>();
    const [selectedCheckout, setSelectedCheckout] = useState<Date>();

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
                                    <span>2 April, 2024</span> - <span>5 April, 2025</span>
                                </p>
                            </div>

                            <div className='date-picker flex flex-row gap-10'>
                                <div className='date-picker-checkin flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Check-in</h3>
                                    <Calendar
                                        mode='single'
                                        selected={selectedCheckin}
                                        onSelect={setSelectedCheckin}
                                        className='p-0'
                                    />
                                </div>

                                <div className='date-picker-checkout flex flex-col gap-2'>
                                    <h3 className='font-semibold'>Check-out</h3>
                                    <Calendar
                                        mode='single'
                                        selected={selectedCheckout}
                                        onSelect={setSelectedCheckout}
                                        className='p-0'
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator orientation='horizontal' className='my-4' />

                        <div className='reviews-overview flex flex-col gap-4'>
                            <div className='reviews-overview-header flex flex-row items-center gap-2'>
                                <Star fill='black' height={24} width={24} />
                                <h2>
                                    4.7 · 100 reviews
                                </h2>
                            </div>
                        </div>
                    </div>

                    <Separator orientation='vertical' className='h-full mx-4' />

                    <div className='property-payment flex-[3] bg-blue-100'>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Property;