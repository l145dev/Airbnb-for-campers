import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react';
import greenLogo from '../../assets/images/airbnbcampinglogoFull_green.png';
import whiteLogo from '../../assets/images/airbnbcampinglogoFull_white.png';
import { Menu, Globe } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar.tsx';

const Navbar = () => {
    // logged in state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    // location (query)
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    // scroll control
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`nav ${scrolled ? 'scrolled-nav' : ''}`}>
            {/* logo */}
            <Link to={"/"} className='to-airbnbcamping'>
                {/* white logo when on home (contrast) */}
                {isHomePage && !scrolled ? (
                    <img src={whiteLogo} alt="Airbnb Camping Logo" />
                ) : (
                    <img src={greenLogo} alt="Airbnb Camping Logo" />
                )}
            </Link>

            {/* searchbar */}
            {isHomePage ? (
                <>
                </>
            ) : (
                <>
                    <div className='search-container'>
                        <SearchBar />
                    </div>
                </>
            )}

            <div className='right-controls'>
                {/* dropdown menu for not logged in */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                        {isHomePage && !scrolled ? (
                            <>
                                <Globe size={16} color='white' />
                            </>
                        ) : (
                            <>
                                <Globe size={16} />
                            </>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Dutch
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            French 🤮
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            German
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* pages navigation */}
                {isLoggedIn ? (
                    <>
                        {/* dropdown menu for logged in */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"}>
                                    <Menu />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem asChild>
                                    <Link to={"/trips"}>
                                        Trips
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/saved"}>
                                        Saved
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={"/host-dashboard"}>
                                        Manage Listings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/host"}>
                                        Host
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/settings"}>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={"/support"}>
                                        Support
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        {/* dropdown menu for not logged in */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"}>
                                    <Menu />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem asChild>
                                    <Link to={"/login"}>
                                        Login
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/register"}>
                                        Register
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to={"/host"}>
                                        Host
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={"/support"}>
                                        Support
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar