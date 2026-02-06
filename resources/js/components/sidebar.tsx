import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Home, 
    Folders, 
    Users, 
    Star, 
    LogOut 
} from 'lucide-react';

export default function Sidebar() {
    // Fungsi logout yang disesuaikan
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
            router.post('/logout', {}, {
                // Menghapus history browser agar tidak bisa di-back
                replace: true, 
                onSuccess: () => {
                    // Paksa reload total ke halaman login untuk membersihkan state
                    window.location.href = '/login';
                }
            });
        }
    };

    return (
        <aside className="w-64  bg-white shadow-sm flex flex-col h-screen sticky top-0">
            <div className="flex h-16 items-center px-6 ">
                <div className="flex items-center gap-3">
                    <img 
                        src="/images/logo.png" 
                        alt="Logo PropertyKu" 
                        className="h-10 w-auto object-contain" 
                    />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
                
                <SidebarItem href="/admin/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} />
                <SidebarItem href="/produk" label="Properti" icon={<Home size={18} />} />
                <SidebarItem href="/kategori" label="Kategori" icon={<Folders size={18} />} />
                <SidebarItem href="/pengguna" label="Pengguna" icon={<Users size={18} />} />
                
                <p className="px-4 py-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reports</p>
                <SidebarItem href="/ulasan" label="Ulasan" icon={<Star size={18} />} />
            </nav>

            <div className="p-4">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md transition duration-200 group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> 
                    Logout
                </button>
            </div>
        </aside>
    );
}

function SidebarItem({
    href,
    label,
    icon,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href + '/');

    return (
        <Link
            href={href}
            className={`
                flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium transition-all duration-200
                ${isActive 
                    ? 'bg-[#1A4D2E] text-white shadow-md shadow-green-900/20' 
                    : 'text-slate-600 hover:bg-gray-100 hover:text-[#1A4D2E]'
                }
            `}
        >
            <span className={`${isActive ? 'text-white' : 'text-slate-400'} transition-colors`}>
                {icon}
            </span>
            {label}
        </Link>
    );
}