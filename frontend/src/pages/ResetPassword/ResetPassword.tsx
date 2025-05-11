import { useState } from 'react';
import './ResetPassword.css';
import { EmailCodeComponent } from '@/components/EmailCodeComponent/EmailCodeComponent';
import { EnterCodeComponent } from '@/components/EnterCodeComponent/EnterCodeComponent';
import { ResetPasswordComponent } from '@/components/ResetPasswordComponent/ResetPasswordComponent';

const ResetPassword = () => {
    const [step, setStep] = useState<number>(1);
    const [email, setEmail] = useState<string>("");

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
                        <EnterCodeComponent email={email} onCodeInput={() => setStep(3)} />
                    </>
                )
            case 3:
                return (
                    <>
                        <ResetPasswordComponent />
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