import { Car, Dog, Flame, Bath, ShowerHead, UtensilsCrossed, ParkingMeter, Mountain } from "lucide-react";
import { Button } from "../ui/button";

const PropertyAmenities = () => {
    return (
        <>
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
        </>
    )
}

export default PropertyAmenities;