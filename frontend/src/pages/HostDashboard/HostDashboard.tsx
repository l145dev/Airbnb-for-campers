import { useEffect, useState } from 'react';
import './HostDashboard.css';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import HostDashboardCard from '@/components/HostDashboardCard/HostDashboardCard';
import nolistings from '@/assets/images/notripshistory.jpg';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HostDashboardPost from '@/components/HostDashboardDialog/HostDashboardPost';
import { useNavigate } from 'react-router-dom';

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

interface ApiResponse {
    success: boolean;
    resolvedPromise: HostDashboardDetails[];
    error?: string;
}

const fetchHostDashboardCards = async (): Promise<ApiResponse> => {
    try {
        const response = await axios.get('http://localhost:3000/hostdashboard', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        if (response.status === 200) {
            return response.data;
        }

        else if (response.status === 401) {
            toast.error("You are not authorized. Redirecting to host login.", {
                description: new Date().toLocaleTimeString(),
            });
            return { success: false, resolvedPromise: [], error: "Unauthorized" };
        }

        else {
            toast.error("Failed to fetch listings. Please refresh page to try again.", {
                description: new Date().toLocaleTimeString(),
            });
            return { success: false, resolvedPromise: [] };
        }
    } catch (error) {
        toast.error("Failed to fetch listings. Please refresh page to try again.", {
            description: new Date().toLocaleTimeString(),
        });
        console.error("Error fetching listings:", error);
        throw error;
    }
}

const HostDashboard = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery<ApiResponse>({
        queryKey: ['host-dashboard'],
        queryFn: fetchHostDashboardCards,
        enabled: true,
    });

    const refreshData = () => {
        queryClient.invalidateQueries({ queryKey: ['host-dashboard'] });
    }

    return (
        <>
            <Toaster closeButton />
            <div className='host-dashboard flex flex-col gap-4'>
                <h1>Host Dashboard</h1>
                {isError ? (
                    <div className='flex flex-col items-center justify-center'>
                        <h2 className='text-xl font-semibold'>Error fetching trips</h2>
                        <p className='text-gray-600'>Please refresh the page to try again.</p>
                    </div>
                ) : (
                    <>
                        <div className='your-listings flex flex-col gap-4'>
                            <div className='flex flex-row justify-between items-center'>
                                <h2>Your Listings</h2>
                                <HostDashboardPost onDataRefresh={refreshData} />
                            </div>
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
                                    {Array.isArray(data?.resolvedPromise) && data.resolvedPromise.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                            {data.resolvedPromise.map((host_dashboard_card: HostDashboardDetails) => (
                                                <HostDashboardCard
                                                    key={host_dashboard_card.property_id}
                                                    host_dashboard_card={host_dashboard_card}
                                                    type={host_dashboard_card.is_active ? "active" : "inactive"}
                                                    onDataRefresh={refreshData}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='flex flex-row h-[300px] w-full rounded-lg items-center justify-center border'>
                                            <div className='flex-[5] h-full overflow-hidden rounded-l-lg'>
                                                <img src={nolistings} alt="Upcoming Trip" className='h-full w-full object-cover' />
                                            </div>

                                            <div className='flex flex-[3] flex-col p-8 h-full justify-between'>
                                                <div>
                                                    <h3 className='text-xl font-semibold'>No listings!</h3>
                                                    <p className='text-gray-600'>Your listings will appear here once they are available.</p>
                                                </div>

                                                <div className='w-min'>
                                                    <HostDashboardPost onDataRefresh={refreshData} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default HostDashboard;