import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { SearchInput } from '@/components/ui/search-input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, MoreVertical, Pencil, Trash2, Eye, Plus } from 'lucide-react';

interface UsersPageProps {
    users: User[];
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: 'users',
    },
];

export default function UsersPage({ users, filters }: UsersPageProps) {
    // Get search value from URL parameters
    const currentSearch = filters?.search || '';
    const handleSearch = (searchTerm: string) => {
        router.visit(route('users.index'), {
            data: {
                search: searchTerm,
                page: 1,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };
    const handleAdd = () => {
        router.visit(route('users.create'));
    };

    const handleEdit = (id: number) => {
        router.visit(route('users.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('users.show', id));
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete user "${name}"?`)) {
            router.delete(route('users.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a toast or notification
                },
            });
        }
    };

    const columns = [
        {
            label: 'ID',
            render: (user: User) => user.id,
        },
        {
            label: 'Name',
            render: (user: User) => user.name,
        },
        {
            label: 'Email',
            render: (user: User) => user.email,
        },
        {
            label: 'Roles',
            render: (user: User) => (
                <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                        <span key={index} className="text-sm">
                            {role}
                            {index < user.roles.length - 1 && ', '}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            label: 'Actions',
            render: (user: User) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={() => handleDelete(user.id, user.name)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-600">Manage all users in the system</p>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <div className="p-6">
                        <div className="mb-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">All Users</h2>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                {/* Server-Side Search Input */}
                                <SearchInput
                                    value={currentSearch}
                                    onSearch={handleSearch}
                                    placeholder="Search users..."
                                />
                                <Button onClick={handleAdd}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New User
                                </Button>
                            </div>
                        </div>

                        {/* Search Results or Empty State */}
                        {users.length === 0 && currentSearch ? (
                            <div className="rounded-lg bg-gray-50 py-12 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No users found</h3>
                                <p className="text-gray-500">
                                    No users match your search for "<span className="font-semibold">{currentSearch}</span>"
                                </p>
                            </div>
                        ) : (
                            <CustomTable columns={columns} data={users} />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
