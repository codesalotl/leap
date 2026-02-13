import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface PpmpPriceList {
    id: number;
    item_number: number;
    description: string;
    unit_of_measurement: string;
    price: string;
    chart_of_account_id: number;
    updated_at: string;
    created_at: string;
}

export const createColumns = (
    onEdit?: (item: PpmpPriceList) => void,
    onDelete?: (item: PpmpPriceList) => void,
): ColumnDef<PpmpPriceList>[] => [
    // {
    //     accessorKey: 'id',
    //     header: 'ID',
    // },
    {
        accessorKey: 'item_number',
        header: 'Item Number',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'unit_of_measurement',
        header: 'Unit of Measurement',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('price'));
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP',
            }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: 'chart_of_account_id',
        // header: 'Chart of Account ID',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDelete?.(item)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
