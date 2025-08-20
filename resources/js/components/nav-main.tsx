import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

// Helper function untuk check role
const hasRole = (role: string, userRoles: string[] = []) => 
    userRoles.includes(role);

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const userRoles = page.props.auth.user?.roles || [];
    
    // Filter items berdasarkan role
    const filteredItems = items.filter(item => {
        // Jika tidak ada role requirement, tampilkan untuk semua user
        if (!item.role) return true;
        
        // Check apakah user memiliki role yang dibutuhkan
        return hasRole(item.role, userRoles);
    });
    
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
