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
import { useState } from "react"
import { ChevronDown, Loader2Icon, Plus, Upload, X } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { Input } from "../ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HostDashboardPostProps {
    onDataRefresh: () => void;
}

const HostDashboardPost: React.FC<HostDashboardPostProps> = ({ onDataRefresh }) => {
    // form payload
    const [property_name, setPropertyName] = useState<string>("")
    const [property_description, setPropertyDescription] = useState<string>("")
    const [images, setImages] = useState<(File | null)[]>([null, null, null, null, null]); // contains files to send to backend
    const [street_address, setStreetAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [postcode, setPostcode] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    const [property_type, setPropertyType] = useState<string>("");
    const [check_in_time_raw, setCheckinTime] = useState<string>("");
    const [check_out_time_raw, setCheckoutTime] = useState<string>("");
    const [price_per_night, setPricePerNight] = useState<number>(0);
    const [capacity, setCapacity] = useState<number>(0);
    const [amenities, setAmenities] = useState({
        parking_available: false,
        pet_friendly: false,
        has_campfire_pit: false,
        has_personal_restroom: false,
        has_shared_restroom: false,
        has_personal_shower: false,
        has_shared_shower: false,
        has_personal_kitchen: false,
        has_shared_kitchen: false,
        has_sockets: false,
        has_views: false,
        has_picnic_table: false,
        has_grill: false,
        has_safety_features: false,
        has_personal_dryer: false,
        has_shared_dryer: false,
        has_wifi: false,
        has_cell_service: false,
        has_swimming_lake: false,
        has_swimming_pool: false,
        has_hiking_trail: false,
        is_wheelchair_accessible: false,
        has_fishing: false
    });
    const [note_from_owner, setNoteFromOwner] = useState<string>("");
    const [rules, setRules] = useState<string>("");

    // for previews
    const [imagesPreview, setImagesPreview] = useState<(string | null)[]>([null, null, null, null, null]); // contains image urls as blobs for previews

    // listing is posting loading
    const [isPostingSave, setIsPostingSave] = useState<boolean>(false);
    const [isPostingPublish, setIsPostingPublish] = useState<boolean>(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            // update previews
            const newImagesPreview = [...imagesPreview];
            newImagesPreview[index] = URL.createObjectURL(file);
            setImagesPreview(newImagesPreview);

            // update files
            const newImages = [...images];
            newImages[index] = file;
            setImages(newImages);
        }
    };

    const removeImage = (index: number) => {
        // remove image from preview images
        const newImagesPreview = [...imagesPreview];
        newImagesPreview[index] = null;
        setImagesPreview(newImagesPreview);

        // remove image from file images
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);
    };

    const submitListing = async (is_active: boolean) => {
        // request being sent, loading state on
        is_active ? setIsPostingPublish(true) : setIsPostingSave(true);

        try {
            // ensure at least 1 image is there
            if (images.length > 0) {
                const formData = new FormData();

                formData.append("is_active", String(is_active));
                formData.append("property_name", property_name);
                formData.append("property_description", property_description);
                formData.append("street_address", street_address);
                formData.append("postcode", postcode);
                formData.append("city", city);
                formData.append("country", country);
                formData.append("property_type", property_type);
                formData.append("check_in_time_raw", check_in_time_raw.split(":")[0].toString());
                formData.append("check_out_time_raw", check_out_time_raw.split(":")[0].toString());
                formData.append("price_per_night", price_per_night.toString());
                formData.append("capacity", capacity.toString());
                formData.append("note_from_owner", note_from_owner);
                formData.append("rules", rules);

                // json string amenities object
                formData.append("amenities", JSON.stringify(amenities));

                // Append images (files)
                images.forEach((img) => {
                    if (img) {
                        formData.append("images", img);
                    }
                });

                const response = await axios.post("https://airbnb-for-campers.onrender.com/listings", formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true
                    });

                // response received, loading state off
                is_active ? setIsPostingPublish(false) : setIsPostingSave(false);

                if (response.status === 200) {
                    toast.success("Successfully posted listing.", {
                        description: new Date().toLocaleTimeString(),
                    });
                    // reset form
                    setPropertyName("");
                    setPropertyDescription("");
                    setImages([null, null, null, null, null]);
                    setImagesPreview([null, null, null, null, null]);
                    setStreetAddress("");
                    setCity("");
                    setPostcode("");
                    setCountry("");
                    setPropertyType("");
                    setCheckinTime("");
                    setCheckoutTime("");
                    setPricePerNight(0);
                    setCapacity(0);
                    setNoteFromOwner("");
                    setRules("");
                    setAmenities({
                        parking_available: false,
                        pet_friendly: false,
                        has_campfire_pit: false,
                        has_personal_restroom: false,
                        has_shared_restroom: false,
                        has_personal_shower: false,
                        has_shared_shower: false,
                        has_personal_kitchen: false,
                        has_shared_kitchen: false,
                        has_sockets: false,
                        has_views: false,
                        has_picnic_table: false,
                        has_grill: false,
                        has_safety_features: false,
                        has_personal_dryer: false,
                        has_shared_dryer: false,
                        has_wifi: false,
                        has_cell_service: false,
                        has_swimming_lake: false,
                        has_swimming_pool: false,
                        has_hiking_trail: false,
                        is_wheelchair_accessible: false,
                        has_fishing: false
                    });

                    // invalidate query (reload data)
                    onDataRefresh();
                }
                else if (response.data && response.data.error) {
                    toast.error(response.data.error, { // Display the specific error message
                        description: new Date().toLocaleTimeString(),
                    });
                }
                else {
                    toast.error("Failed to post listings. Please refresh page to try again.", {
                        description: new Date().toLocaleTimeString(),
                    });
                }
            }

            else {
                // response received, loading state off
                is_active ? setIsPostingPublish(false) : setIsPostingSave(false);

                toast.error("Please provide at least one image for the property.", {
                    description: new Date().toLocaleTimeString(),
                });
            }
        }
        catch (error) {
            // response received, loading state off
            is_active ? setIsPostingPublish(false) : setIsPostingSave(false);

            let errorMessage = "Failed to post listings. Please refresh page to try again.";

            // Check if the error is an AxiosError and has a response with data and an error message
            if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            toast.error(errorMessage, {
                description: new Date().toLocaleTimeString(),
            });
            console.error("Error posting listings:", error);
            throw error;
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"default"}>
                        <Plus />
                        <span>Create listing</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto scrollbar-hide">
                    {/* header */}
                    <DialogHeader>
                        <DialogTitle>Create new listing</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-4 mt-2" onSubmit={(e) => {
                        e.preventDefault();
                        submitListing(true);
                    }}>
                        <div className="general-info flex flex-col gap-4">
                            <h3 className="text-xl font-semibold">
                                General Information
                            </h3>

                            <div className="space-y-3">
                                <Label htmlFor="property_name">Property Name</Label>
                                <Input
                                    id="property_name"
                                    placeholder="Cozy Cabin"
                                    required
                                    value={property_name}
                                    onChange={(e) => setPropertyName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="property_description">Property Description</Label>
                                <Textarea
                                    id="property_description"
                                    placeholder="A cozy cabin with a view of the ocean"
                                    required
                                    value={property_description}
                                    onChange={(e) => setPropertyDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Property Images</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Main image */}
                                    <div
                                        className="aspect-square rounded-lg border border-gray-300 hover:border-gray-400 cursor-pointer relative"
                                        onClick={() => document.getElementById('upload-0')?.click()}
                                    >
                                        <input
                                            type="file"
                                            id="upload-0"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, 0)}
                                        />
                                        {imagesPreview[0] ? (
                                            <>
                                                <img src={imagesPreview[0]} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-white/70 rounded-full p-1 hover:bg-white z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(0);
                                                    }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>


                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                                <div className="flex flex-row gap-2">
                                                    <Upload />
                                                    <span>Upload<span className="text-red-500"> *</span></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* 4 smaller images */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="aspect-square rounded-lg border border-gray-300 hover:border-gray-400 cursor-pointer relative"
                                                onClick={() => document.getElementById(`upload-${i}`)?.click()}
                                            >
                                                <input
                                                    type="file"
                                                    id={`upload-${i}`}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, i)}
                                                />
                                                {imagesPreview[i] ? (
                                                    <>
                                                        <img src={imagesPreview[i]!} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 bg-white/70 rounded-full p-1 hover:bg-white z-10"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage(i);
                                                            }}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>

                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-center">
                                                        <div className="flex flex-row gap-2 scale-80">
                                                            <Upload />
                                                            <span>Upload</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="location-details flex flex-col gap-4">
                            <h3 className="text-xl font-semibold">
                                Location Details
                            </h3>

                            <div className="space-y-3">
                                <Label htmlFor="street_address">Street Address</Label>
                                <Input
                                    id="street_address"
                                    placeholder="123 Main St"
                                    required
                                    value={street_address}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-3">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="New York City"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)} />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="postcode">Postcode</Label>
                                        <Input
                                            id="postcode"
                                            placeholder="1000"
                                            required
                                            value={postcode}
                                            onChange={(e) => setPostcode(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    placeholder="United States"
                                    required
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="property-details flex flex-col gap-4">
                            <h3 className="text-xl font-semibold">
                                Property Details
                            </h3>

                            <div className="space-y-3 w-full">
                                <Label>Property Type</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full">
                                        <div className="flex w-full flex-row justify-between items-center border rounded-md py-1.5 px-3">
                                            <span className="text-sm md:text-sm text-black">{property_type ? property_type : "Select property type"}</span>
                                            <ChevronDown strokeWidth={1} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setPropertyType("Cabin")}>
                                            Cabin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Tent")}>
                                            Tent
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("RV")}>
                                            RV
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Treehouse")}>
                                            Treehouse
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Glamp")}>
                                            Glamp
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Farm")}>
                                            Farm
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Yurt")}>
                                            Yurt
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Unique")}>
                                            Unique
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPropertyType("Other")}>
                                            Other
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3 w-full">
                                <Label>Check-in</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full">
                                        <div className="flex w-full flex-row justify-between items-center border rounded-md py-1.5 px-3">
                                            <span className="text-sm md:text-sm text-black">
                                                {check_in_time_raw ? check_in_time_raw : "Select check-in time"}
                                            </span>
                                            <ChevronDown strokeWidth={1} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="max-h-[250px] overflow-y-auto">
                                        {[...Array(24)].map((_, i) => {
                                            const time = i.toString().padStart(2, "0") + ":00";
                                            return (
                                                <DropdownMenuItem key={time} onClick={() => setCheckinTime(time)}>
                                                    {time}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3 w-full">
                                <Label>Check-out</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full">
                                        <div className="flex w-full flex-row justify-between items-center border rounded-md py-1.5 px-3">
                                            <span className="text-sm md:text-sm text-black">
                                                {check_out_time_raw ? check_out_time_raw : "Select check-out time"}
                                            </span>
                                            <ChevronDown strokeWidth={1} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="max-h-[250px] overflow-y-auto">
                                        {[...Array(24)].map((_, i) => {
                                            const time = i.toString().padStart(2, "0") + ":00";
                                            return (
                                                <DropdownMenuItem key={time} onClick={() => setCheckoutTime(time)}>
                                                    {time}
                                                </DropdownMenuItem>
                                            );
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="price-per-night">
                                    Price per night ($)
                                </Label>
                                <Input
                                    id="price-per-night"
                                    type="number"
                                    placeholder="100"
                                    required
                                    value={price_per_night}
                                    onChange={(e) => setPricePerNight(parseInt(e.target.value))}
                                    min={0}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="capacity">Capacity (Guest Limit)</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    placeholder="2"
                                    required
                                    value={capacity}
                                    onChange={(e) => setCapacity(parseInt(e.target.value))}
                                    min={0}
                                />
                            </div>
                        </div>

                        <div className="amenities-and-features flex flex-col gap-4">
                            <h3 className="text-xl font-semibold">
                                Amenities & Features
                            </h3>

                            <div className="flex flex-wrap gap-4">
                                {Object.entries(amenities).map(([key, value]) => (
                                    <div
                                        key={key}
                                        onClick={() =>
                                            setAmenities((prev: any) => ({ ...prev, [key]: !prev[key] }))
                                        }
                                        className={`text-sm rounded-md px-3 py-1.5 cursor-pointer select-none border ${value ? 'bg-gray-200 border-gray-600' : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="additional-details flex flex-col gap-4">
                            <h3 className="text-xl font-semibold">
                                Additional Details
                            </h3>

                            <div className="space-y-3">
                                <Label htmlFor="rules">Rules</Label>
                                <Textarea
                                    id="rules"
                                    placeholder="No smoking, pets allowed"
                                    value={rules}
                                    onChange={(e) => setRules(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="note_from_owner">Note from owner</Label>
                                <Textarea
                                    id="note_from_owner"
                                    placeholder="Turn on the fireplace, bring a blanket, etc."
                                    value={note_from_owner}
                                    onChange={(e) => setNoteFromOwner(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* controls */}
                        <div className="controls w-full flex flex-row justify-between mt-2">
                            {isPostingSave ? (
                                <>
                                    <Button variant="outline" type="button" onClick={() => submitListing(false)} disabled>
                                        <Loader2Icon className="animate-spin" />
                                        Saving...
                                    </Button>
                                    <Button variant={"default"} type="submit" disabled>Publish</Button>
                                </>
                            ) : isPostingPublish ? (
                                <>
                                    <Button variant="outline" type="button" onClick={() => submitListing(false)} disabled>Save for later</Button>
                                    <Button variant={"default"} type="submit" disabled>
                                        <Loader2Icon className="animate-spin" />
                                        Publishing...
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" type="button" onClick={() => { submitListing(false); }}>Save for later</Button>
                                    <Button variant={"default"} type="submit">Publish</Button>
                                </>
                            )}
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HostDashboardPost;