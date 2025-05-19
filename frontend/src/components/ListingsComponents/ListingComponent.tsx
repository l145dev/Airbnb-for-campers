import starIcon from '../../assets/images/icons8-star-filled-100.png';
import { Link } from 'react-router-dom';

interface ListingComponentProps {
    propId: number;
    propType: string;
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
    imgSrc,
    city,
    country,
    avgRating,
    owner,
    price
}) => {
    return (
        <>
            <Link to={`/property?property_id=${propId}`}>
                <div className="space-y-3">
                    <img
                        src={`https://zbvrvsunueqynzhgmmdt.supabase.co/storage/v1/object/public/propertyimages//${imgSrc}`}
                        alt="airbnb camping property"
                        className="h-[200px] w-full rounded-lg object-cover bg-[var(--border)]"
                    />
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">{city}, {country}</span>
                            <div className="flex items-center gap-1">
                                <img src={starIcon} alt="star icon" height={16} width={16} />
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