import { useState } from 'react';
import './HostDashboard.css';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const HostDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    return (
        <>
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
                            <h2>Your Listings</h2>
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
                                    {/* data here */}
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