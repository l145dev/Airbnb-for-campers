interface Image {
    image_id: number;
    property_id: number;
    image_url: string;
    alt_text: string;
    is_main: boolean;
}

interface PropertyImageProps {
    images: Image[];
}

const PropertyImage: React.FC<PropertyImageProps> = ({ images }) => {
    const imageCount = images.length;

    let otherImages: Image[] = [];

    const mainImage = images.map((image) => {
        if (image.is_main) {
            return image;
        } else {
            otherImages.push(image);
        }
    });

    // render images conditionally
    const render = () => {
        switch (imageCount) {
            case 1:
                return (
                    <>
                        <div className='property-images grid max-h-[400px]'>
                            <div className="alt-property-image rounded-lg overflow-hidden">
                                <img src={mainImage[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className='property-images grid grid-cols-2 gap-4 max-h-[400px]'>
                            <div className="alt-property-image rounded-lg overflow-hidden max-h-[400px]">
                                <img src={mainImage[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                            </div>
                            <div className="alt-property-image rounded-lg overflow-hidden max-h-[400px]">
                                <img src={otherImages[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className='property-images grid grid-cols-2 gap-4 max-h-[400px]'>
                            <div className='main-property-image rounded-lg overflow-hidden'>
                                <img src={mainImage[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                            </div>

                            <div className='alt-property-images grid grid-rows-2 gap-4 max-h-[400px]'>
                                <div className='alt-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                    <img src={otherImages[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                </div>
                                <div className='alt-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                    <img src={otherImages[1]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className='property-images grid grid-cols-2 gap-4 max-h-[400px]'>
                            <div className='grid grid-rows-2 gap-4 max-h-[400px]'>
                                <div className="alt-property-image rounded-lg overflow-hidden max-h-[400px]">
                                    <img src={mainImage[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                </div>
                                <div className="alt-property-image rounded-lg overflow-hidden max-h-[400px]">
                                    <img src={otherImages[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className='grid grid-rows-2 gap-4 max-h-[400px]'>
                                <div className="alt-property-image rounded-lg overflow-hidden max-h-[400px]">
                                    <img src={otherImages[1]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                </div>
                                <div className="alt-property-image rounded-lg overflow-hidden max-h-[400px]">
                                    <img src={otherImages[2]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </>
                );
            default:
                return (
                    <>
                        <div className='property-images grid grid-cols-2 gap-4 max-h-[400px]'>
                            <div className='main-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                <img src={mainImage[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                            </div>

                            <div className='alt-property-images grid grid-cols-2 gap-4'>
                                <div className='alt-property-images-top grid grid-rows-2 gap-4'>
                                    <div className='alt-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                        <img src={otherImages[0]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                    </div>
                                    <div className='alt-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                        <img src={otherImages[1]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className='alt-property-images-bottom grid grid-rows-2 gap-4'>
                                    <div className='alt-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                        <img src={otherImages[2]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                    </div>
                                    <div className='alt-property-image rounded-lg overflow-hidden max-h-[400px]'>
                                        <img src={otherImages[3]?.image_url} alt="Property" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    }

    return (
        <>
            {render()}
        </>
    )
}

export default PropertyImage;