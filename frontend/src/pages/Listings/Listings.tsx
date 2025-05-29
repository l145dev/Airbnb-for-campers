import './Listings.css';
// components
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import SkeletonComponent from '@/components/ListingsComponents/SkeletonComponent';
import ListingComponent from '@/components/ListingsComponents/ListingComponent';
// icons
import cabinIcon from '../../assets/images/icons8-log-cabin-100.png';
import tentIcon from '../../assets/images/icons8-tent-100.png';
import rvIcon from '../../assets/images/icons8-rv-100.png';
import treehouseIcon from '../../assets/images/icons8-treehouse-100.png';
import glampIcon from '../../assets/images/icons8-large-glamp-100.png';
import uniqueIcon from '../../assets/images/icons8-unique-100.png';
import farmIcon from '../../assets/images/icons8-farm-100.png';
import yurtIcon from '../../assets/images/icons8-yurt-100.png';
import { Heart, Map } from 'lucide-react';
// lib imports
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import axios from 'axios';

// object i will receive from backend
interface Listing {
    property_id: number;
    property_type: string;
    property_name: string;
    property_image: string;
    city: string;
    country: string;
    average_rating: number;
    owner: string;
    price_per_night: number;
}

// search params from the url
interface SearchParams {
    checkin?: string;
    checkout?: string;
    city?: string;
    country?: string; // for the future
    guests?: string;
    propType?: string;
    saved?: boolean;
}

const fetchListings = async (params: SearchParams): Promise<Listing[] | string> => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value) {
            queryParams.append(key, value);
        }
    }
    const queryString = queryParams.toString();

    const response = await axios.get(`http://localhost:3000/listings?${queryString}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
};

const Listings = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // params handling
    const queryParams: SearchParams = Object.fromEntries(searchParams.entries());

    // active toggle for all prop filters -> not very clean, i know
    const [currentActive, setCurrentActive] = useState<string | undefined>(queryParams.propType);

    const [cabinActive, setCabinActive] = useState<boolean>(false);
    const [tentActive, setTentActive] = useState<boolean>(false);
    const [rvActive, setRvActive] = useState<boolean>(false);
    const [treehouseActive, setTreehouseActive] = useState<boolean>(false);
    const [glampActive, setGlampActive] = useState<boolean>(false);
    const [uniqueActive, setUniqueActive] = useState<boolean>(false);
    const [farmActive, setFarmActive] = useState<boolean>(false);
    const [yurtActive, setYurtActive] = useState<boolean>(false);

    const [savedActive, setSavedActive] = useState<boolean | undefined>(queryParams.saved);
    const [mapActive, setMapActive] = useState<boolean>(false);

    // uhmmmm, ignore this
    useEffect(() => {
        if (currentActive === "cabins") {
            setCabinActive(true);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(false);
        }

        else if (currentActive === "tents") {
            setCabinActive(false);
            setTentActive(true);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(false);
        }

        else if (currentActive === "rv") {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(true);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(false);
        }
        else if (currentActive === "treehouses") {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(true);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(false);
        }
        else if (currentActive === "glamping") {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(true);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(false);
        }
        else if (currentActive === "unique") {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(true);
            setFarmActive(false);
            setYurtActive(false);
        }
        else if (currentActive === "farms") {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(true);
            setYurtActive(false);
        }
        else if (currentActive === "yurts") {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(true);
        }

        else {
            setCabinActive(false);
            setTentActive(false);
            setRvActive(false);
            setTreehouseActive(false);
            setGlampActive(false);
            setUniqueActive(false);
            setFarmActive(false);
            setYurtActive(false);
        }
    }, [currentActive])

    // fetching from react query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['listings', queryParams],
        queryFn: () => fetchListings(queryParams),
    });

    useEffect(() => {
        // direct dom manipulation in react = bad -> but im too lazy to try anything else
        if (isLoading) {
            document.body.classList.add('hide-all-scrollbars-loading');
        } else {
            document.body.classList.remove('hide-all-scrollbars-loading');
        }
    }, [isLoading]);

    // update query after adding proptype
    const addPropTypeParam = (propType: string) => {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set('propType', propType);
        navigate(`?${updatedParams.toString()}`);
    }

    // update query after removing proptyppe
    const removePropTypeParam = () => {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.delete('propType');
        navigate(`?${updatedParams.toString()}`);
    }

    const addSavedParam = () => {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.set('saved', 'true');
        navigate(`?${updatedParams.toString()}`);
    }

    const removeSavedParam = () => {
        const updatedParams = new URLSearchParams(searchParams);
        updatedParams.delete('saved');
        navigate(`?${updatedParams.toString()}`);
    }

    return (
        <>
            <div className='listings'>
                <div className='proptype-container w-full flex flex-row justify-between'>
                    <ScrollArea className="whitespace-nowrap">
                        <div className="flex w-full space-x-2 pb-4">
                            {/* i regret choosing to take the easy way out and not making a seperate component for this now */}
                            <Button variant={`${cabinActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!cabinActive) {
                                    addPropTypeParam("cabins");
                                    setCurrentActive("cabins");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={cabinIcon} alt="Cabin" className="w-6 h-6" />
                                    <span className='text-base'>Cabins</span>
                                </div>
                            </Button>
                            <Button variant={`${tentActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!tentActive) {
                                    addPropTypeParam("tents");
                                    setCurrentActive("tents");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={tentIcon} alt="Tent" className="w-6 h-6" />
                                    <span className='text-base'>Tents</span>
                                </div>
                            </Button>
                            <Button variant={`${rvActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!rvActive) {
                                    addPropTypeParam("rv");
                                    setCurrentActive("rv");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={rvIcon} alt="RV" className="w-6 h-6" />
                                    <span className='text-base'>RV</span>
                                </div>
                            </Button>
                            <Button variant={`${treehouseActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!treehouseActive) {
                                    addPropTypeParam("treehouses");
                                    setCurrentActive("treehouses");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={treehouseIcon} alt="Treehouse" className="w-6 h-6" />
                                    <span className='text-base'>Treehouses</span>
                                </div>
                            </Button>
                            <Button variant={`${glampActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!glampActive) {
                                    addPropTypeParam("glamping");
                                    setCurrentActive("glamping");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={glampIcon} alt="Glamping" className="w-6 h-6" />
                                    <span className='text-base'>Glamping</span>
                                </div>
                            </Button>
                            <Button variant={`${uniqueActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!uniqueActive) {
                                    addPropTypeParam("unique");
                                    setCurrentActive("unique");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={uniqueIcon} alt="Unique" className="w-6 h-6" />
                                    <span className='text-base'>Unique Stays</span>
                                </div>
                            </Button>
                            <Button variant={`${farmActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!farmActive) {
                                    addPropTypeParam("farms");
                                    setCurrentActive("farms");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={farmIcon} alt="Farm" className="w-6 h-6" />
                                    <span className='text-base'>Farms</span>
                                </div>
                            </Button>
                            <Button variant={`${yurtActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                                if (!yurtActive) {
                                    addPropTypeParam("yurts");
                                    setCurrentActive("yurts");
                                }

                                else {
                                    removePropTypeParam();
                                    setCurrentActive("");
                                }
                            }}>
                                <div className="flex items-center gap-2">
                                    <img src={yurtIcon} alt="Yurt" className="w-6 h-6" />
                                    <span className='text-base'>Yurts</span>
                                </div>
                            </Button>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <div className='flex flex-row space-x-2'>
                        <Button variant={`${savedActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => {
                            if (!savedActive) {
                                setSavedActive(true);
                                addSavedParam();
                            }

                            else {
                                setSavedActive(false);
                                removeSavedParam();
                            }
                        }}>
                            <div className="flex items-center gap-2">
                                <Heart className='min-w-6 min-h-6' strokeWidth={1} />
                                <span className='text-base'>Saved</span>
                            </div>
                        </Button>

                        <Button variant={`${mapActive ? "secondary" : "ghost"}`} className='h-min' onClick={() => setMapActive(!mapActive)}>
                            <div className="flex items-center gap-2">
                                <Map className='min-w-6 min-h-6' strokeWidth={1} />
                                <span className='text-base'>Map</span>
                            </div>
                        </Button>
                    </div>
                </div >

                <Separator className='w-full mb-4' orientation='horizontal' />

                {/* this is the skeleton (isLoading) */}
                {isLoading && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                            {[...Array(15)].map((_, index) => (
                                <SkeletonComponent key={index} />
                            ))}
                        </div>
                    </>
                )}

                {isError && (
                    <>
                        <div className='h-full w-full flex justify-center items-center flex-col gap-3'>
                            <h1>
                                Oops! An unexpected error occured!
                            </h1>
                            <h2>
                                {error.message}
                            </h2>
                        </div>
                    </>
                )}

                {Array.isArray(data) && (
                    <>
                        {/* actual data goes here */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                            {data.map((listing: Listing) => (
                                <ListingComponent
                                    key={listing.property_id}
                                    propId={listing.property_id}
                                    propName={listing.property_name}
                                    avgRating={listing.average_rating}
                                    city={listing.city}
                                    country={listing.country}
                                    imgSrc={listing.property_image}
                                    owner={listing.owner}
                                    price={listing.price_per_night}
                                    propType={listing.property_type}
                                />
                            ))}
                        </div>
                    </>
                )}

                {data && data.length < 0 && (
                    <>
                        <div className='h-full w-full flex justify-center align-center'>
                            <h1>
                                No listings found! Try modifying your plans a little!
                            </h1>
                        </div>
                    </>
                )}
            </div >
        </>
    )
}

export default Listings;