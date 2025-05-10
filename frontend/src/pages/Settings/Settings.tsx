import './Settings.css';
import { SettingsComponent } from '@/components/SettingsComponent/settings-component';

interface SettingsProps {
    onLogoutSuccess: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onLogoutSuccess }) => {
    return (
        <>
            <div className='settings flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
                <SettingsComponent className='min-w-[600px]' onLogoutSuccess={onLogoutSuccess} />
            </div>
        </>
    )
}

export default Settings;