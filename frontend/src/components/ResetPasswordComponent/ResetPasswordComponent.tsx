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

export function ResetPasswordComponent({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [pwd, setPwd] = useState<string>("");
    const [repeatPwd, setRepeatPwd] = useState<string>("");

    return (
        <>
            {/* allow toasts to appear on page, with closing btn */}
            <Toaster closeButton />
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="absolute">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle className="flex-1 text-center">Reset password | Set password</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* save the changes that user may have made on submit */}
                        {/* inputs have disabled state when loading */}
                        <form onSubmit={(e) => { e.preventDefault(); }}>
                            <div className="flex flex-col gap-6">
                                <Input
                                    placeholder="Have a problem? Have feedback? Or simply bored? Tell us anything! ...but maybe not if you're just bored"
                                    required
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)} />
                                <Input
                                    placeholder="Have a problem? Have feedback? Or simply bored? Tell us anything! ...but maybe not if you're just bored"
                                    required
                                    value={repeatPwd}
                                    onChange={(e) => setRepeatPwd(e.target.value)} />

                                {/* triggers saveChanges() to update user details */}
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
