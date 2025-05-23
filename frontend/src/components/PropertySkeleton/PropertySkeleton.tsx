import { Footer } from "../Footer/Footer"
import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"

const PropertySkeleton = () => {
    return (
        <>
            <div className='property flex flex-col gap-4'>
                {/* property header skeleton */}
                <div className='property-header flex flex-row justify-between items-center'>
                    <Skeleton className='h-8 w-1/4' />
                    <div className='action-buttons flex flex-row gap-2'>
                        <Skeleton className='h-10 w-24' />
                        <Skeleton className='h-10 w-24' />
                    </div>
                </div>

                {/* property images skeleton */}
                <div className='property-images grid grid-cols-2 gap-4'>
                    <Skeleton className='main-property-image rounded-lg h-[400px]' />
                    <div className='alt-property-images grid grid-cols-2 gap-4'>
                        <div className='alt-property-images-top grid grid-rows-2 gap-4'>
                            <Skeleton className='alt-property-image rounded-lg h-full' />
                            <Skeleton className='alt-property-image rounded-lg h-full' />
                        </div>
                        <div className='alt-property-images-bottom grid grid-rows-2 gap-4'>
                            <Skeleton className='alt-property-image rounded-lg h-full' />
                            <Skeleton className='alt-property-image rounded-lg h-full' />
                        </div>
                    </div>
                </div>

                {/* details and payment grid skeleton */}
                <div className='property-details flex'>
                    <div className='property-info flex-[5] space-y-4'>
                        <div className='property-info-main space-y-2'>
                            <Skeleton className='h-7 w-1/2' />
                            <Skeleton className='h-4 w-1/3' />
                            <div className="flex items-center gap-1 mt-4">
                                <Skeleton className='h-6 w-6 rounded-full' />
                                <Skeleton className='h-4 w-1/4' />
                            </div>
                        </div>

                        <Skeleton className='h-px w-full' />

                        <div className='property-owner-info flex flex-row gap-4 items-center'>
                            <Skeleton className='rounded-full h-[48px] w-[48px]' />
                            <div className='space-y-2'>
                                <Skeleton className='h-6 w-32' />
                                <Skeleton className='h-4 w-48' />
                            </div>
                        </div>

                        <Skeleton className='h-px w-full' />

                        <div className='property-description flex flex-col gap-2'>
                            <Skeleton className='h-7 w-1/3 mb-2' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                        </div>

                        <Skeleton className='h-px w-full' />

                        {/* PropertyAmenities Skeleton */}
                        <div className="space-y-2">
                            <Skeleton className='h-7 w-1/3' />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-6 w-full" />
                            </div>
                        </div>


                        <Skeleton className='h-px w-full' />

                        <div className='date-picker-section flex flex-col gap-4'>
                            <div className="space-y-2">
                                <Skeleton className='h-7 w-1/3' />
                                <Skeleton className='h-4 w-1/2' />
                            </div>
                            <div className='date-picker grid grid-cols-3 gap-2'>
                                <Skeleton className='h-72 w-full' />
                                <Skeleton className='h-72 w-full' />
                                <Skeleton className='h-72 w-full' />
                            </div>
                        </div>
                    </div>

                    <Separator orientation='vertical' className='w-px mx-4' />

                    <div className='property-payment flex-[3]'>
                        <div className='payment-card flex flex-col gap-4 border p-6 rounded-xl shadow-md'>
                            <div className="flex items-baseline gap-2">
                                <Skeleton className='h-8 w-24' />
                                <Skeleton className='h-4 w-16' />
                            </div>
                            <div className="flex flex-col gap-6 mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-3">
                                        <Skeleton className='h-4 w-1/2' />
                                        <Skeleton className='h-10 w-full rounded-md' />
                                    </div>
                                    <div className="space-y-3">
                                        <Skeleton className='h-4 w-1/2' />
                                        <Skeleton className='h-10 w-full rounded-md' />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Skeleton className='h-4 w-1/3' />
                                    <Skeleton className='h-10 w-full rounded-md' />
                                </div>
                                <Skeleton className="h-12 w-full" />
                            </div>
                            <div className="mt-4 h-4 w-1/2 mx-auto">
                                <Skeleton className="h-full w-full" />
                            </div>

                            <div className='price-details flex flex-col gap-2 mt-4'>
                                <div className='price-details-item flex flex-row justify-between'>
                                    <Skeleton className='h-4 w-1/3' />
                                    <Skeleton className='h-4 w-1/4' />
                                </div>
                                <div className='price-details-item flex flex-row justify-between'>
                                    <Skeleton className='h-4 w-1/4' />
                                    <Skeleton className='h-4 w-1/6' />
                                </div>
                            </div>

                            <Skeleton className='h-px w-full my-4' />

                            <div className='price-total flex flex-row justify-between'>
                                <Skeleton className='h-7 w-1/4' />
                                <Skeleton className='h-7 w-1/3' />
                            </div>
                        </div>
                    </div>
                </div>

                <Skeleton className='h-px w-full my-4' />

                <div className='reviews-overview flex flex-col gap-4'>
                    <div className='reviews-overview-header flex flex-row items-center gap-2'>
                        <Skeleton className='h-8 w-8 rounded-full' />
                        <Skeleton className='h-7 w-1/3' />
                    </div>
                    {/* PropertyReviewsOverview Skeleton */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    </div>
                </div>

                <Skeleton className='h-px w-full my-4' />

                {/* PropertyReviews Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>


                <Skeleton className='h-px w-full my-4' />

                <div className='your-stay-location flex flex-col gap-4'>
                    <div className='your-stay-location-header space-y-1'>
                        <Skeleton className='h-7 w-1/3' />
                        <Skeleton className='h-4 w-1/4' />
                    </div>
                    <Skeleton className='map-container h-[400px] w-full rounded' />
                </div>

                <Skeleton className='h-px w-full my-4' />

                <div className='things-to-know flex flex-col gap-4'>
                    <Skeleton className='h-7 w-1/4' />
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <Skeleton className='h-24 rounded-lg' />
                        <Skeleton className='h-24 rounded-lg' />
                        <Skeleton className='h-24 rounded-lg' />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PropertySkeleton