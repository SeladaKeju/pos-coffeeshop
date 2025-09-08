import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInput } from '@/components/ui/search-input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Menu, Category, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, MoreVertical, Pencil, Trash2, Plus, Settings } from 'lucide-react';

interface MenusPageProps extends PageProps {
    menus: {
        data: Menu[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        station?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu Management',
        href: 'create-menu',
    },
];

export default function MenusPage({ menus, categories, filters }: MenusPageProps) {
    // Get filter values from URL parameters
    const currentSearch = filters?.search || '';
    const currentCategory = filters?.category || '';
    const currentStation = filters?.station || '';
    
    const handleSearch = (searchTerm: string) => {
        router.visit(route('admin.create-menu.index'), {
            data: {
                search: searchTerm,
                category: currentCategory,
                station: currentStation,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryFilter = (categoryId: string) => {
        router.visit(route('admin.create-menu.index'), {
            data: {
                search: currentSearch,
                category: categoryId === 'all' ? '' : categoryId,
                station: currentStation,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStationFilter = (station: string) => {
        router.visit(route('admin.create-menu.index'), {
            data: {
                search: currentSearch,
                category: currentCategory,
                station: station === 'all' ? '' : station,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    const handleAdd = () => {
        router.visit(route('admin.create-menu.create'));
    };

    const handleEdit = (id: number) => {
        router.visit(route('admin.create-menu.edit', id));
    };

    const handleManageVariants = (id: number) => {
        router.visit(route('admin.create-menu.manage', id));
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete menu "${name}"?`)) {
            router.delete(route('admin.create-menu.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a toast or notification
                },
            });
        }
    };

    const navigateToPage = (page: number) => {
        router.visit(route('admin.create-menu.index'), {
            data: {
                page: page,
                search: currentSearch,
                category: currentCategory,
                station: currentStation,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStationBadge = (station: string) => {
        const variants = {
            kitchen: 'bg-orange-100 text-orange-800',
            bar: 'bg-blue-100 text-blue-800',
            both: 'bg-green-100 text-green-800',
        };
        
        return (
            <Badge className={variants[station as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
                {station}
            </Badge>
        );
    };

    const columns = [
        {
            label: 'No',
            render: (menu: Menu) => {
                const menuIndex = menus.data.findIndex(m => m.id === menu.id);
                const currentPage = menus.current_page;
                const perPage = menus.per_page;
                return (currentPage - 1) * perPage + menuIndex + 1;
            },
        },
        {
            label: 'Name',
            render: (menu: Menu) => (
                <div>
                    <div className="font-medium text-gray-900">{menu.name}</div>
                    <div className="text-sm text-gray-500">SKU: {menu.sku}</div>
                </div>
            ),
        },
        {
            label: 'Category',
            render: (menu: Menu) => (
                <span className="text-sm text-gray-600">
                    {menu.category?.name || 'No Category'}
                </span>
            ),
        },
        {
            label: 'Price',
            render: (menu: Menu) => (
                <span className="font-medium text-gray-900">
                    {formatPrice(menu.price)}
                </span>
            ),
        },
        {
            label: 'Station',
            render: (menu: Menu) => getStationBadge(menu.station),
        },
        {
            label: 'Status',
            render: (menu: Menu) => (
                <Badge className={menu.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {menu.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            label: 'Actions',
            render: (menu: Menu) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(menu.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Menu
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageVariants(menu.id)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage Variants
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={() => handleDelete(menu.id, menu.name)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Menu
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu Management" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-gray-600">Manage all menu items for your coffee shop</p>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Menus</h2>
                            </div>
                            
                            {/* Filters and Search */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-3">
                                    <Select value={currentCategory || 'all'} onValueChange={handleCategoryFilter}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Filter by Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={currentStation || 'all'} onValueChange={handleStationFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Filter by Station" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Stations</SelectItem>
                                            <SelectItem value="kitchen">Kitchen</SelectItem>
                                            <SelectItem value="bar">Bar</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex gap-3">
                                    <SearchInput
                                        value={currentSearch}
                                        onSearch={handleSearch}
                                        placeholder="Search menus..."
                                        className="w-64"
                                    />
                                    <Button onClick={handleAdd}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Menu
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Search Results or Empty State */}
                        {menus.data.length === 0 && currentSearch ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No menus found</h3>
                                <p className="text-gray-500">
                                    No menus match your search for "<span className="font-semibold">{currentSearch}</span>"
                                </p>
                            </div>
                        ) : menus.data.length === 0 ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                                    <span className="text-2xl text-gray-400">🍽️</span>
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No menus yet</h3>
                                <p className="mb-4 text-gray-500">Start by creating your first menu item</p>
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Menu
                                </Button>
                            </div>
                        ) : (
                            <>
                                <CustomTable columns={columns} data={menus.data} />
                                <PaginationWrapper
                                    currentPage={menus.current_page}
                                    lastPage={menus.last_page}
                                    perPage={menus.per_page}
                                    total={menus.total}
                                    onNavigate={navigateToPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
