import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { SearchInput } from '@/components/ui/search-input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, VariantGroup } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, MoreVertical, Pencil, Trash2, Eye, Plus } from 'lucide-react';

interface VariantGroupsPageProps {
    variantGroups: {
        data: VariantGroup[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Data',
        href: '#',
    },
    {
        title: 'Variant Groups',
        href: 'variant-groups',
    },
];

export default function VariantGroupsPage({ variantGroups, filters }: VariantGroupsPageProps) {
    // Get search value from URL parameters
    const currentSearch = filters?.search || '';
    
    const handleSearch = (searchTerm: string) => {
        router.visit(route('admin.variant-groups.index'), {
            data: {
                search: searchTerm,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    const handleAdd = () => {
        router.visit(route('admin.variant-groups.create'));
    };

    const handleEdit = (id: number) => {
        router.visit(route('admin.variant-groups.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('admin.variant-groups.show', id));
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete variant group "${name}"?`)) {
            router.delete(route('admin.variant-groups.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a toast or notification
                },
            });
        }
    };

    const columns = [
        {
            label: 'No',
            render: (variantGroup: VariantGroup) => (
               variantGroup.sort_order
            ),
        },
        {
            label: 'Name',
            render: (variantGroup: VariantGroup) => (
                <div>
                    <div className="font-medium text-gray-900">{variantGroup.name}</div>
                </div>
            ),
        },
        {
            label: 'Type',
            render: (variantGroup: VariantGroup) =>
                variantGroup.type === 'single' ? 'Single Choice' : 'Multiple Choice',
        },
        {
            label: 'Required',
            render: (variantGroup: VariantGroup) =>
                variantGroup.is_required ? 'Required' : 'Optional',
        },
        {
            label: 'Status',
            render: (variantGroup: VariantGroup) =>
                variantGroup.is_active ? 'Active' : 'Inactive',
        },
        {
            label: 'Actions',
            render: (variantGroup: VariantGroup) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(variantGroup.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(variantGroup.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Group
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={() => handleDelete(variantGroup.id, variantGroup.name)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Group
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Variant Groups" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Variant Groups Management</h1>
                    <p className="text-gray-600">Manage product variation categories (Size, Temperature, Add-ons, etc.)</p>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Variant Groups</h2>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {/* Server-Side Search Input */}
                                <SearchInput
                                    value={currentSearch}
                                    onSearch={handleSearch}
                                    placeholder="Search variant groups..."
                                />
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Variant Group
                                </Button>
                            </div>
                        </div>

                        {/* Search Results or Empty State */}
                        {variantGroups.data.length === 0 && currentSearch ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No variant groups found</h3>
                                <p className="text-gray-500">
                                    No variant groups match your search for "<span className="font-semibold">{currentSearch}</span>"
                                </p>
                            </div>
                        ) : (
                            <CustomTable columns={columns} data={variantGroups.data} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
