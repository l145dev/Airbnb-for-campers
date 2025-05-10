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
import { Label } from "../ui/label";
import { ChevronLeft } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

// continue here with designing back button in callback and core logic

export function EnterCodeComponent({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [code, setCode] = useState<number>(0);

    return (
        <>
            {/* allow toasts to appear on page, with closing btn */}
            <Toaster closeButton />
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <CardHeader className="pl-0 pr-0">
                            <div className="flex items-center relative">
                                <Button variant="ghost" size="icon" className="absolute left-[0px]">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <CardTitle className="flex-1 text-center">Reset password | Verify code</CardTitle>
                            </div>
                        </CardHeader>
                    </CardHeader>
                    <CardContent>
                        {/* save the changes that user may have made on submit */}
                        {/* inputs have disabled state when loading */}
                        <form onSubmit={(e) => { e.preventDefault(); }}>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-center">
                                    <InputOTP maxLength={6}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {/* triggers saveChanges() to update user details */}
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
