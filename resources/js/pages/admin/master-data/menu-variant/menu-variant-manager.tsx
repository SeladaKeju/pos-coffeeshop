import { CustomTable } from '@/components/ui/c-table';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Search, MoreVertical, Pencil, Trash2, Eye, Plus, Filter } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Menu {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    };
    price: number;
}

interface MenuVariant {
    id: number;
    name: string;
    extra_price: number;
    menu_id: number;
    menu: Menu;
    total_price: number;
    created_at: string;
    updated_at: string;
}

interface MenuVariantsPageProps {
    menuVariants: {
        data: MenuVariant[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        meta: {
            current_page: number;
            from: number | null;
            last_page: number;
            links: {
                url: string | null;
                label: string;
                active: boolean;
            }[];
            path: string;
            per_page: number;
            to: number | null;
            total: number;
        };
    };
    menus: Menu[];
    filters: {
        search?: string;
        menu_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Data',
        href: '#',
    },
    {
        title: 'Menu Variants',
        href: '/menu-variants',
    },
];

export default function MenuVariantsPage({ menuVariants, menus, filters }: MenuVariantsPageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<MenuVariant | null>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    // Get filter values from URL parameters
    const currentSearch = filters?.search || '';
    const currentMenuFilter = filters?.menu_id || '';
    
    // Inertia form setup
    const { data, setData, post, put, processing, errors, reset } = useForm({
        menu_id: '',
        name: '',
        extra_price: 0,
    });
    
    const handleSearch = (searchTerm: string) => {
        router.visit(route('menu-variants.index'), {
            data: {
                search: searchTerm,
                menu_id: currentMenuFilter,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleMenuFilter = (menuId: string) => {
        router.visit(route('menu-variants.index'), {
            data: {
                search: currentSearch,
                menu_id: menuId,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAdd = () => {
        setEditingVariant(null);
        setIsViewMode(false);
        reset();
        setData({
            menu_id: '',
            name: '',
            extra_price: 0,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (variant: MenuVariant) => {
        setEditingVariant(variant);
        setIsViewMode(false);
        setData({
            menu_id: variant.menu_id.toString(),
            name: variant.name,
            extra_price: variant.extra_price,
        });
        setIsDialogOpen(true);
    };

    const handleView = (variant: MenuVariant) => {
        setEditingVariant(variant);
        setIsViewMode(true);
        setData({
            menu_id: variant.menu_id.toString(),
            name: variant.name,
            extra_price: variant.extra_price,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete menu variant "${name}"?`)) {
            router.delete(route('menu-variants.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a toast or notification
                },
            });
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        console.log('Form submitted with data:', data);
        console.log('Editing variant:', editingVariant);
        
        if (editingVariant) {
            // Update existing variant
            put(route('menu-variants.update', editingVariant.id), {
                onSuccess: () => {
                    console.log('Menu variant updated successfully');
                    setIsDialogOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.log('Error updating menu variant:', errors);
                }
            });
        } else {
            // Create new variant
            post(route('menu-variants.store'), {
                onSuccess: () => {
                    console.log('Menu variant created successfully');
                    setIsDialogOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.log('Error creating menu variant:', errors);
                }
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const columns = [
        {
            label: 'Menu',
            render: (variant: MenuVariant) => (
                <div>
                    <div className="font-medium text-gray-900">{variant.menu.name}</div>
                    <div className="text-sm text-gray-500">{variant.menu.category.name}</div>
                </div>
            ),
        },
        {
            label: 'Variant Name',
            render: (variant: MenuVariant) => (
                <div className="font-medium text-gray-900">{variant.name}</div>
            ),
        },
        {
            label: 'Base Price',
            render: (variant: MenuVariant) => (
                <div className="text-gray-900">{formatCurrency(variant.menu.price)}</div>
            ),
        },
        {
            label: 'Extra Price',
            render: (variant: MenuVariant) => (
                <div className="text-gray-900">
                    {variant.extra_price > 0 ? `+${formatCurrency(variant.extra_price)}` : formatCurrency(variant.extra_price)}
                </div>
            ),
        },
        {
            label: 'Total Price',
            render: (variant: MenuVariant) => (
                <div className="font-semibold text-gray-900">{formatCurrency(variant.total_price)}</div>
            ),
        },
        {
            label: 'Actions',
            render: (variant: MenuVariant) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(variant)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(variant)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Variant
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={() => handleDelete(variant.id, variant.name)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Variant
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu Variants" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Menu Variant Management</h1>
                    <p className="text-gray-600">Manage menu variants and their pricing for your coffee shop</p>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Menu Variants</h2>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {/* Search Input */}
                                    <SearchInput
                                        value={currentSearch}
                                        onSearch={handleSearch}
                                        placeholder="Search variants or menus..."
                                        className="max-w-md"
                                    />
                                    
                                    {/* Menu Filter */}
                                    <Select value={currentMenuFilter} onValueChange={handleMenuFilter}>
                                        <SelectTrigger className="w-48">
                                            <Filter className="mr-2 h-4 w-4" />
                                            <SelectValue placeholder="Filter by menu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All Menus</SelectItem>
                                            {menus.map((menu) => (
                                                <SelectItem key={menu.id} value={menu.id.toString()}>
                                                    {menu.name} ({menu.category.name})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Variant
                                </Button>
                            </div>
                        </div>

                        {/* Search Results or Empty State */}
                        {menuVariants.data.length === 0 && (currentSearch || currentMenuFilter) ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No variants found</h3>
                                <p className="text-gray-500">
                                    No menu variants match your current filters
                                </p>
                            </div>
                        ) : menuVariants.data.length === 0 ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <div className="mx-auto mb-4 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-400 text-2xl">🧪</span>
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No menu variants yet</h3>
                                <p className="text-gray-500 mb-4">Menu variants will appear here once they are created</p>
                            </div>
                        ) : (
                            <CustomTable columns={columns} data={menuVariants.data} />
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Variant Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isViewMode 
                                ? 'View Menu Variant' 
                                : editingVariant 
                                    ? 'Edit Menu Variant' 
                                    : 'Add New Menu Variant'
                            }
                        </DialogTitle>
                        <DialogDescription>
                            {isViewMode 
                                ? 'Menu variant details and information.'
                                : editingVariant 
                                    ? 'Make changes to the menu variant information.' 
                                    : 'Fill in the menu variant information to create a new variant.'
                            }
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="menu_id">Menu</Label>
                                <Select 
                                    value={data.menu_id} 
                                    onValueChange={(value) => setData('menu_id', value)}
                                    disabled={isViewMode}
                                >
                                    <SelectTrigger className={errors.menu_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a menu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {menus.map((menu) => (
                                            <SelectItem key={menu.id} value={menu.id.toString()}>
                                                {menu.name} ({menu.category.name}) - {formatCurrency(menu.price)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.menu_id && (
                                    <p className="text-sm text-red-500">{errors.menu_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Variant Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter variant name (e.g., Large, Small, Hot, Cold)"
                                    disabled={isViewMode}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="extra_price">Extra Price</Label>
                                <Input
                                    id="extra_price"
                                    type="number"
                                    step="0.01"
                                    value={data.extra_price}
                                    onChange={(e) => setData('extra_price', parseFloat(e.target.value) || 0)}
                                    placeholder="Enter extra price (0 for no additional cost)"
                                    min="0"
                                    disabled={isViewMode}
                                    className={errors.extra_price ? 'border-red-500' : ''}
                                />
                                {errors.extra_price && (
                                    <p className="text-sm text-red-500">{errors.extra_price}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Enter 0 if this variant has no additional cost
                                </p>
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                            >
                                {isViewMode ? 'Close' : 'Cancel'}
                            </Button>
                            {!isViewMode && (
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                >
                                    {processing 
                                        ? 'Saving...' 
                                        : editingVariant 
                                            ? 'Update Variant' 
                                            : 'Create Variant'
                                    }
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
