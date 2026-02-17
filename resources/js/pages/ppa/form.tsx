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
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    sector_id: number;
    lgu_level_id: number;
    office_type_id: number;
    code: string;
    name: string;
    is_lee: number;
    created_at: string;
    updated_at: string;
    full_code: string;
    // Relationships (Eager Loaded)
    sector?: any;
    lgu_level?: any;
    office_type?: any;
}

interface PpaFormDialogProps {
    data?: any;
    mode: 'add' | 'edit';
    type?: 'Program' | 'Project' | 'Activity';
    onSuccess?: () => void;
    offices: Office[];
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    dialogMode: string;
    targetType: string;
    activePpa?: any;
}

export default function PpaFormDialog({
    data,
    mode,
    type,
    onSuccess,
    offices,
    isDialogOpen,
    setIsDialogOpen,
    dialogMode,
    targetType,
    activePpa,
}: PpaFormDialogProps) {
    const isEditing = mode === 'edit';
    const isAddingChild = mode === 'add' && !!data;

    // State for Office Command Dialog
    const [openOfficeCommand, setOpenOfficeCommand] = useState(false);

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

    const selectedOfficeId = Number(form.watch('office_id'));
    const codeSuffix = form.watch('code_suffix');
    const currentType = form.watch('type');

    const officeFullCode = offices.find(
        (office) => office.id === selectedOfficeId,
    )?.full_code;

    const getCodePreview = () => {
        if (currentType === 'Program') {
            return `${officeFullCode || '0000-000-0-00-000'}-${codeSuffix || '000'}`;
        }
        // For Projects/Activities, we use the parent's full_code
        if (activePpa?.full_code) {
            return `${activePpa.full_code}-${codeSuffix || '000'}`;
        }
        return `CODE-${codeSuffix || '000'}`;
    };

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
        } else if (mode === 'add') {
            // Adding Mode
            form.reset({
                office_id: data?.office_id?.toString() || '', // Inherit office from parent if exists
                title: '',
                code_suffix: '',
                type: type || 'Program',
                is_active: true,
            });
        }
    }, [data, mode, type, form, isDialogOpen]);

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {dialogMode === 'add'
                            ? `Add ${targetType}`
                            : `Edit ${targetType}`}
                    </DialogTitle>

                    <DialogDescription>
                        {dialogMode === 'add' && activePpa
                            ? `Creating under: ${activePpa.title}`
                            : 'Modify the details of this PPA entry.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-4">
                    <div className="flex-3 rounded-lg bg-card p-3">
                        <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            AIP Reference Code Preview
                        </div>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xl font-semibold">
                            {getCodePreview()}
                        </code>
                    </div>

                    <div className="flex-1 rounded-lg bg-card p-3">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                Entry Type
                            </span>
                            <span className="w-fit rounded border bg-background px-2 py-1 text-sm font-bold text-primary shadow-sm">
                                {form.watch('type')}
                            </span>
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        id="ppa-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* OFFICE SELECTION */}
                        <div className="col-span-1 md:col-span-2">
                            <FormField
                                control={form.control}
                                name="office_id"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Implementing Office
                                        </FormLabel>

                                        {isEditing || isAddingChild ? (
                                            // LOCKED STATE (Editing or Adding Child)
                                            <div className="flex w-full items-center gap-3 rounded-lg border bg-muted/40 p-3 shadow-sm ring-1 ring-black/5 ring-inset">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm">
                                                    <span className="text-lg">
                                                        🏢
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate text-sm font-semibold">
                                                        {offices.find(
                                                            (o) =>
                                                                o.id.toString() ===
                                                                field.value,
                                                        )?.name || 'Loading...'}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase italic">
                                                        Inherited from parent
                                                        (Locked)
                                                    </span>
                                                </div>
                                                {/* Hidden input to ensure the value is still sent with the form */}
                                                <input
                                                    type="hidden"
                                                    {...form.register(
                                                        'office_id',
                                                    )}
                                                />
                                            </div>
                                        ) : (
                                            // SELECTABLE STATE (New Program) - COMMAND DIALOG
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={
                                                        openOfficeCommand
                                                    }
                                                    className={cn(
                                                        'w-full justify-between px-3 text-left font-normal',
                                                        !field.value &&
                                                            'text-muted-foreground',
                                                    )}
                                                    onClick={() =>
                                                        setOpenOfficeCommand(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    {field.value ? (
                                                        <span className="truncate">
                                                            {
                                                                offices.find(
                                                                    (o) =>
                                                                        o.id.toString() ===
                                                                        field.value,
                                                                )?.name
                                                            }
                                                        </span>
                                                    ) : (
                                                        'Select implementing office...'
                                                    )}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>

                                                <CommandDialog
                                                    open={openOfficeCommand}
                                                    onOpenChange={
                                                        setOpenOfficeCommand
                                                    }
                                                >
                                                    <Command>
                                                        <CommandInput placeholder="Search office name..." />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                No office found.
                                                            </CommandEmpty>
                                                            <CommandGroup heading="Offices">
                                                                {offices.map(
                                                                    (
                                                                        office,
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                office.id
                                                                            }
                                                                            value={
                                                                                office.name
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    'office_id',
                                                                                    office.id.toString(),
                                                                                );
                                                                                setOpenOfficeCommand(
                                                                                    false,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <div className="flex w-full items-center justify-between">
                                                                                <span>
                                                                                    {
                                                                                        office.name
                                                                                    }
                                                                                </span>
                                                                                {field.value ===
                                                                                    office.id.toString() && (
                                                                                    <Check className="ml-2 h-4 w-4 opacity-100" />
                                                                                )}
                                                                            </div>
                                                                        </CommandItem>
                                                                    ),
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </CommandDialog>
                                            </>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* CODE SUFFIX & ACTIVE STATUS */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="code_suffix"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Suffix (Sequence)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. 001"
                                                    {...field}
                                                    maxLength={3}
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                3-digit code for the reference
                                                ID.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex h-full flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="cursor-pointer">
                                                    Active Entry
                                                </FormLabel>
                                                <FormDescription>
                                                    Only active PPAs can be
                                                    selected for annual budget
                                                    planning.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
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

                        {/* Hidden field to ensure type is always submitted */}
                        <input type="hidden" {...form.register('type')} />
                    </form>
                </Form>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" form="ppa-form">
                        {dialogMode === 'add' ? 'Create PPA' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
