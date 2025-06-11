import { Pencil } from "lucide-react";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axios from "axios";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";

interface BookStep1Props {
    property_id: string;
    checkin: string;
    checkout: string;
    guests: number;
}

const BookStep1: React.FC<BookStep1Props> = ({ property_id, checkin, checkout, guests }) => {
    const navigate = useNavigate();
    const [datePencilHover, setDatePencilHover] = useState(false);
    const [guestPencilHover, setGuestPencilHover] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('pay-now');
    const [authenticated, setAuthenticated] = useState(false);

    // on mount, check if user is logged in
    useEffect(() => {
        const getAuthenticated = async () => {
            try {
                const response = await axios.get('https://airbnb-for-campers.onrender.com/auth/session', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    withCredentials: true,
                });
                if (response.status === 200) {
                    setAuthenticated(true);
                }

                else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error(error);
                setAuthenticated(false);
            }
        }
        getAuthenticated();
    }, []);

    const editProperty = () => {
        navigate(`/property?property_id=${property_id}&checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
    }

    const formatDate = (date: string) => {
        const [year, month, day] = date.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    const stripePayment = async () => {
        try {
            const response = await axios.post('https://airbnb-for-campers.onrender.com/booking/pay', {
                property_id,
                checkin,
                checkout,
                guests,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                // Navigate directly to Stripe URL
                window.location.href = response.data.url;
            }

            else {
                toast.error('Something went wrong.', {
                    description: new Date().toLocaleString(),
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong.', {
                description: new Date().toLocaleString(),
            });
        }
    }

    const stripePaymentKlarna = async () => {
        try {
            const response = await axios.post('https://airbnb-for-campers.onrender.com/booking/pay/klarna', {
                property_id,
                checkin,
                checkout,
                guests,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                // Navigate directly to Stripe URL
                window.location.href = response.data.url;
            }

            else {
                toast.error('Something went wrong.', {
                    description: new Date().toLocaleString(),
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong.', {
                description: new Date().toLocaleString(),
            });
        }
    }

    return (
        <>
            <Toaster closeButton />
            <div className='your-trip flex flex-col gap-4'>
                <h2>Your trip</h2>
                <div className='your-trip-details flex flex-col gap-4'>
                    <div className='your-trip-dates flex flex-col gap-2'>
                        <h3 className='font-medium'>Dates</h3>
                        <div
                            className={`flex flex-row gap-2 items-center ${datePencilHover ? 'cursor-pointer text-black' : 'text-gray-500'}`}
                            onMouseEnter={() => setDatePencilHover(true)}
                            onMouseLeave={() => setDatePencilHover(false)}
                            onClick={editProperty}>
                            <span>{formatDate(checkin).toLocaleDateString()} - {formatDate(checkout).toLocaleDateString()}</span>
                            <Pencil height={16} width={16} />
                        </div>
                    </div>

                    <div className='your-trip-guests flex flex-col gap-2'>
                        <h3 className='font-medium'>Guests</h3>
                        <div className={`flex flex-row gap-2 items-center ${guestPencilHover ? 'cursor-pointer text-black' : 'text-gray-500'}`}
                            onMouseEnter={() => setGuestPencilHover(true)}
                            onMouseLeave={() => setGuestPencilHover(false)}
                            onClick={editProperty}>
                            <span>{guests} guests</span>
                            <Pencil height={16} width={16} />
                        </div>
                    </div>
                </div>
            </div>

            <Separator orientation='horizontal' className='my-4' />

            <div className='payment-method flex flex-col gap-4'>
                <h2>Payment method</h2>
                <div className='payment-method-details flex flex-col gap-2'>
                    <RadioGroup defaultValue="pay-now" className="w-full">
                        <div className="flex flex-col gap-2 w-full">
                            <div className={`flex items-center space-x-2 py-4 px-2 rounded-md border-1 ${paymentMethod === 'pay-now' ? 'border-black' : 'border'}`}>
                                <RadioGroupItem value="pay-now" id="pay-now" className={`w-6 h-6 ${paymentMethod === 'pay-now' ? 'border-black' : 'border'}`} onClick={() => setPaymentMethod('pay-now')} />
                                <Label htmlFor="pay-now" className="flex-1 cursor-pointer">
                                    <div className="font-medium">Pay now</div>
                                </Label>
                            </div>

                            <div className={`flex items-center space-x-2 py-4 px-2 rounded-md border-1 ${paymentMethod === 'pay-later' ? 'border-black' : 'border'}`}>
                                <RadioGroupItem value="pay-later" id="pay-later" className={`w-6 h-6 ${paymentMethod === 'pay-later' ? 'border-black' : 'border'}`} onClick={() => setPaymentMethod('pay-later')} />
                                <Label htmlFor="pay-later" className="flex-1 cursor-pointer">
                                    <div className="font-medium">Pay over time with Klarna</div>
                                </Label>
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <Separator orientation='horizontal' className='my-4' />

            {authenticated ? (
                // authenticated
                <div className='payment-method flex flex-col gap-4'>
                    {paymentMethod === 'pay-now' ? (
                        <Button variant='default' onClick={stripePayment}>
                            Pay now
                        </Button>
                    ) : (
                        <Button variant='default' onClick={stripePaymentKlarna}>
                            Pay over time with Klarna
                        </Button>
                    )}
                </div>
            ) : (
                // not authenticated
                <div className='log-in-options grid grid-cols-2 gap-4'>
                    <Button variant='outline' asChild>
                        <Link to='/register'>
                            Register
                        </Link>
                    </Button>
                    <Button variant='default' asChild>
                        <Link to='/login'>
                            Login
                        </Link>
                    </Button>
                </div>
            )}
        </>
    )
}

export default BookStep1;