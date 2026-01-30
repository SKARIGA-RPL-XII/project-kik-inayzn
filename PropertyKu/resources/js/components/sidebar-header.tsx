import type { BreadcrumbItem } from '@/types';

interface SidebarHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export default function SidebarHeader({
    breadcrumbs,
}: SidebarHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
            {/* KIRI: Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span 
                            className={`
                                ${index === breadcrumbs.length - 1 
                                    ? 'font-semibold text-slate-800' 
                                    : 'text-muted-foreground hover:text-[#1A4D2E] cursor-pointer transition-colors'
                                }
                            `}
                        >
                            {item.title}
                        </span>
                        {index < breadcrumbs.length - 1 && (
                            <span className="text-slate-300">/</span>
                        )}
                    </div>
                ))}
            </div>

            {/* KANAN: Profil Admin */}
            <div className="flex items-center gap-4 border-l pl-4">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-slate-800 leading-none">
                        Ziera Een
                    </span>
                    <span className="text-[11px] font-medium text-[#1A4D2E] mt-1 uppercase tracking-wider">
                        Super Admin
                    </span>
                </div>
                
                {/* Avatar */}
                <div className="relative group cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-[#1A4D2E] flex items-center justify-center text-white font-bold border-2 border-white shadow-sm ring-1 ring-slate-200">
                        Z
                    </div>
                    {/* Indikator Online */}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
                </div>
            </div>
        </header>
    );
}