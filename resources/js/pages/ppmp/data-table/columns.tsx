import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
    item_code: string;
    item_description: string;
    unit: string;
    /** * Represented as string to maintain precision from decimal(10,2)
     * or number if you handle conversion in the API transformer.
     */
    unit_price: string | number;
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    account_code: string;
    procurement_type: 'Goods' | 'Services' | 'Civil Works' | 'Consulting';
    standard_specifications: string | null;
    updated_at: string; // ISO Timestamp
    created_at: string; // ISO Timestamp
}

export const createColumns = (onEdit?: (item: PpmpPriceList) => void): ColumnDef<PpmpPriceList>[] => [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'item_code',
        header: 'Item Code',
    },
    {
        accessorKey: 'item_description',
        header: 'Item Description',
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
    },
    {
        accessorKey: 'unit_price',
        header: 'Unit Price',
    },
    {
        accessorKey: 'expense_class',
        header: 'Expense Class',
    },
    {
        accessorKey: 'account_code',
        header: 'Account Code',
    },
    {
        accessorKey: 'procurement_type',
        header: 'Procurement Type',
    },
    {
        accessorKey: 'standard_specifications',
        header: 'Specifications',
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Updated',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const item = row.original

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(item.id.toString())}
                        >
                            Copy item ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit item
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => {
                                // TODO: Delete item
                                console.log('Delete item:', item)
                            }}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete item
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
