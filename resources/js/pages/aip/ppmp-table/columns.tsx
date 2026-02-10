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

const EditableCell: React.FC<EditableCellProps> = ({
    getValue,
    row,
    column,
}) => {
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

        router.put(
            `/ppmp/${row.original.id}/update-monthly-quantity`,
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
            },
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            className="w-full rounded border bg-transparent px-2 py-1 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
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
        size: 350,
    },
    {
        accessorKey: 'ppmp_price_list.unit_of_measurement',
        header: 'Unit of Measurement',
    },
    {
        accessorKey: 'ppmp_price_list.price',
        header: () => <div className="w-full text-right">PRICELIST</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        id: 'cy_2026_qty',
        header: () => <div className="w-full text-right">CY 2026-QTY</div>,
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

            return <span className="block text-right">{totalQty.toFixed(2)}</span>;
        },
    },
    {
        id: 'total_amount',
        accessorKey: 'total_amount',
        header: () => <div className="w-full text-right">TOTAL</div>,
        accessorFn: (row) => {
            return new Decimal(row.jan_amount)
                .plus(row.feb_amount)
                .plus(row.mar_amount)
                .plus(row.apr_amount)
                .plus(row.may_amount)
                .plus(row.jun_amount)
                .plus(row.jul_amount)
                .plus(row.aug_amount)
                .plus(row.sep_amount)
                .plus(row.oct_amount)
                .plus(row.nov_amount)
                .plus(row.dec_amount);
        },
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue().toFixed(2)}</span>
        ),
        footer: (props) => {
            const rows = props.table.getFilteredRowModel().rows;

            const sum = rows.reduce((acc, row) => {
                const val = row.getValue('total_amount');
                // console.log('Value found:', val.toString());
                return acc.plus(val);
            }, new Decimal(0));

            return <span className="block text-right">{sum.toFixed(2)}</span>;
        },
    },
    {
        accessorKey: 'jan_qty',
        header: () => <div className="w-full text-right">JAN-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'jan_amount',
        header: () => <div className="w-full text-right">JAN</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'feb_qty',
        header: () => <div className="w-full text-right">FEB-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'feb_amount',
        header: () => <div className="w-full text-right">FEB</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'mar_qty',
        header: () => <div className="w-full text-right">MAR-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'mar_amount',
        header: () => <div className="w-full text-right">MAR</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'apr_qty',
        header: () => <div className="w-full text-right">APR-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'apr_amount',
        header: () => <div className="w-full text-right">APR</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'may_qty',
        header: () => <div className="w-full text-right">MAY-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'may_amount',
        header: () => <div className="w-full text-right">MAY</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'jun_qty',
        header: () => <div className="w-full text-right">JUN-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'jun_amount',
        header: () => <div className="w-full text-right">JUN</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'jul_qty',
        header: () => <div className="w-full text-right">JUL-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'jul_amount',
        header: () => <div className="w-full text-right">JUL</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'aug_qty',
        header: () => <div className="w-full text-right">AUG-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'aug_amount',
        header: () => <div className="w-full text-right">AUG</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'sep_qty',
        header: () => <div className="w-full text-right">SEP-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'sep_amount',
        header: () => <div className="w-full text-right">SEP</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'oct_qty',
        header: () => <div className="w-full text-right">OCT-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'oct_amount',
        header: () => <div className="w-full text-right">OCT</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'nov_qty',
        header: () => <div className="w-full text-right">NOV-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'nov_amount',
        header: () => <div className="w-full text-right">NOV</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        accessorKey: 'dec_qty',
        header: () => <div className="w-full text-right">DEC-QTY</div>,
        cell: EditableCell,
    },
    {
        accessorKey: 'dec_amount',
        header: () => <div className="w-full text-right">DEC</div>,
        cell: ({ getValue }) => (
            <span className="block text-right">{getValue()}</span>
        ),
    },
    {
        id: 'actions',
        size: 50,
        cell: ({ row, table }) => {
            const ppmp = row.original;

            return (
                <div className="flex justify-center">
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                            (
                                table.options.meta as {
                                    onDelete: (item: Ppmp) => void;
                                }
                            )?.onDelete(ppmp)
                        }
                    >
                        <Trash />
                    </Button>
                </div>
            );
        },
    },
];
