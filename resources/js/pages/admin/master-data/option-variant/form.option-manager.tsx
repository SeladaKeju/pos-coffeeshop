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
import { type BreadcrumbItem, VariantGroup, VariantOption } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface VariantOptionFormPageProps extends PageProps {
    variantGroup?: VariantGroup;
    variantGroups?: VariantGroup[];
    variantOption?: VariantOption;
}

const formSchema = z.object({
    variant_group_id: z.number().min(1, 'Please select a variant group'),
    name: z.string().min(2, {
        message: 'Option name must be at least 2 characters.',
    }),
    extra_price: z.number(),
    sort_order: z.number().min(0, {
        message: 'Sort order must be a positive number.',
    }),
    is_active: z.boolean(),
});

export default function VariantOptionForm() {
    const { variantGroup, variantGroups, variantOption } = usePage<VariantOptionFormPageProps>().props;
    const isEdit = !!variantOption;
    const selectedGroup = variantGroup || (isEdit ? undefined : undefined);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Master Data',
            href: '#',
        },
        {
            title: 'Variant Options',
            href: route('admin.variant-options.index'),
        },
        ...(selectedGroup ? [{
            title: selectedGroup.name,
            href: route('admin.variant-options.manage', selectedGroup.id),
        }] : []),
        {
            title: isEdit ? 'Edit Option' : 'Create Option',
            href: isEdit 
                ? route('admin.variant-options.edit', variantOption?.id) 
                : route('admin.variant-options.create'),
        },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variant_group_id: selectedGroup?.id || variantOption?.variant_group_id || 0,
            name: variantOption?.name || '',
            extra_price: variantOption?.extra_price || 0,
            sort_order: variantOption?.sort_order || 0,
            is_active: variantOption?.is_active ?? true,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (isEdit && variantOption) {
            router.put(
                route('admin.variant-options.update', variantOption.id),
                values,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Variant option updated successfully');
                        if (selectedGroup) {
                            router.visit(route('admin.variant-options.manage', selectedGroup.id));
                        } else {
                            router.visit(route('admin.variant-options.index'));
                        }
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        toast.error('Failed to update variant option');
                    },
                }
            );
        } else {
            router.post(
                route('admin.variant-options.store'),
                values,
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Variant option created successfully');
                        if (selectedGroup) {
                            router.visit(route('admin.variant-options.manage', selectedGroup.id));
                        } else {
                            router.visit(route('admin.variant-options.index'));
                        }
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        toast.error('Failed to create variant option');
                    },
                }
            );
        }
    }

    const handleBack = () => {
        if (selectedGroup) {
            router.visit(route('admin.variant-options.manage', selectedGroup.id));
        } else {
            router.visit(route('admin.variant-options.index'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Variant Option' : 'Create Variant Option'} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Edit Variant Option' : 'Create Variant Option'}</CardTitle>
                        <CardDescription>
                            {isEdit 
                                ? 'Edit variant option details' 
                                : 'Create a new variant option'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {!selectedGroup && (
                                    <FormField
                                        control={form.control}
                                        name="variant_group_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Variant Group</FormLabel>
                                                <FormControl>
                                                    <Select 
                                                        onValueChange={(value) => field.onChange(parseInt(value))} 
                                                        defaultValue={field.value?.toString()}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a variant group" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {variantGroups?.map((group) => (
                                                                <SelectItem key={group.id} value={group.id.toString()}>
                                                                    {group.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option Name</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="e.g., Small, Medium, Large" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="extra_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price Adjustment</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    placeholder="Enter price adjustment" 
                                                    value={field.value || ''}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                />
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
                                                    placeholder="Enter sort order" 
                                                    value={field.value || ''}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                />
                                            </FormControl>
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
                                        onClick={handleBack}
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
