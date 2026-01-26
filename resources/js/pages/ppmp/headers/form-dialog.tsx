import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import * as React from 'react';
import * as z from 'zod';

const formSchema = z.object({
    aip_entry_id: z.string().min(1, 'AIP Entry is required'),
    office_id: z.string().min(1, 'Office is required'),
    procurement_type: z.enum(['Goods', 'Services', 'Civil Works', 'Consulting']),
    procurement_method: z.enum(['Public Bidding', 'Direct Purchase', 'Shopping', 'Limited Source Bidding', 'Negotiated Procurement']),
    implementation_schedule: z.string().optional(),
    source_of_funds: z.string().optional(),
    approved_budget: z.string().min(1, 'Approved budget is required'),
});

type PpmpHeaderFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aipEntries?: any[];
    offices?: any[];
    editingItem?: any;
    mode?: 'create' | 'edit';
};

export default function PpmpHeaderFormDialog({
    open,
    onOpenChange,
    aipEntries = [],
    offices = [],
    editingItem = null,
    mode = 'create',
}: PpmpHeaderFormDialogProps) {
    const isEdit = mode === 'edit' && editingItem;
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            aip_entry_id: '',
            office_id: '',
            procurement_type: 'Goods',
            procurement_method: 'Shopping',
            implementation_schedule: '',
            source_of_funds: '',
            approved_budget: '',
        },
    });

    // Reset form when editingItem changes
    React.useEffect(() => {
        if (isEdit && editingItem) {
            form.reset({
                aip_entry_id: editingItem.aip_entry_id?.toString() || '',
                office_id: editingItem.office_id?.toString() || '',
                procurement_type: editingItem.procurement_type || 'Goods',
                procurement_method: editingItem.procurement_method || 'Shopping',
                implementation_schedule: editingItem.implementation_schedule || '',
                source_of_funds: editingItem.source_of_funds || '',
                approved_budget: editingItem.approved_budget?.toString() || '',
            });
        } else if (!isEdit) {
            // Reset to empty defaults for create mode
            form.reset({
                aip_entry_id: '',
                office_id: '',
                procurement_type: 'Goods',
                procurement_method: 'Shopping',
                implementation_schedule: '',
                source_of_funds: '',
                approved_budget: '',
            });
        }
    }, [editingItem, isEdit, form]);

    // Reset form when dialog opens in create mode
    React.useEffect(() => {
        if (open && !isEdit) {
            form.reset({
                aip_entry_id: '',
                office_id: '',
                procurement_type: 'Goods',
                procurement_method: 'Shopping',
                implementation_schedule: '',
                source_of_funds: '',
                approved_budget: '',
            });
        }
    }, [open, isEdit, form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        if (isEdit) {
            router.put(`/ppmp-headers/${editingItem.id}`, data, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
                onError: (errors) => {
                    console.error('Error updating PPMP Header:', errors);
                },
            });
        } else {
            router.post('/ppmp-headers', data, {
                onSuccess: () => {
                    onOpenChange(false);
                    form.reset();
                },
                onError: (errors) => {
                    console.error('Error creating PPMP Header:', errors);
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit PPMP Header' : 'Create PPMP Header'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit 
                            ? 'Update the details for this PPMP Header.'
                            : 'Create a new PPMP Header for procurement planning.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="aip_entry_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>AIP Entry</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select AIP Entry" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {aipEntries.map((entry) => (
                                                    <SelectItem key={entry.id} value={entry.id.toString()}>
                                                        {entry.expected_output || `AIP Entry #${entry.id}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="office_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Office</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Office" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {offices.map((office) => (
                                                    <SelectItem key={office.id} value={office.id.toString()}>
                                                        {office.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="procurement_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Procurement Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Goods">Goods</SelectItem>
                                                <SelectItem value="Services">Services</SelectItem>
                                                <SelectItem value="Civil Works">Civil Works</SelectItem>
                                                <SelectItem value="Consulting">Consulting</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="procurement_method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Procurement Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Public Bidding">Public Bidding</SelectItem>
                                                <SelectItem value="Direct Purchase">Direct Purchase</SelectItem>
                                                <SelectItem value="Shopping">Shopping</SelectItem>
                                                <SelectItem value="Limited Source Bidding">Limited Source Bidding</SelectItem>
                                                <SelectItem value="Negotiated Procurement">Negotiated Procurement</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="implementation_schedule"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Implementation Schedule</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="date" 
                                                placeholder="Select date"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="approved_budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Approved Budget (₱)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="source_of_funds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Source of Funds</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="e.g., MOOE - Office Supplies"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Specify the source of funds for this procurement.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {isEdit ? 'Update PPMP Header' : 'Create PPMP Header'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
