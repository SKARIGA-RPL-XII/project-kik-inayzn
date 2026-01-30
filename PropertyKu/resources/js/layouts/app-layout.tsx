import Sidebar from '@/components/sidebar';
import SidebarHeader from '@/components/sidebar-header';
import type { BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}

export default function AppLayout({
    breadcrumbs,
    children,
}: AppLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Content */}
            <div className="flex flex-1 flex-col">
                <SidebarHeader breadcrumbs={breadcrumbs} />

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
