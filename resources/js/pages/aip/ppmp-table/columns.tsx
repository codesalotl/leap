import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Ppmp } from '@/pages/types/types';
import { Decimal } from 'decimal.js';
import { Pencil, Trash } from 'lucide-react';

export const columns: ColumnDef<Ppmp>[] = [
    {
        accessorKey: 'ppmp_price_list.chart_of_account_id',
        header: 'Expense Account',
    },
    {
        accessorKey: 'ppmp_price_list.item_number',
        header: 'Item No.',
    },
    {
        accessorKey: 'ppmp_price_list.description',
        header: 'Description',
    },
    {
        accessorKey: 'ppmp_price_list.unit_of_measurement',
        header: 'Unit of Measurement',
    },
    {
        accessorKey: 'ppmp_price_list.price',
        header: 'PRICELIST',
    },
    {
        id: 'cy_2026_qty',
        header: 'CY 2026-QTY',
        cell: ({ row }) => {
            const ppmp = row.original;

            const totalQty = new Decimal(ppmp.jan_qty)
                .plus(ppmp.feb_qty)
                .plus(ppmp.mar_qty)
                .plus(ppmp.apr_qty)
                .plus(ppmp.may_qty)
                .plus(ppmp.jun_qty)
                .plus(ppmp.jul_qty)
                .plus(ppmp.aug_qty)
                .plus(ppmp.sep_qty)
                .plus(ppmp.oct_qty)
                .plus(ppmp.nov_qty)
                .plus(ppmp.dec_qty);

            return totalQty.toFixed(2);
        },
    },
    {
        accessorKey: 'total_amount',
        header: 'TOTAL',
        cell: ({ row }) => {
            const ppmp = row.original;

            const totalAmount = new Decimal(ppmp.jan_amount)
                .plus(ppmp.feb_amount)
                .plus(ppmp.mar_amount)
                .plus(ppmp.apr_amount)
                .plus(ppmp.may_amount)
                .plus(ppmp.jun_amount)
                .plus(ppmp.jul_amount)
                .plus(ppmp.aug_amount)
                .plus(ppmp.sep_amount)
                .plus(ppmp.oct_amount)
                .plus(ppmp.nov_amount)
                .plus(ppmp.dec_amount);

            return totalAmount.toFixed(2);
        },
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
        size: 72,
        cell: ({ row, table }) => {
            const ppmp = row.original;

            // const [editOpen, setEditOpen] = useState(false);
            // const [selectedMonth, setSelectedMonth] = useState('');
            // const [quantity, setQuantity] = useState('');
            // const [isUpdating, setIsUpdating] = useState(false);
            // const [isDeleting, setIsDeleting] = useState(false);

            // const months = [
            //     { value: 'jan', label: 'January' },
            //     { value: 'feb', label: 'February' },
            //     { value: 'mar', label: 'March' },
            //     { value: 'apr', label: 'April' },
            //     { value: 'may', label: 'May' },
            //     { value: 'jun', label: 'June' },
            //     { value: 'jul', label: 'July' },
            //     { value: 'aug', label: 'August' },
            //     { value: 'sep', label: 'September' },
            //     { value: 'oct', label: 'October' },
            //     { value: 'nov', label: 'November' },
            //     { value: 'dec', label: 'December' },
            // ];

            // const handleUpdate = async () => {
            //     if (!selectedMonth) {
            //         alert('Please select a month');
            //         return;
            //     }

            //     const qty = parseFloat(quantity);
            //     if (isNaN(qty) || qty < 0) {
            //         alert('Please enter a valid quantity');
            //         return;
            //     }

            //     setIsUpdating(true);

            //     try {
            //         await router.put(
            //             `/ppmp/${ppmp.id}/update-monthly-quantity`,
            //             {
            //                 month: selectedMonth,
            //                 quantity: qty,
            //             },
            //             {
            //                 onSuccess: () => {
            //                     setEditOpen(false);
            //                     setSelectedMonth('');
            //                     setQuantity('');
            //                     alert('PPMP item updated successfully');
            //                 },
            //                 onError: (errors) => {
            //                     console.error(
            //                         'Error updating PPMP item:',
            //                         errors,
            //                     );
            //                     alert(
            //                         'Error updating PPMP item: ' +
            //                             JSON.stringify(errors),
            //                     );
            //                 },
            //                 onFinish: () => {
            //                     setIsUpdating(false);
            //                 },
            //             },
            //         );
            //     } catch (error) {
            //         console.error('Update error:', error);
            //         setIsUpdating(false);
            //     }
            // };

            // const handleDelete = async () => {
            //     if (
            //         !confirm(
            //             'Are you sure you want to delete this PPMP item? This action cannot be undone.',
            //         )
            //     ) {
            //         return;
            //     }

            //     setIsDeleting(true);

            //     try {
            //         await router.delete(`/ppmp/${ppmp.id}`, {
            //             onSuccess: () => {
            //                 alert('PPMP item deleted successfully');
            //             },
            //             onError: (errors) => {
            //                 console.error('Error deleting PPMP item:', errors);
            //                 alert(
            //                     'Error deleting PPMP item: ' +
            //                         JSON.stringify(errors),
            //                 );
            //             },
            //             onFinish: () => {
            //                 setIsDeleting(false);
            //             },
            //         });
            //     } catch (error) {
            //         console.error('Delete error:', error);
            //         setIsDeleting(false);
            //     }
            // };

            // // Pre-fill quantity when month changes
            // const handleMonthChange = (month: string) => {
            //     setSelectedMonth(month);
            //     const currentQty = ppmp[month + '_qty'] || 0;
            //     setQuantity(currentQty.toString());
            // };

            return (
                <div className="flex justify-between">
                    <Button
                        size="icon-xs"
                        onClick={() =>
                            (table.options.meta as { setOpen: (item: Ppmp) => void; onDelete: (item: Ppmp) => void })?.setOpen(ppmp)
                        }
                    >
                        <Pencil />
                    </Button>
                    <Button
                        size="icon-xs"
                        variant="destructive"
                        onClick={() =>
                            (table.options.meta as { setOpen: (item: Ppmp) => void; onDelete: (item: Ppmp) => void })?.onDelete(ppmp)
                        }
                    >
                        <Trash />
                    </Button>
                </div>
            );
        },
    },
];
