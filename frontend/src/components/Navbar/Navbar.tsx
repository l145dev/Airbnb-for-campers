import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className='nav'>
            {/* logo */}
            <Link to={"/"} className='to-airbnbcamping'>
                Airbnb Camping
            </Link>

            {/* full nav (under dropdown menu) */}
            <ul>
                <li className='to-home'>
                    <Link to={"/"}>
                        Home
                    </Link>
                </li>

                <li className='to-login'>
                    <Link to={"/login"}>
                        Login
                    </Link>
                </li>

                <li className='to-register'>
                    <Link to={"/register"}>
                        Register
                    </Link>
                </li>

                <li className='to-settings'>
                    <Link to={"/settings"}>
                        Settings
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar