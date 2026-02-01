import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary overflow-hidden">
                {/* Pastikan baris ini ada dan bener jalurnya */}
                <img 
                    src="/images/logo.png" 
                    alt="Logo" 
                    className="size-full object-contain" 
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    PropertyKu
                </span>
            </div>
        </>
    );
}