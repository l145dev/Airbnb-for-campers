import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

// must retrieve the review and then be able to modify it and delete it

interface TripsDialogPatchProps {
    property_name: string;
    property_id: number;
    onReviewUpdated: () => void;
}

interface Review {
    property_name: string;
    review_id: number;
    comment: string;
    rating: number;
}

interface ApiResponse {
    returnObj: Review;
}

const fetchReview = async (property_id: number): Promise<ApiResponse | null> => {
    try {
        const response = await axios.get(`https://airbnb-for-campers.onrender.com/trips/review?property_id=${property_id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        return response.data;
    }

    catch (error) {
        toast.error("Failed to fetch review. Please try again.", {
            description: new Date().toLocaleString(),
        });
        console.error("Error fetching review:", error);
        return null;
    }
}

const TripsDialogPatch: React.FC<TripsDialogPatchProps> = ({ property_name, property_id, onReviewUpdated }) => {
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [btnsDisabled, setBtnsDisabled] = useState<boolean>(false);

    useEffect(() => {
        const fetchAndSetReview = async () => {
            const review = await fetchReview(property_id);
            if (review) {
                setComment(review.returnObj.comment);
                setRating(review.returnObj.rating);
            }
        };

        fetchAndSetReview();
    }, [property_id]);

    const updateReview = async () => {
        // update review here
        // onReviewUpdated();
        try {
            const response = await axios.patch('https://airbnb-for-campers.onrender.com/trips/review', {
                property_id: property_id,
                comment,
                rating
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success("Review updated successfully!", {
                    description: new Date().toLocaleString(),
                });
                // setComment('');
                // setRating(0);
                onReviewUpdated();
            } else {
                toast.error("Failed to update review. Please try again.", {
                    description: new Date().toLocaleString(),
                });
            }
        }

        catch (error) {
            toast.error("Failed to update review. Please try again.", {
                description: new Date().toLocaleString(),
            });
            console.error("Error updating review:", error);
        }
    }

    const deleteReview = async () => {
        // delete review here
        try {
            const response = await axios.delete('https://airbnb-for-campers.onrender.com/trips/review', {
                data: {
                    property_id: property_id,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success("Review deleted successfully!", {
                    description: new Date().toLocaleString(),
                });
                setComment('');
                setRating(0);
                setBtnsDisabled(true);
                onReviewUpdated();
            } else {
                toast.error("Failed to delete review. Please try again.", {
                    description: new Date().toLocaleString(),
                });
            }
        }

        catch (error) {
            toast.error("Failed to delete review. Please try again.", {
                description: new Date().toLocaleString(),
            });
            console.error("Error deleting review:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Edit Review</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{property_name}</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-4 items-center" onSubmit={(e) => {
                    e.preventDefault();
                    updateReview();
                }}>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="comment">
                            Review
                        </Label>
                        <Textarea
                            id="comment"
                            className="h-[180px]"
                            placeholder="Write your review here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)} />
                    </div>

                    <div className="flex flex-row gap-2">
                        <Star fill={rating >= 1 ? "yellow" : "transparent"} onClick={() => setRating(1)} />
                        <Star fill={rating >= 2 ? "yellow" : "transparent"} onClick={() => setRating(2)} />
                        <Star fill={rating >= 3 ? "yellow" : "transparent"} onClick={() => setRating(3)} />
                        <Star fill={rating >= 4 ? "yellow" : "transparent"} onClick={() => setRating(4)} />
                        <Star fill={rating >= 5 ? "yellow" : "transparent"} onClick={() => setRating(5)} />
                    </div>

                    <div className="flex flex-row gap-4 w-full">
                        <Button type="button" variant="destructive" className="flex-1" onClick={deleteReview} disabled={btnsDisabled}>
                            Delete Review
                        </Button>

                        <Button type="submit" className="flex-1" variant="default" disabled={btnsDisabled}>
                            Update Review
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TripsDialogPatch;