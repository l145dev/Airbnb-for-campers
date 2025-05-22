import './Property.css';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Share, Heart, Star, Car, Bath, Dog, Flame, Mountain, ParkingMeter, UtensilsCrossed, ShowerHead } from 'lucide-react';
import { useState } from 'react';

const Property = () => {
    const [saved, setSaved] = useState<boolean>(false);
    const [hoverSaved, setHoveredSaved] = useState<boolean>(false);

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
                    <div className='property-info flex-[5] bg-yellow-100'>
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