import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandItem } from "@/components/ui/command"
import { format } from "date-fns"
import { SearchIcon, MinusIcon, PlusIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export default function SearchBar() {
    const [fromDate, setFromDate] = useState<Date | undefined>()
    const [toDate, setToDate] = useState<Date | undefined>()
    const [location, setLocation] = useState("")
    const [guests, setGuests] = useState(1)

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 p-1 bg-white rounded-full shadow-sm border max-w-full">
            {/* Anywhere */}
            <Popover>
                <PopoverTrigger className="px-4 py-2 hover:bg-gray-100 rounded-full">
                    {location || "Anywhere"}
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <Command>
                        <CommandInput
                            placeholder="Search locations..."
                            value={location}
                            onValueChange={(value) => setLocation(value)}
                        />
                        <CommandItem onSelect={(value) => setLocation(value)}>
                            Brussels
                        </CommandItem>
                        <CommandItem onSelect={(value) => setLocation(value)}>
                            Antwerp
                        </CommandItem>
                        <CommandItem onSelect={(value) => setLocation(value)}>
                            Ghent
                        </CommandItem>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* From */}
            <Popover>
                <PopoverTrigger className="px-4 py-2 hover:bg-gray-100 rounded-full">
                    {fromDate ? format(fromDate, "PPP") : "From"}
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} />
                </PopoverContent>
            </Popover>

            {/* To */}
            <Popover>
                <PopoverTrigger className="px-4 py-2 hover:bg-gray-100 rounded-full">
                    {toDate ? format(toDate, "PPP") : "To"}
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} />
                </PopoverContent>
            </Popover>

            {/* Anyone */}
            <Popover>
                <PopoverTrigger className="px-4 py-2 hover:bg-gray-100 rounded-full">
                    {guests > 0 ? `${guests} Guest${guests > 1 ? "s" : ""}` : "Anyone"}
                </PopoverTrigger>
                <PopoverContent className="w-48">
                    <div className="flex items-center justify-between p-2">
                        <span>Guests</span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setGuests(Math.max(1, guests - 1))}>
                                <MinusIcon className="w-4 h-4" />
                            </Button>
                            <span>{guests}</span>
                            <Button variant="ghost" size="icon" onClick={() => setGuests(guests + 1)}>
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Search button */}
            <Button className="rounded-full bg-[#3D8B40] hover:bg-[#357A38]" size="icon">
                <SearchIcon className="w-5 h-5" />
            </Button>
        </div>
    )
}
