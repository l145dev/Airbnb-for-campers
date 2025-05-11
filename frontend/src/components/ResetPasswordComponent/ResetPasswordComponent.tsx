import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import axios from "axios";
import { Toaster, toast } from "sonner"
import { Input } from "../ui/input";
import { ChevronLeft } from "lucide-react";
import { Label } from "../ui/label";

interface ResetPasswordComponentProps {
    className?: string;
    onResetPassword: () => void;
    onStepBack: () => void;
}

export function ResetPasswordComponent({
    className,
    onResetPassword,
    onStepBack,
    ...props
}: ResetPasswordComponentProps) {
    const [pwd, setPwd] = useState<string>("");
    const [repeatPwd, setRepeatPwd] = useState<string>("");
    const [pwdError, setPwdError] = useState<boolean>(false);

    const confirmPwd = async () => {
        // check if passwords match
        if (pwd !== repeatPwd) {
            setPwdError(true);
            return;
        }

        try {
            const response = await axios.patch("http://localhost:3000/resetpassword/change", {
                pwd: pwd
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })

            if (response.status === 200) {
                onResetPassword();
            }

            else if (response.status === 400) {
                toast.error(response.data.error, {
                    description: new Date().toLocaleString(),
                })
            }

            else {
                toast.error("Something went wrong", {
                    description: new Date().toLocaleString(),
                })
            }
        }

        catch (error) {
            toast.error("An unexpected error occurred", {
                description: new Date().toLocaleString(),
            })
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
                            <Button variant="ghost" size="icon" className="absolute" onClick={onStepBack}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle className="flex-1 text-center">Reset password | Set password</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* send new password to backend to update */}
                        <form onSubmit={(e) => { e.preventDefault(); confirmPwd(); }}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="pwd">Password</Label>
                                    <Input
                                        className={`${pwdError ? "border-red-500" : ""}`}
                                        id="pwd"
                                        type="password"
                                        placeholder="New password"
                                        required
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        onClick={() => setPwdError(false)}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="repeatPwd">Repeat password</Label>
                                    <Input
                                        className={`${pwdError ? "border-red-500" : ""}`}
                                        id="repeatPwd"
                                        type="password"
                                        placeholder="Repeat new password"
                                        required
                                        value={repeatPwd}
                                        onChange={(e) => setRepeatPwd(e.target.value)}
                                        onClick={() => setPwdError(false)}
                                    />
                                </div>

                                {/* triggers confirmPwd() to finally change user's password */}
                                <Button type="submit" className="w-full bg-[#3D8B40] hover:bg-[#357A38]">
                                    Reset password
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div >
        </>
    )
}
