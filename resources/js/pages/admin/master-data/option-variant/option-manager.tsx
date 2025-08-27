import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, VariantGroup } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowRight, Search } from 'lucide-react';

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
        title: 'Variant Options',
        href: 'variant-options',
    },
];

export default function OptionManagerPage({ variantGroups, filters }: VariantGroupsPageProps) {
    // Get search value from URL parameters
    const currentSearch = filters?.search || '';

    const handleSearch = (searchTerm: string) => {
        router.visit(route('admin.variant-options.index'), {
            data: {
                search: searchTerm,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleManageOptions = (variantGroupId: number) => {
        // Navigate to variant options management page for specific group
        router.visit(route('admin.variant-options.manage', variantGroupId));
    };

    const columns = [
        {
            label: 'No',
            render: (variantGroup: VariantGroup) => variantGroup.sort_order,
        },
        {
            label: 'Name',
            render: (variantGroup: VariantGroup) => variantGroup.name,
        },
        {
            label: 'Type',
            render: (variantGroup: VariantGroup) => <>{variantGroup.type === 'single' ? 'Single Choice' : 'Multiple Choice'}</>,
        },
        {
            label: 'Required',
            render: (variantGroup: VariantGroup) => <>{variantGroup.is_required ? 'Required' : 'Optional'}</>,
        },
        {
            label: 'Status',
            render: (variantGroup: VariantGroup) => <>{variantGroup.is_active ? 'Active' : 'Inactive'}</>,
        },
        {
            label: 'Actions',
            render: (variantGroup: VariantGroup) => (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleManageOptions(variantGroup.id)}>
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">Manage options</span>
                </Button>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Variant Options Manager" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Variant Options Management</h1>
                    <p className="text-gray-600">Select a variant group to manage its options (Small, Medium, Large, etc.)</p>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Variant Groups</h2>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {/* Server-Side Search Input */}
                                <SearchInput value={currentSearch} onSearch={handleSearch} placeholder="Search variant groups..." />
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
