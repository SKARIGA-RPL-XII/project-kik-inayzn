import { Link, usePage, router } from '@inertiajs/react';

export default function Sidebar() {
    // Fungsi untuk Logout dengan konfirmasi
    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
            // Mengirim request POST ke rute logout di Laravel
            router.post('/logout');
        }
    };

    return (
        <aside className="w-64 border-r bg-white shadow-sm flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b">
                <div className="h-8 w-8 rounded-lg bg-[#1A4D2E] flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-800">PropertyKu</span>
            </div>

            {/* Menu Section */}
            <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
                
                {/* Sesuaikan href dengan rute di web.php */}
                <SidebarItem href="/admin/dashboard" label="Dashboard" icon="📊" />
                <SidebarItem href="/produk" label="Produk" icon="🏠" />
                <SidebarItem href="/kategori" label="Kategori" icon="📁" />
                <SidebarItem href="/pengguna" label="Pengguna" icon="👥" />
                
                <p className="px-4 py-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reports</p>
                <SidebarItem href="/ulasan" label="Ulasan" icon="⭐" />
            </nav>

            {/* Footer Sidebar */}
            <div className="p-4 border-t">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md transition duration-200 group"
                >
                    <span className="text-lg group-hover:scale-110 transition-transform">🚪</span> 
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
    icon?: string;
}) {
    const { url } = usePage();
    
    // Logika isActive agar lebih akurat (juga menangani sub-halaman)
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
            <span className="text-lg">{icon}</span>
            {label}
        </Link>
    );
}