import './Listings.css';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
// icons
import cabinIcon from '../../assets/images/icons8-log-cabin-100.png';
import tentIcon from '../../assets/images/icons8-tent-100.png';
import rvIcon from '../../assets/images/icons8-rv-100.png';
import treehouseIcon from '../../assets/images/icons8-treehouse-100.png';
import glampIcon from '../../assets/images/icons8-large-glamp-100.png';
import uniqueIcon from '../../assets/images/icons8-unique-100.png';
import farmIcon from '../../assets/images/icons8-farm-100.png';
import yurtIcon from '../../assets/images/icons8-yurt-100.png';

const Listings = () => {
    return (
        <>
            <div className='listings'>
                <div className='proptype-container'>
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex w-full space-x-4 pb-4 justify-center">
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={cabinIcon} alt="Cabin" className="w-8 h-8" />
                                    <span>Cabins</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={tentIcon} alt="Tent" className="w-8 h-8" />
                                    <span>Tents</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={rvIcon} alt="RV" className="w-8 h-8" />
                                    <span>RV</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={treehouseIcon} alt="Treehouse" className="w-8 h-8" />
                                    <span>Treehouses</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={glampIcon} alt="Glamping" className="w-8 h-8" />
                                    <span>Glamping</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={uniqueIcon} alt="Unique" className="w-8 h-8" />
                                    <span>Unique Stays</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={farmIcon} alt="Farm" className="w-8 h-8" />
                                    <span>Farms</span>
                                </div>
                            </Button>
                            <Button variant={'ghost'} className='h-min'>
                                <div className="flex items-center gap-2">
                                    <img src={yurtIcon} alt="Yurt" className="w-8 h-8" />
                                    <span>Yurts</span>
                                </div>
                            </Button>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div >

                <Separator className='w-full mb-4' orientation='horizontal' />

                {/* this is the skeleton (isLoading) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-lg" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-[140px]" />
                                <Skeleton className="h-4 w-[30px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[160px]" />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Listings;