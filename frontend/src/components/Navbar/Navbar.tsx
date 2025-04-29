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
import { useState } from 'react';
import greenLogo from '../../assets/images/airbnbcampinglogoFull_green.png';
import whiteLogo from '../../assets/images/airbnbcampinglogoFull_white.png';
import { Menu, Globe } from 'lucide-react';

const Navbar = () => {
    // logged in state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    // ham menu toggle
    const [isActive, setIsActive] = useState(false);

    const toggleNav = () => {
        setIsActive(!isActive);
    };

    // location (query)
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    return (
        <nav className='nav'>
            {/* logo */}
            <Link to={"/"} className='to-airbnbcamping'>
                {/* white logo when on home (contrast) */}
                {isHomePage ? (
                    <img src={greenLogo} alt="Airbnb Camping Logo" />
                ) : (
                    <img src={greenLogo} alt="Airbnb Camping Logo" />
                )}
            </Link>

            {/* searchbar */}

            <div className='right-controls'>
                {/* dropdown menu for not logged in */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Globe size={16} />
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
                        <DropdownMenu>
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
                                <DropdownMenuItem asChild>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        {/* dropdown menu for not logged in */}
                        <DropdownMenu>
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