import { Bubbles, Key, MapPinned, MessageSquare, Tag, Target } from "lucide-react";
import { Progress } from "../ui/progress";
import { useState } from "react";

const PropertyReviewsOverview = () => {
    // progress bar states
    const [progressFive, setProgressFive] = useState<number>(75); // replace with 5 star value
    const [progressFour, setProgressFour] = useState<number>(10); // replace with 4 star value
    const [progressThree, setProgressThree] = useState<number>(5); // replace with 3 star value
    const [progressTwo, setProgressTwo] = useState<number>(0); // replace with 2 star value
    const [progressOne, setProgressOne] = useState<number>(10); // replace with 1 star value

    return (
        <>
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
        </>
    );
};

export default PropertyReviewsOverview;