import './Login.css';
import { LoginForm } from "@/components/Login-form/login-form.tsx";

interface LoginFormPropsFromPage {
    onLoginSuccess: () => void; // callback to app.tsx
}

const Login: React.FC<LoginFormPropsFromPage> = ({ onLoginSuccess }) => {

    return (
        <>
            <div className='login flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
                <LoginForm className='min-w-[400px]' onLoginSuccess={onLoginSuccess} />
            </div>
        </>
    )
}

export default Login;