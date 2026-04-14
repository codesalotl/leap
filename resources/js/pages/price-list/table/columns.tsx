import { createColumnHelper } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PriceList } from '@/types/global';

const columnHelper = createColumnHelper<PriceList>();

const columns = [
    columnHelper.accessor('item_number', {
        header: 'Item Number',
        size: 80,
        cell: (value) => (
            <div className="break-words whitespace-normal">
                {value.getValue()}
            </div>
        ),
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        size: 300, // Increased size for better wrapping space
        cell: (value) => (
            <div className="py-1 leading-tight font-medium break-words whitespace-normal">
                {value.getValue()}
            </div>
        ),
    }),
    columnHelper.accessor('unit_of_measurement', {
        header: 'UOM',
        size: 100,
        cell: (value) => (
            <div className="whitespace-normal">{value.getValue()}</div>
        ),
    }),
    columnHelper.accessor('price', {
        header: () => (
            <div className="pr-8 text-end">
                <span>Price</span>
            </div>
        ),
        size: 120,
        cell: (value) => (
            <div className="pr-8 text-end">
                <span className="font-mono tabular-nums">
                    {value.getValue()}
                </span>
            </div>
        ),
    }),
    columnHelper.accessor('category.name', {
        header: 'PPMP Category',
        size: 180,
        cell: (value) => (
            <div className="leading-tight whitespace-normal">
                {value.getValue()}
            </div>
        ),
    }),
    columnHelper.accessor('chart_of_account.account_title', {
        header: 'Expense Account',
        size: 250,
        cell: (value) => (
            <div className="text-xs leading-tight break-words whitespace-normal text-muted-foreground">
                {value.getValue()}
            </div>
        ),
    }),
    columnHelper.display({
        id: 'action',
        size: 82,
        cell: ({ row, table }) => (
            <div className="flex items-center gap-1">
                <Button
                    size="icon"
                    variant="ghost" // Ghost is often cleaner in dense tables
                    onClick={() => table.options.meta?.onEdit?.(row.original)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => table.options.meta?.onDelete?.(row.original)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        ),
    }),
];

export default columns;
