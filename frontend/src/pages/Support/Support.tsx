import './Support.css';
import { SupportComponent } from '@/components/SupportComponent/support-component';

const Support = () => {
    return (
        <>
            <div className='support flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
                <SupportComponent className='min-w-[400px]' />
            </div>
        </>
    )
}

export default Support;