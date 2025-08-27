import { PasswordInput } from '@/components/c-password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Role, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface UserWithPassword extends User {
    password: string;
}

const createFormSchema = (isEdit: boolean) => z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    email: z.string().email('Invalid email address.'),
    password: isEdit 
        ? z.string().optional().refine((val) => !val || val.length >= 8, { 
            message: 'Password must be at least 8 characters.' 
          })
        : z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    role: z.string().min(1, 'Please select a role'),
});

export default function UserForm() {
    const { user, allRoles } = usePage<{ user: UserWithPassword; allRoles: Role[] }>().props;
    const isEdit = !!user;

    const formSchema = createFormSchema(isEdit);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: route('users.index'),
        },
        {
            title: isEdit ? 'Edit' : 'Create',
            href: isEdit ? route('users.edit', user?.id) : route('users.create'),
        },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            role: user?.roles?.[0] ?? '', // Ambil role pertama karena sekarang single select
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (isEdit) {
            router.put(
                route('users.update', user.id),
                {
                    name: values.username,
                    email: values.email,
                    roles: [values.role], // Convert single role to array for backend
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.visit(route('users.index'));
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        if (errors.email) {
                            toast.error(errors.email);
                        }
                    },
                },
            );
        } else {
            router.post(
                route('users.store'),
                {
                    name: values.username,
                    email: values.email,
                    password: values.password,
                    roles: [values.role], // Convert single role to array for backend
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.visit(route('users.index'));
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        if (errors.email) {
                            toast.error(errors.email);
                        }

                        if (errors.password) {
                            toast.error(errors.password);
                        }
                    },
                },
            );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit User' : 'Create User'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit User' : 'Create User'}</CardTitle>
                        <CardDescription>{isEdit ? 'Edit user details' : 'Create a new user'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!isEdit && (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allRoles?.map((role) => (
                                                            <SelectItem key={role.id} value={role.name}>
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button type="submit">Save</Button>
                                    <Button variant="outline" onClick={() => router.visit(route('users.index'))}>
                                        Back
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
