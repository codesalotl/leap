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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//     id: string;
//     amount: number;
//     status: 'pending' | 'processing' | 'success' | 'failed';
//     email: string;
// };

export type ChartOfAccount = {
    id: number;
    account_code: string;
    account_title: string;
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    parent_code: string | null;
    is_postable: boolean;
    is_active: boolean;
    created_at?: string | Date;
    updated_at?: string | Date;
};

export const columns: ColumnDef<ChartOfAccount>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'account_code',
        header: 'Account Code',
    },
    {
        accessorKey: 'account_title',
        header: 'Account Title',
    },
    {
        accessorKey: 'expense_class',
        header: 'Expense Class',
    },
    {
        accessorKey: 'parent_code',
        header: 'Parent Code',
    },
    {
        accessorKey: 'is_postable',
        header: 'Is Postable',
    },
    {
        accessorKey: 'is_active',
        header: 'Is Active',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
    },
    {
        id: 'actions',
        cell: () => {
            // const payment = row.original;

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
                            onClick={() =>
                                // navigator.clipboard.writeText(payment.id)
                                console.log('clicked')
                            }
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
