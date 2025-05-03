import './Register.css';
import { RegisterForm } from '@/components/Register-form/register-form.tsx';

const Register = () => {
    return (
        <>
            <div className='register flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
                <RegisterForm className='min-w-[400px]' />
            </div>
        </>
    )
}

export default Register;