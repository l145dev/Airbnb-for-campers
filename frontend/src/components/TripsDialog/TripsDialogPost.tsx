import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// no need to get reviews, this is a blank slate

interface TripsDialogPostProps {
    property_name: string;
    property_id: number;
    onReviewPosted: () => void;
}

const TripsDialogPost: React.FC<TripsDialogPostProps> = ({ property_name, property_id, onReviewPosted }) => {
    const [comment, setComment] = useState<string>('');
    const [rating, setRating] = useState<number>(0);

    const submitReview = async () => {
        try {
            const response = await axios.post('https://airbnb-for-campers.onrender.com/trips/review', {
                property_id: property_id,
                comment,
                rating
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })

            if (response.status === 200) {
                toast.success("Review posted successfully!", {
                    description: new Date().toLocaleString(),
                });
                setComment('');
                setRating(0);
                onReviewPosted();
            }

            else {
                toast.error("Failed to post review. Please try again.", {
                    description: new Date().toLocaleString(),
                });
            }
        }

        catch (error) {
            toast.error("Failed to post review. Please try again.", {
                description: new Date().toLocaleString(),
            });
            console.error("Error posting review:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Review</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{property_name}</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-4 items-center" onSubmit={(e) => {
                    e.preventDefault();
                    submitReview();
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
                        <Button type="submit" variant="default" className="flex-1">
                            Post Review
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TripsDialogPost;