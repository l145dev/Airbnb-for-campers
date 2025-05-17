import './Home.css';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar/SearchBar';
import { Footer } from '@/components/Footer/Footer';
// icons
import cabinIcon from '../../assets/images/icons8-log-cabin-100.png';
import tentIcon from '../../assets/images/icons8-tent-100.png';
import rvIcon from '../../assets/images/icons8-rv-100.png';
import treehouseIcon from '../../assets/images/icons8-treehouse-100.png';
import glampIcon from '../../assets/images/icons8-large-glamp-100.png';
import uniqueIcon from '../../assets/images/icons8-unique-100.png';
import farmIcon from '../../assets/images/icons8-farm-100.png';
import yurtIcon from '../../assets/images/icons8-yurt-100.png';
// why and what airbnb section iimages
import whatIsAirbnb from '../../assets/images/whatisairbnb.jpg';
import whyAirbnb from '../../assets/images/whyairbnb.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div className='home'>
                <div className='home-background-container'>
                    {/* hero section */}
                    <div className='hero-section'>
                        <h1>
                            Explore Nature
                        </h1>
                        <div className='button-wrapper'>
                            <Button variant={"secondary"} asChild>
                                <Link to="/listings">
                                    Discover
                                </Link>
                            </Button>
                        </div>

                        <div className='search-container'>
                            <SearchBar />
                        </div>
                    </div>
                </div>

                <div className='proptypes-container'>
                    <div className='proptype cabin'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={cabinIcon} alt="cabin icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Cabins
                                </h2>

                                <p>
                                    Home Comfort & Nature
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype tent'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={tentIcon} alt="tent icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Tents
                                </h2>

                                <p>
                                    Authentic Camping
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype rv'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={rvIcon} alt="rv icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    RV
                                </h2>

                                <p>
                                    Camp Anywhere
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype treehouse'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={treehouseIcon} alt="treehouse icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Treehouses
                                </h2>

                                <p>
                                    Camping, in trees
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype glamp'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={glampIcon} alt="glamp icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Glamping
                                </h2>

                                <p>
                                    Luxury & Comfort
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype unique'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={uniqueIcon} alt="unique icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Unique stays
                                </h2>

                                <p>
                                    Keep it interesting
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype farm'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={farmIcon} alt="farm icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Farms
                                </h2>

                                <p>
                                    The Rural Experience
                                </p>
                            </div>
                        </Button>
                    </div>

                    <div className='proptype yurt'>
                        <Button className='proptype-btn flex-grow h-full w-full' variant={"ghost"}>
                            <div className='image-container'>
                                <img src={yurtIcon} alt="yurt icon" width={48} height={48} />
                            </div>

                            <div className='text-container'>
                                <h2>
                                    Yurts
                                </h2>

                                <p>
                                    Home Comfort & Nature
                                </p>
                            </div>
                        </Button>
                    </div>
                </div>

                <div className='content-container'>
                    <div className='inner-content-container'>
                        <div className='image-content-container'>
                            <img src={whatIsAirbnb} alt="What is Airbnb Camping" />
                        </div>

                        <div className='text-content-container'>
                            <h2>
                                What is Airbnb Camping
                            </h2>

                            <p>
                                Whether you are an experienced or inexperienced camper, you will find the right accomodation for your camping needs on Airbnb Camping. We offer a wide range of accomodation types ranging from tents to whole cabins.
                            </p>

                            <p>
                                You can choose a peaceful spot in nature, a family-friendly campsite, or a unique stay like a treehouse or yurt. All listings are verified, and you can filter by location, amenities, and price to find exactly what fits your style and budget.
                            </p>

                            <p>
                                Whether you're looking for a weekend getaway or a longer escape, Airbnb Camping makes it easy to book and enjoy the outdoors. With trusted hosts and real guest reviews, you’ll have all the info you need to plan your perfect camping experience.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='content-container-right'>
                    <div className='inner-content-container-right'>
                        <div className='text-content-container'>
                            <h2>
                                Why Airbnb Camping
                            </h2>

                            <p>
                                Airbnb Camping is made specifically for campers, so you don’t have to scroll through unrelated apartments or city stays. It’s focused 100 percent on outdoor experiences, making it quicker and easier to find the right type of camping stay for you, whether it’s a simple tent setup or a fully equipped cabin in nature.
                            </p>

                            <p>
                                Compared to regular Airbnb, you get filters and listings that actually matter for campers, like access to fire pits, hiking trails, pet-friendly spots, or remote off-grid stays. You’ll also find unique places you won’t see on normal Airbnb, like campervans, treehouses, or eco-lodges built for outdoor lovers.
                            </p>

                            <p>
                                Airbnb Camping brings together a community of hosts who understand what campers need. From gear tips to local outdoor spots, you get a more tailored experience. If you’re looking to disconnect from the city and connect with nature, this is where you start.
                            </p>
                        </div>

                        <div className='image-content-container-right'>
                            <img src={whyAirbnb} alt="Why Airbnb camping" />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Home;