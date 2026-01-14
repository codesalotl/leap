import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Validation schema
const formSchema = z.object({
    office_id: z.string().min(1, 'Implementing office is required'),
    description: z.string().min(1, 'Description is required'),
});

type FormValues = z.infer<typeof formSchema>;

// UPDATED: Matches the 'offices' migration schema
interface Office {
    id: number;
    sector_id: number | null; // schema says nullable()
    lgu_level_id: number;
    office_type_id: number;
    code: string; // schema: string('code', 3)
    name: string; // schema: string('name', 100)
    is_lee: boolean; // schema: boolean
    created_at?: string | Date;
    updated_at?: string | Date;
}

interface AipFormProps {
    id?: number | null; // Record ID (for Edit) or Parent ID (for Add Child)
    data?: any; // Existing record data
    mode: 'add' | 'edit';
    onSuccess?: () => void;
    offices: Office[];
}

export default function AipForm({
    id,
    data,
    mode,
    onSuccess,
    offices,
}: AipFormProps) {
    // Determine if we are adding a child to a parent
    const isAddingChild = mode === 'add' && !!id;
    const isEditing = mode === 'edit';

    // Helper to get initial office ID string
    const getInitialOfficeId = () => {
        if (isEditing) return data?.office_id?.toString() || '';
        // If adding a child, the office usually defaults to the parent's office
        if (isAddingChild) return data?.office_id?.toString() || '';
        return '';
    };

    const defaultValues: FormValues = {
        office_id: getInitialOfficeId(),
        description: isEditing ? data?.description : '',
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    // Reset form when props change
    useEffect(() => {
        form.reset(defaultValues);
    }, [data, mode, id]);

    function onSubmit(values: FormValues) {
        let inertiaMethod: 'post' | 'patch' = 'post';
        let url = '/aip-ppa';

        const payload: any = { ...values };

        if (mode === 'add') {
            // id here is the parent_id
            payload.parent_id = id;
        } else if (mode === 'edit') {
            // id here is the record's primary key
            inertiaMethod = 'patch';
            url = `/aip-ppa/${id}`;
        }

        router[inertiaMethod](url, payload, {
            onSuccess: () => {
                form.reset();
                onSuccess?.();
            },
        });
    }

    // Helper to get display name for Read-Only mode
    const getReadOnlyOfficeName = () => {
        // Try to find the office name in the data object directly
        if (data?.office?.name) return data.office.name;

        // If data just has an ID, try to find it in the offices prop
        if (data?.office_id) {
            const found = offices.find((o) => o.id === data.office_id);
            if (found) return found.name;
        }

        // Fallback (mostly for parent titles in Add Child mode)
        return data?.name || 'Unknown Office';
    };

    return (
        <Form {...form}>
            <form
                id="ppa-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                {/* OFFICE SELECTION LOGIC */}
                <FormField
                    control={form.control}
                    name="office_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Implementing Office / Department
                            </FormLabel>

                            {/*
                               If we are adding a root Program (no parent id),
                               show the dropdown. Otherwise, keep it read-only.
                            */}
                            {!isAddingChild && !isEditing ? (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an office" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {offices.map((office) => (
                                            <SelectItem
                                                key={office.id}
                                                value={office.id.toString()}
                                            >
                                                {/* Display Name and Code */}
                                                {office.name} ({office.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        value={getReadOnlyOfficeName()}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <FormDescription>
                                        Office is locked for{' '}
                                        {isEditing
                                            ? 'existing records'
                                            : 'children elements'}
                                        .
                                    </FormDescription>
                                    {/* Hidden input to ensure office_id is sent in child-add mode */}
                                    <input
                                        type="hidden"
                                        {...form.register('office_id')}
                                    />
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* SHOW REFERENCE CODE PREVIEW IF EDITING */}
                {isEditing && (
                    <FormItem>
                        <FormLabel>AIP Reference Code</FormLabel>
                        <FormControl>
                            <Input
                                value={data?.reference_code}
                                disabled
                                className="bg-muted font-mono"
                            />
                        </FormControl>
                    </FormItem>
                )}

                {/* DESCRIPTION FIELD */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Program/Project/Activity Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g. Construction of Health Center"
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
