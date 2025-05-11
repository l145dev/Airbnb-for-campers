import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import axios from "axios";
import { toast, Toaster } from "sonner"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useQuery } from "@tanstack/react-query";

interface EmailCodeComponentProps {
    className?: string;
    onEmailInput: (email: string) => void;
}

interface EmailInterface {
    email: string;
}

const getEmail = async () => {
    const response = await axios.get('http://localhost:3000/resetpassword', {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });

    return response.data;
}

export function EmailCodeComponent({
    className,
    onEmailInput,
    ...props
}: EmailCodeComponentProps) {
    const [email, setEmail] = useState<string>("");

    const { data, isLoading } = useQuery<EmailInterface>({
        queryKey: ["email"],
        queryFn: getEmail,
        enabled: true,
    })

    // trigger on change of data
    useEffect(() => {
        if (data) {
            setEmail(data.email);
        }
    }, [data]);

    const sendCode = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/resetpassword/code",
                { email: email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                toast.success("Code has been sent!", {
                    description: new Date().toLocaleString(),
                });
                onEmailInput(email); // callback to ResetPassword.tsx
            }
            else if (response.status === 400) {
                toast.error("Email not found.", {
                    description: new Date().toLocaleString(),
                });
            }
            else {
                toast.error("Something went wrong", {
                    description: new Date().toLocaleString(),
                });
            }
        }
        catch (error: any) {
            console.error("Error sending code:", error);
            toast.error("Failed to send code. Please check your network connection.", {
                description: error.message,
            });
        }
    }

    return (
        <>
            {/* allow toasts to appear on page, with closing btn */}
            <Toaster closeButton />
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center">
                            {/* <Button variant="ghost" size="icon" className="absolute">
                                <ChevronLeft className="h-4 w-4" />
                            </Button> */}
                            <CardTitle className="flex-1 text-center">Reset password | Get code</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* inputs have disabled state when loading */}
                        <form onSubmit={(e) => { e.preventDefault(); sendCode(); }}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="emailforcode">Email</Label>
                                    <Input
                                        id="emailforcode"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        disabled={isLoading}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                {/* triggers sendCode() to send code to user's email */}
                                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                                    Get code
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div >
        </>
    )
}
