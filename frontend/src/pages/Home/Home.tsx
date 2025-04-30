import './Home.css';
import homebackground from '../../assets/images/homebackground.jpg';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar/SearchBar';
// icons
import cabinIcon from '../../assets/images/icons8-log-cabin-100.png';
import tentIcon from '../../assets/images/icons8-tent-100.png';
import rvIcon from '../../assets/images/icons8-rv-100.png';
import treehouseIcon from '../../assets/images/icons8-treehouse-100.png';
import glampIcon from '../../assets/images/icons8-large-glamp-100.png';
import uniqueIcon from '../../assets/images/icons8-unique-100.png';
import farmIcon from '../../assets/images/icons8-farm-100.png';
import yurtIcon from '../../assets/images/icons8-yurt-100.png';


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
                            <Button variant={"secondary"}>
                                Discover
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

                </div>
            </div>
        </>
    )
}

export default Home;