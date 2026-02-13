import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { PpmpPriceList } from "@/pages/ppmp/data-table/columns";

type ChartOfAccount = {
    id: number;
    account_number: string;
    account_title: string;
    account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    account_series: string;
    parent_id: number;
    level: number;
    is_postable: boolean;
    is_active: boolean;
    normal_balance: 'DEBIT' | 'CREDIT';
    description: string;
    created_at: string;
    updated_at: string;
};


type PpmpPriceListFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chartOfAccounts: ChartOfAccount[];
    editingItem: PpmpPriceList | null;
    mode: 'create' | 'edit';
};

const formSchema = z.object({
    item_number: z.number().min(1, 'Item number is required'),
    description: z.string().min(1, 'Description is required').max(255),
    unit_of_measurement: z.string().min(1, 'Unit is required').max(20),
    price: z.string().min(1, 'Price is required'),
    chart_of_account_id: z.number().min(1, 'Chart of account is required'),
});

export default function PpmpPriceListFormDialog({
    open,
    onOpenChange,
    chartOfAccounts,
    editingItem,
    mode,
}: PpmpPriceListFormDialogProps) {
    const isEdit = mode === 'edit' && editingItem;
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_number: 0,
            description: '',
            unit_of_measurement: '',
            price: '',
            chart_of_account_id: 0,
        },
    });

    // Reset form when editingItem changes
    React.useEffect(() => {
        if (isEdit && editingItem) {
            form.reset({
                item_number: editingItem.item_number,
                description: editingItem.description,
                unit_of_measurement: editingItem.unit_of_measurement,
                price: editingItem.price,
                chart_of_account_id: editingItem.chart_of_account_id,
            });
        } else if (!isEdit) {
            // Reset to empty defaults for create mode
            form.reset({
                item_number: 0,
                description: '',
                unit_of_measurement: '',
                price: '',
                chart_of_account_id: 0,
            });
        }
    }, [editingItem, isEdit, form]);

    // Reset form when dialog opens in create mode
    React.useEffect(() => {
        if (open && !isEdit) {
            form.reset({
                item_number: 0,
                description: '',
                unit_of_measurement: '',
                price: '',
                chart_of_account_id: 0,
            });
        }
    }, [open, isEdit, form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        if (isEdit) {
            router.put(`/ppmp-price-list/${editingItem.id}`, data, {
                onSuccess: () => {
                    toast.success('PPMP Price List item updated successfully!');
                    onOpenChange(false);
                    form.reset();
                },
                onError: (errors) => {
                    toast.error('Error updating item');
                    console.error(errors);
                },
            });
        } else {
            router.post('/ppmp-price-list', data, {
                onSuccess: () => {
                    toast.success('PPMP Price List item created successfully!');
                    onOpenChange(false);
                    form.reset();
                },
                onError: (errors) => {
                    toast.error('Error creating item');
                    console.error(errors);
                },
            });
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Edit PPMP Price List Item' : 'Create PPMP Price List Item'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit 
                                ? 'Update the details for this price list item.'
                                : 'Add a new item to the PPMP price list catalog.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>PPMP Price List Item</CardTitle>
                            <CardDescription>
                                Enter the details for the new price list item.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="ppmp-form" onSubmit={form.handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    {/* Row 1: Item Number + Description */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="item_number"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="item_number">Item Number</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="item_number"
                                                        type="number"
                                                        placeholder="1"
                                                        aria-invalid={fieldState.invalid}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="description"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="description"
                                                        placeholder="Ballpen (Blue)"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    {/* Row 2: Unit of Measurement + Price */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="unit_of_measurement"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="unit_of_measurement">Unit of Measurement</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="unit_of_measurement"
                                                        placeholder="pcs"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="price"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="price">Price</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="15.00"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    {/* Row 3: Chart of Account */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <Controller
                                            name="chart_of_account_id"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="chart_of_account_id">Chart of Account</FieldLabel>
                                                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value ? field.value.toString() : ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select chart of account" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {chartOfAccounts.map((account) => (
                                                                <SelectItem key={account.id} value={account.id.toString()}>
                                                                    {account.account_number} - {account.account_title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="ppmp-form">
                            {isEdit ? 'Update Item' : 'Create Item'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
