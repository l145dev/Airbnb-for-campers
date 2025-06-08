import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast, Toaster } from "sonner";
import axios from "axios";

interface HostDashboardDetails {
    property_id: number;
    property_name: string;
    city: string;
    country: string;
    reviewCount: number;
    average_rating: number;
    is_active: boolean;
    image_url: string;
    nextBooking: string;
    totalRevenue: number;
    totalBookings: number;
    adr: number;
}

const HostDashboardCard: React.FC<{ host_dashboard_card: HostDashboardDetails, type: 'active' | 'inactive', onDataRefresh: () => void }> = ({ host_dashboard_card, type, onDataRefresh }) => {
    const publish = async () => {
        // unpublish/publish property
        try {
            const response = await axios.patch("http://localhost:3000/hostdashboard/publish", {
                property_id: host_dashboard_card.property_id,
                published: host_dashboard_card.is_active,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success(`Property ${host_dashboard_card.is_active ? "unpublished" : "published"} successfully.`, {
                    description: new Date().toLocaleTimeString(),
                });
                // invalidate query (reload data)
                onDataRefresh();
            }

        } catch (error) {
            toast.error(`Failed to ${host_dashboard_card.is_active ? "unpublish" : "publish"} listing. Please refresh page to try again.`, {
                description: new Date().toLocaleTimeString(),
            });
            console.error(`Error ${host_dashboard_card.is_active ? "unpublishing" : "publishing"} listings:`, error);
            throw error;
        }
    }

    return (
        <>
            <Card>
                <CardContent className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4'>
                        <div className='aspect-square min-h-[150px] min-w-[150px] max-h-[150px] max-w-[150px] rounded-lg overflow-hidden bg-gray-500'>
                            <img src={"https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/propertyimages//" + host_dashboard_card.image_url} alt="Property" className='h-full w-full object-cover' />
                        </div>
                        <div className='flex flex-col justify-between'>
                            <div>
                                <h3 className='font-semibold text-lg'>{host_dashboard_card.property_name}</h3>
                                <p className='text-sm text-gray-500'>{host_dashboard_card.city}, {host_dashboard_card.country}</p>
                            </div>

                            <div className='flex flex-row gap-1 items-center text-sm'>
                                <Star fill='black' height={12} width={12} />
                                <span>{host_dashboard_card.average_rating} <span className='text-gray-500'>({host_dashboard_card.reviewCount} reviews)</span></span>
                            </div>
                        </div>
                    </div>

                    <h2>About Property</h2>
                    <div className='host-dashboard-card-details flex flex-col gap-2'>
                        <div className='host-dashboard-card-details-property flex flex-row justify-between'>
                            <span>Property Number</span>
                            <span>#{host_dashboard_card.property_id}</span>
                        </div>
                        <div className='host-dashboard-card-details-next-rental flex flex-row justify-between'>
                            <span>Next rental</span>
                            <span>{host_dashboard_card.nextBooking}</span>
                        </div>
                        <div className='host-dashboard-card-details-total-revenue flex flex-row justify-between'>
                            <span>Total Revenue</span>
                            <span>${host_dashboard_card.totalRevenue}</span>
                        </div>
                        <div className="host-dashboard-card-details-total-bookings flex flex-row justify-between">
                            <span>Total Bookings</span>
                            <span>{host_dashboard_card.totalBookings}</span>
                        </div>
                    </div>

                    <div className="host-dashboard-card-details-actions flex flex-row justify-between">
                        {type === 'active' ? (
                            // active = published
                            <>
                                <div className="host-dashboard-card-details-actions-leftcontrols flex flex-row gap-4">
                                    {/* toggle to unpublish */}
                                    <Tooltip >
                                        <TooltipTrigger asChild>
                                            <Button size={'sm'} variant='default' onClick={publish}>
                                                Published
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Unpublish</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    {/* view listing */}
                                    <Link to={`/property?property_id=${host_dashboard_card.property_id}`}>
                                        <Button size={'sm'} variant={'outline'}>
                                            View Listing
                                        </Button>
                                    </Link>
                                </div>

                                {/* trigger open a dialog menu with modification */}

                                <span className="underline">Modify</span>
                            </>
                        ) : type === 'inactive' && (
                            // inactive = not published
                            <>
                                <Button size={'sm'} variant='default' onClick={publish}>
                                    Publish
                                </Button>

                                <span className="underline">Modify</span>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default HostDashboardCard;