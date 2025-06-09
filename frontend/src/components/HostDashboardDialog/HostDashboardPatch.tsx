import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

const HostDashboardPatch: React.FC = () => {
    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <Button>Open</Button>
                </DialogTrigger>
                <DialogContent>
                    {/* header */}
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                    </DialogHeader>

                    {/* content */}
                    <Textarea />

                    {/* controls */}
                    <DialogFooter>
                        <Button variant="outline">Save for later</Button>
                        <Button variant={"default"}>Publish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HostDashboardPatch;