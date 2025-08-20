import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/ui/c-table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

interface UsersPageProps {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: 'users',
    },
];

export default function UsersPage({ users }: UsersPageProps) {

    const handleAdd = () => {
        router.visit(route('users.create'));
    };

    const handleEdit = (id: number) => {
        router.visit(route('users.edit', id));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
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
                <div className="flex gap-2">
                    <Button onClick={() => handleEdit(user.id)} className="size-icon bg-blue-600 hover:bg-blue-700">
                        <Pencil />
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(user.id)} className="size-icon">
                        <Trash2 />
                    </Button>
                </div>
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
                            <h2 className="mb-3 text-lg font-semibold">All Users</h2>
                            <div className="flex items-center justify-between gap-4">
                                <Input type="email" placeholder="Search" className="max-w-sm" />
                                <Button onClick={handleAdd}>Add New User</Button>
                            </div>
                        </div>
                        <CustomTable columns={columns} data={users} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
