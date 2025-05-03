import './Login.css';
import { LoginForm } from "@/components/Login-form/login-form.tsx";
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <>
            <div className='login flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
                <LoginForm className='min-w-[400px]' />
            </div>
        </>
    )
}

export default Login;