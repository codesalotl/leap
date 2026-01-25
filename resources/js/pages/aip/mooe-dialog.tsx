import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';
import { router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

/** * 1. Define the Schema and Types
 */
const formSchema = z.object({
    account_code: z.string().min(1, 'Account code is required'),
    item_description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
    unit_cost: z.number().min(0, 'Unit cost cannot be negative'),
});

type FormValues = z.infer<typeof formSchema>;

// Interfaces matching your Controller Mapping
export interface PpaItemizedCost {
    id: number;
    aip_entry_id: number;
    account_code: string;
    item_description: string;
    quantity: string | number;
    unit_cost: string | number;
    amount: string | number;
    chart_of_account?: ChartOfAccount;
}

export interface AipEntry {
    id: number;
    ppa_id: number;
    ppa_desc: string;
    itemized_costs?: PpaItemizedCost[];
    amount: {
        mooe: string | number;
        total: string | number;
    };
}

export interface ChartOfAccount {
    id: number;
    account_code: string;
    account_title: string;
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    is_postable: boolean;
}

interface MooeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry: AipEntry | null;
    chartOfAccounts: ChartOfAccount[];
}

export default function MooeDialog({
    open,
    onOpenChange,
    entry,
    chartOfAccounts,
}: MooeDialogProps) {
    // Initialize React Hook Form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_code: '',
            item_description: '',
            quantity: 1,
            unit_cost: 0,
        },
    });

    const mooeAccounts = React.useMemo(() => {
        return chartOfAccounts.filter(
            (acc) => acc.expense_class === 'MOOE' && acc.is_postable,
        );
    }, [chartOfAccounts]);

    const existingMooeItems = React.useMemo(() => {
        if (!entry?.itemized_costs) return [];
        return entry.itemized_costs.filter(
            (item) => item.chart_of_account?.expense_class === 'MOOE',
        );
    }, [entry]);

    // Live calculation for the UI
    const watchQty = form.watch('quantity');
    const watchPrice = form.watch('unit_cost');
    const calculatedTotal = (
        (watchQty || 0) * (watchPrice || 0)
    ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    /** * 2. Handle Submission
     */
    const onSubmit = (values: FormValues) => {
        if (!entry) return;

        router.post(`/aip-costing/${entry.id}`, values, {
            preserveScroll: true,
            // This ensures the page data is re-fetched after the post
            onSuccess: (page) => {
                form.reset({
                    ...form.getValues(),
                    item_description: '',
                    quantity: 1,
                    unit_cost: 0,
                });
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(`/aip-costing/${id}`, { preserveScroll: true });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Itemized MOOE Breakdown</DialogTitle>
                    <DialogDescription>
                        Project:{' '}
                        <span className="font-bold text-foreground">
                            {entry?.ppa_desc}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-3">
                    {/* LEFT SIDE: FORM */}
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 rounded-xl border bg-muted/30 p-4"
                    >
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase">
                            Add New Item
                        </h4>

                        {/* Account Code */}
                        <Controller
                            name="account_code"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Official Account Code</Label>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Select Account" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mooeAccounts.map((acc) => (
                                                <SelectItem
                                                    key={acc.id}
                                                    value={acc.account_code}
                                                >
                                                    <span className="mr-2 font-mono text-xs text-blue-600">
                                                        {acc.account_code}
                                                    </span>
                                                    {acc.account_title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && (
                                        <p className="text-[10px] text-destructive">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        {/* Description */}
                        <Controller
                            name="item_description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Item Description</Label>
                                    <Input
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. A4 Bond Paper"
                                    />
                                    {fieldState.error && (
                                        <p className="text-[10px] text-destructive">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="quantity"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            />
                            <Controller
                                name="unit_cost"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>Unit Cost</Label>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseFloat(
                                                        e.target.value,
                                                    ) || 0,
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border-2 border-dashed bg-background p-3">
                            <span className="text-xs font-bold text-muted-foreground uppercase">
                                Sub-total:
                            </span>
                            <span className="font-mono text-lg font-bold text-blue-600">
                                ₱ {calculatedTotal}
                            </span>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            Add Line Item
                        </Button>
                    </form>

                    {/* RIGHT SIDE: TABLE */}
                    <div className="overflow-hidden rounded-xl border md:col-span-2">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Account & Description</TableHead>
                                    <TableHead className="text-right">
                                        Qty/Cost
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total Amount
                                    </TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {existingMooeItems.length > 0 ? (
                                    existingMooeItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="text-xs font-bold">
                                                    {item.item_description}
                                                </div>
                                                <div className="font-mono text-[10px] text-muted-foreground uppercase">
                                                    {item.account_code} -{' '}
                                                    {
                                                        item.chart_of_account
                                                            ?.account_title
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[11px] text-muted-foreground">
                                                {item.quantity} ×{' '}
                                                {parseFloat(
                                                    item.unit_cost as string,
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs font-bold">
                                                ₱{' '}
                                                {parseFloat(
                                                    item.amount as string,
                                                ).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-48 text-center text-muted-foreground"
                                        >
                                            No MOOE items added yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex items-center justify-between border-t bg-muted/20 p-4">
                            <span className="text-sm font-bold uppercase">
                                Total MOOE:
                            </span>
                            <span className="font-mono text-lg font-black text-blue-700">
                                ₱{' '}
                                {parseFloat(
                                    (entry?.amount?.mooe as string) || '0',
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="-m-6 mt-2 border-t bg-muted/10 p-4">
                    <DialogClose asChild>
                        <Button variant="outline">Close Itemization</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
