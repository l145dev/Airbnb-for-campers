import { useState } from 'react';
import './ResetPassword.css';
import { EmailCodeComponent } from '@/components/EmailCodeComponent/EmailCodeComponent';
import { EnterCodeComponent } from '@/components/EnterCodeComponent/EnterCodeComponent';
import { ResetPasswordComponent } from '@/components/ResetPasswordComponent/ResetPasswordComponent';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

const ResetPassword = () => {
    const [step, setStep] = useState<number>(1);
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    const handleResetSuccess = () => {
        toast("Password reset!", {
            description: new Date().toLocaleString()
        })
        // navigate back 
        navigate(-1);
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <EmailCodeComponent onEmailInput={(email) => { setStep(2); setEmail(email) }} />
                    </>
                )
            case 2:
                return (
                    <>
                        <EnterCodeComponent email={email} onCodeInput={() => setStep(3)} onStepBack={() => setStep(1)} />
                    </>
                )
            case 3:
                return (
                    <>
                        <ResetPasswordComponent onResetPassword={handleResetSuccess} onStepBack={() => setStep(2)} />
                    </>
                )

            default:
                return (
                    <>
                        <EmailCodeComponent onEmailInput={(email) => { setStep(2); setEmail(email) }} />
                    </>
                )
        }
    }
    return (
        <>
            <Toaster closeButton />
            <div className='resetpassword flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
                {/* render steps (in cards) here */}
                <div className='min-w-[400px]'>
                    {renderStep()}
                </div>
            </div>
        </>
    )
}

export default ResetPassword;