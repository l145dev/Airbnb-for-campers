import { useState } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListingComponentProps {
    propId: number;
    propType: string;
    propName: string;
    imgSrc: string;
    city: string;
    country: string;
    avgRating: number;
    owner: string;
    price: number;
}

const ListingComponent: React.FC<ListingComponentProps> = ({
    propId,
    propType,
    propName,
    imgSrc,
    city,
    country,
    avgRating,
    owner,
    price
}) => {
    // state to manage hover -> if hover, show the city and country instead of the property name
    const [hover, setHover] = useState<boolean>(false);

    return (
        <>
            <Link to={`/property?property_id=${propId}`} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} className={`${hover ? 'bg-[var(--secondary)]' : ''} rounded-lg transition-all duration-200 ease-out p-4`}>
                <div className="space-y-3">
                    <img
                        src={imgSrc}
                        alt="airbnb camping property"
                        className="h-[200px] w-full rounded-lg object-cover bg-[var(--border)]"
                    />
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">
                                <span className={`${hover ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 ease-out absolute`}>{propName}</span>
                                <span className={`${hover ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 ease-out absolute`}>{`${city}, ${country}`}</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <Star fill='black' height={16} width={16} />
                                <span>{avgRating}</span>
                            </div>
                        </div>
                        <div className="text-gray-500">{owner}</div>
                        <div className="font-medium">
                            <span>${price}</span>
                            <span className='font-normal'> per night</span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default ListingComponent;