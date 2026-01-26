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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/ui/input-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';

type PpmpPriceListFormDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chartOfAccounts?: any[];
    editingItem?: PpmpPriceList | null;
    mode?: 'create' | 'edit';
};

const formSchema = z.object({
    item_code: z.string().min(1, 'Item code is required').max(50),
    item_description: z.string().min(1, 'Description is required').max(255),
    unit: z.string().min(1, 'Unit is required').max(20),
    unit_price: z.string().min(1, 'Price is required'),
    expense_class: z.enum(['PS', 'MOOE', 'FE', 'CO']),
    account_code: z.string().min(1, 'Account code is required'),
    procurement_type: z.enum(['Goods', 'Services', 'Civil Works', 'Consulting']),
    standard_specifications: z.string().optional(),
});

export default function PpmpPriceListFormDialog({
    open,
    onOpenChange,
    chartOfAccounts = [],
    editingItem = null,
    mode = 'create',
}: PpmpPriceListFormDialogProps) {
    const isEdit = mode === 'edit' && editingItem;
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item_code: '',
            item_description: '',
            unit: '',
            unit_price: '',
            expense_class: 'MOOE',
            account_code: '',
            procurement_type: 'Goods',
            standard_specifications: '',
        },
    });

    // Reset form when editingItem changes
    React.useEffect(() => {
        if (isEdit && editingItem) {
            form.reset({
                item_code: editingItem.item_code,
                item_description: editingItem.item_description,
                unit: editingItem.unit,
                unit_price: editingItem.unit_price?.toString() || '',
                expense_class: editingItem.expense_class,
                account_code: editingItem.account_code,
                procurement_type: editingItem.procurement_type,
                standard_specifications: editingItem.standard_specifications || '',
            });
        } else if (!isEdit) {
            // Reset to empty defaults for create mode
            form.reset({
                item_code: '',
                item_description: '',
                unit: '',
                unit_price: '',
                expense_class: 'MOOE',
                account_code: '',
                procurement_type: 'Goods',
                standard_specifications: '',
            });
        }
    }, [editingItem, isEdit, form]);

    // Reset form when dialog opens in create mode
    React.useEffect(() => {
        if (open && !isEdit) {
            form.reset({
                item_code: '',
                item_description: '',
                unit: '',
                unit_price: '',
                expense_class: 'MOOE',
                account_code: '',
                procurement_type: 'Goods',
                standard_specifications: '',
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
                                    {/* Row 1: Item Code + Item Description */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="item_code"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="item_code">Item Code</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="item_code"
                                                        placeholder="OFF-001"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="item_description"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="item_description">Item Description</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="item_description"
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

                                    {/* Row 2: Unit + Unit Price */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="unit"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="unit">Unit</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="unit"
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
                                            name="unit_price"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="unit_price">Unit Price</FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="unit_price"
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

                                    {/* Row 3: Expense Class + Account Code */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="expense_class"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="expense_class">Expense Class</FieldLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select expense class" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PS">PS</SelectItem>
                                                            <SelectItem value="MOOE">MOOE</SelectItem>
                                                            <SelectItem value="FE">FE</SelectItem>
                                                            <SelectItem value="CO">CO</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="account_code"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={fieldState.invalid}>
                                                    <FieldLabel htmlFor="account_code">Account Code</FieldLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select account code" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {chartOfAccounts.map((account) => (
                                                                <SelectItem key={account.account_code} value={account.account_code}>
                                                                    {account.account_code} - {account.account_title}
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

                                    {/* Row 4: Procurement Type + Specifications (2:1 ratio) */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <Controller
                                                name="procurement_type"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="procurement_type">Procurement Type</FieldLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Goods">Goods</SelectItem>
                                                                <SelectItem value="Services">Services</SelectItem>
                                                                <SelectItem value="Civil Works">Civil Works</SelectItem>
                                                                <SelectItem value="Consulting">Consulting</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <Controller
                                                name="standard_specifications"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel htmlFor="standard_specifications">Specifications</FieldLabel>
                                                        <InputGroup>
                                                            <InputGroupTextarea
                                                                {...field}
                                                                id="standard_specifications"
                                                                placeholder="Standard blue ballpoint pen"
                                                                rows={2}
                                                                className="min-h-16 resize-none"
                                                                aria-invalid={fieldState.invalid}
                                                            />
                                                        </InputGroup>
                                                        <FieldDescription>
                                                            Optional: Detailed specifications for the item.
                                                        </FieldDescription>
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                        </div>
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
