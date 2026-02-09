import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ppmp } from '@/pages/types/types';
import { Decimal } from 'decimal.js';
import { Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface EditableCellProps {
    getValue: () => any;
    row: any;
    column: any;
}

const EditableCell: React.FC<EditableCellProps> = ({ getValue, row, column }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const [isUpdating, setIsUpdating] = useState(false);

    // Update local state if the server data changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleBlur = () => {
        if (value === initialValue || isUpdating) return;

        setIsUpdating(true);

        router.put(`/ppmp/${row.original.id}/update-monthly-quantity`, 
            {
                month: column.id,
                quantity: value,
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['ppmpItems'],
                onFinish: () => setIsUpdating(false),
                onError: () => {
                    setValue(initialValue); // Reset on error
                    setIsUpdating(false);
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            // className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent disabled:opacity-50"
            min="0"
            step="0.01"
        />
    );
};

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
        cell: EditableCell,
    },
    {
        accessorKey: 'jan_amount',
        header: 'JAN',
    },
    {
        accessorKey: 'feb_qty',
        header: 'FEB-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'feb_amount',
        header: 'FEB',
    },
    {
        accessorKey: 'mar_qty',
        header: 'MAR-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'mar_amount',
        header: 'MAR',
    },
    {
        accessorKey: 'apr_qty',
        header: 'APR-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'apr_amount',
        header: 'APR',
    },
    {
        accessorKey: 'may_qty',
        header: 'MAY-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'may_amount',
        header: 'MAY',
    },
    {
        accessorKey: 'jun_qty',
        header: 'JUN-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'jun_amount',
        header: 'JUN',
    },
    {
        accessorKey: 'jul_qty',
        header: 'JUL-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'jul_amount',
        header: 'JUL',
    },
    {
        accessorKey: 'aug_qty',
        header: 'AUG-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'aug_amount',
        header: 'AUG',
    },
    {
        accessorKey: 'sep_qty',
        header: 'SEP-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'sep_amount',
        header: 'SEP',
    },
    {
        accessorKey: 'oct_qty',
        header: 'OCT-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'oct_amount',
        header: 'OCT',
    },
    {
        accessorKey: 'nov_qty',
        header: 'NOV-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'nov_amount',
        header: 'NOV',
    },
    {
        accessorKey: 'dec_qty',
        header: 'DEC-QTY',
        cell: EditableCell,
    },
    {
        accessorKey: 'dec_amount',
        header: 'DEC',
    },
    {
        id: 'actions',
        size: 72,
        cell: ({ row, table }) => {
            const ppmp = row.original;

            return (
                <div className="flex justify-center">
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                            (table.options.meta as { onDelete: (item: Ppmp) => void })?.onDelete(ppmp)
                        }
                    >
                        <Trash />
                    </Button>
                </div>
            );
        },
    },
];
