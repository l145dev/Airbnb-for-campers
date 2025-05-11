import './NotFound.css';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className='notfound'>
                <h1>404 | Page not found</h1>
                <div className='controls'>
                    <Button variant={"default"} onClick={() => navigate(-1)} className='bg-[#3D8B40] hover:bg-[#357A38]'>
                        Back
                    </Button>

                    <Button variant={"outline"} asChild>
                        <Link to={"/home"}>
                            Home
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    )
}

export default NotFound;