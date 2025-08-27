import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, VariantGroup, VariantOption } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Eye, MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';

interface VariantOptionsDetailPageProps {
    variantGroup: VariantGroup;
    variantOptions: {
        data: VariantOption[];
        links: any[];
        meta: any;
    };
    filters?: {
        search?: string;
    };
}

export default function VariantOptionsDetailPage({ variantGroup, variantOptions, filters }: VariantOptionsDetailPageProps) {
    const currentSearch = filters?.search || '';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Master Data',
            href: '#',
        },
        {
            title: 'Variant Options',
            href: route('admin.variant-options.index'),
        },
        {
            title: variantGroup.name,
            href: route('admin.variant-options.manage', variantGroup.id),
        },
    ];

    const handleSearch = (searchTerm: string) => {
        router.visit(route('admin.variant-options.manage', variantGroup.id), {
            data: {
                search: searchTerm,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleBack = () => {
        router.visit(route('admin.variant-options.index'));
    };

    const handleAdd = () => {
        router.visit(route('admin.variant-options.create'), {
            data: { variant_group_id: variantGroup.id },
        });
    };

    const handleEdit = (id: number) => {
        router.visit(route('admin.variant-options.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('admin.variant-options.show', id));
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete variant option "${name}"?`)) {
            router.delete(route('admin.variant-options.destroy', id), {
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
            render: (variantOption: VariantOption) => variantOption.sort_order,
        },
        {
            label: 'Name',
            render: (variantOption: VariantOption) => (
                <div>
                    <div className="font-medium text-gray-900">{variantOption.name}</div>
                </div>
            ),
        },
        {
            label: 'Price Adjustment',
            render: (variantOption: VariantOption) => (
                <div className="text-sm">
                    {variantOption.extra_price > 0 ? (
                        <span className="text-green-600">Rp.{variantOption.extra_price}</span>
                    ) : (
                        <span className="text-gray-500">Free</span>
                    )}
                </div>
            ),
        },
        {
            label: 'Status',
            render: (variantOption: VariantOption) => <>{variantOption.is_active ? 'Active' : 'Inactive'}</>,
        },
        {
            label: 'Actions',
            render: (variantOption: VariantOption) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(variantOption.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(variantOption.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Option
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(variantOption.id, variantOption.name)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Option
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${variantGroup.name} Options`} />
            <div className="p-6">
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{variantGroup.name} Options</h1>
                            <p className="text-gray-600">
                                Manage options for {variantGroup.name} variant group (
                                {variantGroup.type === 'single' ? 'Single Choice' : 'Multiple Choice'})
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Options</h2>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <SearchInput value={currentSearch} onSearch={handleSearch} placeholder="Search variant options..." />
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Option
                                </Button>
                            </div>
                        </div>

                        {/* Search Results or Empty State */}
                        {variantOptions.data.length === 0 && currentSearch ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No options found</h3>
                                <p className="text-gray-500">
                                    No options match your search for "<span className="font-semibold">{currentSearch}</span>"
                                </p>
                            </div>
                        ) : variantOptions.data.length === 0 ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Plus className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No options yet</h3>
                                <p className="mb-4 text-gray-500">Start by adding options for {variantGroup.name} variant group</p>
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Option
                                </Button>
                            </div>
                        ) : (
                            <CustomTable columns={columns} data={variantOptions.data} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
