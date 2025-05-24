import { Star } from "lucide-react";

interface Review {
    review_id: number;
    property_id: number;
    guest_id: number;
    reviewer_full_name: string;
    reviewer_url: string;
    rating: number;
    comment: string;
    review_date: string;
}

interface PropertyReviewsProps {
    reviews: Review[];
}

const PropertyReviews = ({ reviews }: PropertyReviewsProps) => {
    return (
        <>
            <div className='reviews flex flex-col gap-8'>
                <div className='reviews-grid grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2'>
                    {reviews.slice(0, 6).map((review, key) => (
                        <div className='review-card flex flex-col gap-2 justify-between' key={key}>
                            <div className="flex flex-col gap-2">
                                <div className='review-card-header flex flex-row items-center gap-2'>
                                    <div className='reviewer-image rounded-full overflow-hidden h-[48px] w-[48px]'>
                                        <img
                                            src={"https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/avatar//" + review.reviewer_url}
                                            alt="Reviewer"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className='reviewer-details'>
                                        <h3>{review.reviewer_full_name}</h3>
                                        <p className='text-sm text-gray-500'>
                                            {new Date(review.review_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className='review-card-body'>
                                    <p>{review.comment}</p>
                                </div>
                            </div>

                            <div className='review-card-footer flex flex-row items-center gap-2'>
                                {/* Assuming Star is defined or imported elsewhere */}
                                <div className="flex items-center gap-1">
                                    {[...Array(review.rating)].map((_, index) => (
                                        <Star key={index} width={16} height={16} fill="yellow" />
                                    ))}
                                    {[...Array(5 - review.rating)].map((_, index) => (
                                        <Star key={index} width={16} height={16} fill="none" />
                                    ))}
                                </div>
                                <span>{review.rating}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {reviews.length > 6 && (
                    <button className="mt-4">Show More Reviews</button>
                )}
            </div>
        </>
    )
}

export default PropertyReviews;