import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    role?: string;
    subitem?: NavItem[];
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface VariantGroup {
    id: number;
    name: string;
    type: 'single' | 'multiple';
    is_required: boolean;
    sort_order: number;
    is_active: boolean;
}


export interface Category {
    id: number;
    name: string;
    sort: number;
    menus_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Menu {
    id: number;
    category_id: number;
    name: string;
    sku: string;
    price: number;
    station: 'kitchen' | 'bar' | 'both';
    is_active: boolean;
    category?: Category;
    variantGroups?: VariantGroup[];
    created_at: string;
    updated_at: string;
}

export interface VariantOption {
    id: number;
    name: string;
    extra_price: number;
    sort_order: number;
    is_active: boolean;
    variant_group_id: number;
}

export interface PageFilter {
    search?: string;
    [key: string]: unknown;
}

export interface FlashProps {
    success?: string;
    error?: string;
    [key: string]: unknown;
}

export type PageProps<T = unknown> = {
    data: PaginatedResponse<T>;
    filters?: PageFilter;
    flash?: FlashProps;
    [key: string]: unknown;
};

export interface CategoriesPageProps {
    categories: PaginatedResponse<Category>;
    filters: {
        search?: string;
    };
}

export interface VariantGroupsPageProps {
    variantGroups: PaginatedResponse<VariantGroup>;
    filters?: {
        search?: string;
    };
}


export interface VariantGroupsPageProps {
    variantGroups: {
        data: VariantGroup[];
    };
    filters?: {
        search?: string;
    };
}


export interface VariantOptionsDetailPageProps {
    variantGroup: VariantGroup;
    variantOptions: PaginatedResponse<VariantOption>;
    filters?: {
        search?: string;
    };
}