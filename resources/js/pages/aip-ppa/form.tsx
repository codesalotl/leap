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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 1. Validation Schema
const formSchema = z.object({
    office_id: z.string().min(1, 'Implementing office is required'),
    title: z.string().min(1, 'Title is required'),
    code_suffix: z
        .string()
        .min(1, 'Suffix is required')
        .max(3, 'Suffix must be 3 digits (e.g., 001)')
        .regex(/^\d+$/, 'Suffix must be numeric'),
    type: z.enum(['Program', 'Project', 'Activity']),
    is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface Office {
    id: number;
    name: string;
    code: string;
}

interface AipFormProps {
    data?: any; // The record (if editing) OR the Parent record (if adding child)
    mode: 'add' | 'edit';
    type?: 'Program' | 'Project' | 'Activity'; // Target type from the table action
    onSuccess?: () => void;
    offices: Office[];
}

export default function AipForm({
    data,
    mode,
    type,
    onSuccess,
    offices,
}: AipFormProps) {
    const isEditing = mode === 'edit';
    const isAddingChild = mode === 'add' && !!data;

    // 2. Initialize Form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            office_id: '',
            title: '',
            code_suffix: '',
            type: 'Program',
            is_active: true,
        },
    });

    // 3. Sync form with props when dialog opens
    useEffect(() => {
        if (isEditing) {
            form.reset({
                office_id: data?.office_id?.toString() || '',
                title: data?.title || '',
                code_suffix: data?.code_suffix || '',
                type: data?.type || 'Program',
                is_active: !!data?.is_active,
            });
        } else {
            // Adding Mode
            form.reset({
                office_id: data?.office_id?.toString() || '', // Inherit office from parent if exists
                title: '',
                code_suffix: '',
                type: type || 'Program',
                is_active: true,
            });
        }
    }, [data, mode, type, form]);

    // 4. Submit Handler
    function onSubmit(values: FormValues) {
        const payload: any = { ...values };

        if (isEditing) {
            router.patch(`/ppas/${data.id}`, payload, {
                onSuccess: () => onSuccess?.(),
            });
        } else {
            // If adding a child, include the parent_id
            if (isAddingChild) {
                payload.parent_id = data.id;
            }

            router.post('/ppas', payload, {
                onSuccess: () => {
                    form.reset();
                    onSuccess?.();
                },
            });
        }
    }

    return (
        <Form {...form}>
            <form
                id="ppa-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* OFFICE SELECTION */}
                    <FormField
                        control={form.control}
                        name="office_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Implementing Office</FormLabel>
                                {isEditing || isAddingChild ? (
                                    /* When locked, we show a disabled input for UI
                                       BUT use a hidden input to actually send the data.
                                    */
                                    <div className="space-y-2">
                                        <Input
                                            value={
                                                offices.find(
                                                    (o) =>
                                                        o.id.toString() ===
                                                        field.value,
                                                )?.name || 'Loading...'
                                            }
                                            disabled
                                            className="bg-muted"
                                        />
                                        <input
                                            type="hidden"
                                            {...form.register('office_id')}
                                        />
                                        <FormDescription>
                                            Inherited from parent.
                                        </FormDescription>
                                    </div>
                                ) : (
                                    /* Standard Select for new Programs */
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Office" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {offices.map((o) => (
                                                <SelectItem
                                                    key={o.id}
                                                    value={o.id.toString()}
                                                >
                                                    {o.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* CODE SUFFIX */}
                    <FormField
                        control={form.control}
                        name="code_suffix"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Suffix (Sequence)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g. 001"
                                        {...field}
                                        maxLength={3}
                                    />
                                </FormControl>
                                <FormDescription>
                                    3-digit code for the reference ID.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* TYPE DISPLAY (Read-only) */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                    <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                        Entry Type
                    </span>
                    <span className="rounded border bg-background px-2 py-1 text-sm font-bold text-primary shadow-sm">
                        {form.watch('type')}
                    </span>
                </div>

                {/* TITLE FIELD */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Official Title</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={`Enter the name of the ${form.watch('type').toLowerCase()}...`}
                                    className="min-h-[100px] resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* STATUS TOGGLE */}
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">
                                    Active Entry
                                </FormLabel>
                                <FormDescription>
                                    Only active PPAs can be selected for annual
                                    budget planning.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                {/* Hidden field to ensure type is always submitted */}
                <input type="hidden" {...form.register('type')} />
            </form>
        </Form>
    );
}
