import { Star } from "lucide-react";

const PropertyReviews = () => {
    return (
        <>
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
        </>
    )
}

export default PropertyReviews;