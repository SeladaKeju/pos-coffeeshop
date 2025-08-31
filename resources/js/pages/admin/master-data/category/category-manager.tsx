import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/ui/search-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, CategoriesPageProps, Category } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { MoreVertical, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Data',
        href: '#',
    },
    {
        title: 'Categories',
        href: '/categories',
    },
];

export default function CategoriesPage({ categories, filters }: CategoriesPageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Get search value from URL parameters
    const currentSearch = filters?.search || '';

    // Safe check untuk categories data
    const categoriesData = categories?.data || [];
    const hasCategories = categoriesData.length > 0;

    // Inertia form setup
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        sort: 1,
    });

    const handleSearch = (searchTerm: string) => {
        router.visit(route('categories.index'), {
            data: {
                search: searchTerm,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const navigateToPage = (page: number) => {
        router.visit(route('categories.index'), {
            data: {
                page: page,
                search: currentSearch,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAdd = () => {
        setEditingCategory(null);
        reset();
        setData({
            name: '',
            sort: 1,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            sort: category.sort,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            router.delete(route('categories.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a toast or notification
                },
            });
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingCategory) {
            // Update existing category
            put(route('categories.update', editingCategory.id), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        } else {
            // Create new category
            post(route('categories.store'), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    reset();
                },
            });
        }
    };

    const columns = [
        {
            label: 'No',
            render: (category: Category) => {
                if (!categories?.data) return '-';
                const categoryIndex = categories.data.findIndex(c => c.id === category.id);
                const currentPage = categories.current_page || 1;
                const perPage = categories.per_page || 10;
                if (categoryIndex === -1) return '-';
                return (currentPage - 1) * perPage + categoryIndex + 1;
            },
        },
        {
            label: 'Name',
            render: (category: Category) => (
                <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                </div>
            ),
        },
        {
            label: 'Menus',
            render: (category: Category) => <>{category.menus_count || 0}</>,
        },
        {
            label: 'Actions',
            render: (category: Category) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(category.id, category.name)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-gray-600">Manage product categories for your coffee shop</p>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Categories</h2>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {/* Server-Side Search Input */}
                                <SearchInput value={currentSearch} onSearch={handleSearch} placeholder="Search categories..." className="max-w-md" />
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Category
                                </Button>
                            </div>
                        </div>

                        {/* Search Results or Empty State */}
                        {!hasCategories && currentSearch ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No categories found</h3>
                                <p className="text-gray-500">
                                    No categories match your search for "<span className="font-semibold">{currentSearch}</span>"
                                </p>
                            </div>
                        ) : !hasCategories ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                                    <span className="text-2xl text-gray-400">📂</span>
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No categories yet</h3>
                                <p className="mb-4 text-gray-500">Categories will appear here once they are created</p>
                            </div>
                        ) : (
                            <>
                                <CustomTable columns={columns} data={categoriesData} />
                                {categories && (
                                    <PaginationWrapper
                                        currentPage={categories.current_page || 1}
                                        lastPage={categories.last_page || 1}
                                        perPage={categories.per_page || 10}
                                        total={categories.total || 0}
                                        onNavigate={navigateToPage}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? 'Make changes to the category information.'
                                : 'Fill in the category information to create a new category.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter category name"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort">Sort Order</Label>
                                <Input
                                    id="sort"
                                    type="number"
                                    value={data.sort}
                                    onChange={(e) => setData('sort', parseInt(e.target.value) || 1)}
                                    placeholder="Enter sort order"
                                    min="1"
                                    className={errors.sort ? 'border-red-500' : ''}
                                />
                                {errors.sort && <p className="text-sm text-red-500">{errors.sort}</p>}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
