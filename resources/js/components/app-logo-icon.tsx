import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            {...props} 
            src="/images/logo.png"  // Pastikan file logo.png ada di folder public/images/
            alt="Logo Icon"
            className={`${props.className} object-contain`} 
        />
    );
}