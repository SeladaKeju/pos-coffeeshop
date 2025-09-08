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
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface VariantGroup {
    id: number;
    name: string;
    type: 'single' | 'multiple';
    is_required: boolean;
    sort_order: number;
    is_active: boolean;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Variant group name must be at least 2 characters.',
    }),
    type: z.enum(['single', 'multiple']),
    is_required: z.boolean(),
    sort_order: z.number().min(0, {
        message: 'Sort order must be a positive number.',
    }),
    is_active: z.boolean(),
});

export default function VariantGroupForm() {
    const { variantGroup } = usePage<{ variantGroup?: VariantGroup }>().props;
    const isEdit = !!variantGroup;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Master Data',
            href: '#',
        },
        {
            title: 'Variant Groups',
            href: route('admin.variant-groups.index'),
        },
        {
            title: isEdit ? 'Edit Variant Group' : 'Create Variant Group',
            href: isEdit ? route('admin.variant-groups.edit', variantGroup?.id) : route('admin.variant-groups.create'),
        },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: variantGroup?.name ?? '',
            type: variantGroup?.type ?? 'single',
            is_required: variantGroup?.is_required ?? false,
            sort_order: variantGroup?.sort_order ?? 0,
            is_active: variantGroup?.is_active ?? true,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (isEdit && variantGroup) {
            router.put(
                route('admin.variant-groups.update', variantGroup.id),
                values,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Variant group updated successfully');
                        router.visit(route('admin.variant-groups.index'));
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        toast.error('Failed to update variant group');
                    },
                }
            );
        } else {
            router.post(
                route('admin.variant-groups.store'),
                values,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Variant group created successfully');
                        router.visit(route('admin.variant-groups.index'));
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        toast.error('Failed to create variant group');
                    },
                }
            );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Variant Group' : 'Create Variant Group'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit Variant Group' : 'Create Variant Group'}</CardTitle>
                        <CardDescription>
                            {isEdit 
                                ? 'Edit variant group details' 
                                : 'Create a new variant group'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Group Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="e.g., Size, Temperature, Add-ons" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Selection Type</FormLabel>
                                            <FormControl>
                                                <Select 
                                                    onValueChange={field.onChange} 
                                                    defaultValue={field.value}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select variant type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="single">Single Choice (Radio)</SelectItem>
                                                        <SelectItem value="multiple">Multiple Choice (Checkbox)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sort_order"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sort Order</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_required"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    Required Selection
                                                </FormLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    Active Status
                                                </FormLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-2 justify-end">
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting 
                                            ? (isEdit ? 'Updating...' : 'Creating...') 
                                            : 'Save'
                                        }
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => router.visit(route('admin.variant-groups.index'))}
                                    >
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
