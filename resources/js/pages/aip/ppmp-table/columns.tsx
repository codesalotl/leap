import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// This type is used to define the shape of our data.
export type Ppmp = {
    id: string;
    aip_entry_id: number;
    expense_account_id: number | null;
    ppmp_price_list_id: number | null;
    item_description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_amount: number;
    specifications: string | null;
    jan_qty: number;
    jan_amount: number;
    feb_qty: number;
    feb_amount: number;
    mar_qty: number;
    mar_amount: number;
    apr_qty: number;
    apr_amount: number;
    may_qty: number;
    may_amount: number;
    jun_qty: number;
    jun_amount: number;
    jul_qty: number;
    jul_amount: number;
    aug_qty: number;
    aug_amount: number;
    sep_qty: number;
    sep_amount: number;
    oct_qty: number;
    oct_amount: number;
    nov_qty: number;
    nov_amount: number;
    dec_qty: number;
    dec_amount: number;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<Ppmp>[] = [
    {
        accessorKey: 'expense_account_id',
        header: 'Expense Account',
        cell: ({ row }) => {
            const expenseAccountId = row.getValue('expense_account_id');
            return expenseAccountId ? `Account ${expenseAccountId}` : 'N/A';
        },
    },
    {
        accessorKey: 'ppmp_price_list_id',
        header: 'Item No.',
        cell: ({ row }) => {
            const priceListId = row.getValue('ppmp_price_list_id');
            return priceListId ? `PL-${priceListId}` : 'Custom';
        },
    },
    {
        accessorKey: 'item_description',
        header: 'Description',
    },
    {
        accessorKey: 'unit',
        header: 'Unit of Measurement',
    },
    {
        accessorKey: 'unit_price',
        header: 'PRICELIST',
    },
    {
        accessorKey: 'quantity',
        header: 'CY 2026-QTY',
    },
    {
        accessorKey: 'total_amount',
        header: 'TOTAL',
    },
    {
        accessorKey: 'jan_qty',
        header: 'JAN-QTY',
    },
    {
        accessorKey: 'jan_amount',
        header: 'JAN',
    },
    {
        accessorKey: 'feb_qty',
        header: 'FEB-QTY',
    },
    {
        accessorKey: 'feb_amount',
        header: 'FEB',
    },
    {
        accessorKey: 'mar_qty',
        header: 'MAR-QTY',
    },
    {
        accessorKey: 'mar_amount',
        header: 'MAR',
    },
    {
        accessorKey: 'apr_qty',
        header: 'APR-QTY',
    },
    {
        accessorKey: 'apr_amount',
        header: 'APR',
    },
    {
        accessorKey: 'may_qty',
        header: 'MAY-QTY',
    },
    {
        accessorKey: 'may_amount',
        header: 'MAY',
    },
    {
        accessorKey: 'jun_qty',
        header: 'JUN-QTY',
    },
    {
        accessorKey: 'jun_amount',
        header: 'JUN',
    },
    {
        accessorKey: 'jul_qty',
        header: 'JUL-QTY',
    },
    {
        accessorKey: 'jul_amount',
        header: 'JUL',
    },
    {
        accessorKey: 'aug_qty',
        header: 'AUG-QTY',
    },
    {
        accessorKey: 'aug_amount',
        header: 'AUG',
    },
    {
        accessorKey: 'sep_qty',
        header: 'SEP-QTY',
    },
    {
        accessorKey: 'sep_amount',
        header: 'SEP',
    },
    {
        accessorKey: 'oct_qty',
        header: 'OCT-QTY',
    },
    {
        accessorKey: 'oct_amount',
        header: 'OCT',
    },
    {
        accessorKey: 'nov_qty',
        header: 'NOV-QTY',
    },
    {
        accessorKey: 'nov_amount',
        header: 'NOV',
    },
    {
        accessorKey: 'dec_qty',
        header: 'DEC-QTY',
    },
    {
        accessorKey: 'dec_amount',
        header: 'DEC',
    },
    {
        id: 'actions',
        // header: 'Actions',
        cell: ({ row }) => {
            const ppmp = row.original;
            const [editOpen, setEditOpen] = useState(false);
            const [selectedMonth, setSelectedMonth] = useState('');
            const [quantity, setQuantity] = useState('');
            const [isUpdating, setIsUpdating] = useState(false);

            const months = [
                { value: 'jan', label: 'January' },
                { value: 'feb', label: 'February' },
                { value: 'mar', label: 'March' },
                { value: 'apr', label: 'April' },
                { value: 'may', label: 'May' },
                { value: 'jun', label: 'June' },
                { value: 'jul', label: 'July' },
                { value: 'aug', label: 'August' },
                { value: 'sep', label: 'September' },
                { value: 'oct', label: 'October' },
                { value: 'nov', label: 'November' },
                { value: 'dec', label: 'December' },
            ];

            const handleUpdate = async () => {
                if (!selectedMonth) {
                    alert('Please select a month');
                    return;
                }
                
                const qty = parseFloat(quantity);
                if (isNaN(qty) || qty < 0) {
                    alert('Please enter a valid quantity');
                    return;
                }

                setIsUpdating(true);
                
                try {
                    await router.put(
                        `/ppmp/${ppmp.id}/update-monthly-quantity`,
                        {
                            month: selectedMonth,
                            quantity: qty,
                        },
                        {
                            onSuccess: () => {
                                setEditOpen(false);
                                setSelectedMonth('');
                                setQuantity('');
                                alert('PPMP item updated successfully');
                            },
                            onError: (errors) => {
                                console.error('Error updating PPMP item:', errors);
                                alert('Error updating PPMP item: ' + JSON.stringify(errors));
                            },
                            onFinish: () => {
                                setIsUpdating(false);
                            },
                        }
                    );
                } catch (error) {
                    console.error('Update error:', error);
                    setIsUpdating(false);
                }
            };

            // Pre-fill quantity when month changes
            const handleMonthChange = (month: string) => {
                setSelectedMonth(month);
                const currentQty = ppmp[month + '_qty'] || 0;
                setQuantity(currentQty.toString());
            };

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(ppmp.id)}
                            >
                                Copy PPMP ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                Edit item
                            </DropdownMenuItem>

                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Update quantities</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                Delete item
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Edit Dialog */}
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit PPMP Item</DialogTitle>
                                <DialogDescription>
                                    {ppmp.item_description}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="month">Month</Label>
                                    <select
                                        id="month"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={selectedMonth}
                                        onChange={(e) => handleMonthChange(e.target.value)}
                                    >
                                        <option value="">Select month</option>
                                        {months.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="Enter quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        disabled={!selectedMonth}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditOpen(false);
                                        setSelectedMonth('');
                                        setQuantity('');
                                    }}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating...' : 'Update'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];
