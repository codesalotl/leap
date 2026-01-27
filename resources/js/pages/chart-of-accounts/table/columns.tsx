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
    account_number: string;
    account_title: string;
    account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO' | null;
    account_series: string;
    parent_id: number | null;
    level: number;
    is_postable: boolean;
    is_active: boolean;
    normal_balance: 'DEBIT' | 'CREDIT';
    description: string | null;
    created_at?: string | Date;
    updated_at?: string | Date;
    children?: ChartOfAccount[]; // For hierarchical structure
};

export const columns: ColumnDef<ChartOfAccount>[] = [
    {
        accessorKey: 'account_number',
        header: 'Account Number',
    },
    {
        accessorKey: 'account_title',
        header: 'Account Title',
        cell: ({ row }) => {
            const level = row.original.level;
            const isPostable = row.original.is_postable;
            const indent = (level - 1) * 24;
            
            return (
                <div style={{ paddingLeft: `${indent}px` }}>
                    {level > 1 && <span className="mr-2 text-gray-400">⤷</span>}
                    <span className={isPostable ? 'font-normal' : 'font-semibold'}>
                        {row.getValue('account_title')}
                    </span>
                    {!isPostable && (
                        <span className="ml-2 text-xs text-gray-500">(Header)</span>
                    )}
                </div>
            );
        },
    },
    // {
    //     accessorKey: 'account_type',
    //     header: 'Account Type',
    // },
    {
        accessorKey: 'expense_class',
        header: 'Expense Class',
        cell: ({ row }) => {
            const value = row.getValue('expense_class');
            return value || '-';
        },
    },
    // {
    //     accessorKey: 'account_series',
    //     header: 'Series',
    // },
    // {
    //     accessorKey: 'parent_id',
    //     header: 'Parent ID',
    //     cell: ({ row }) => {
    //         const value = row.getValue('parent_id');
    //         return value || '-';
    //     },
    // },
    {
        accessorKey: 'is_postable',
        header: 'Postable',
        cell: ({ row }) => {
            const value = row.getValue('is_postable');
            return value ? 'Yes' : 'No';
        },
    },
    {
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => {
            const value = row.getValue('is_active');
            return value ? 'Yes' : 'No';
        },
    },
    // {
    //     accessorKey: 'normal_balance',
    //     header: 'Normal Balance',
    // },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    // {
    //     accessorKey: 'created_at',
    //     header: 'Created At',
    //     cell: ({ row }) => {
    //         const value = row.getValue('created_at');
    //         return value ? new Date(value as string).toLocaleDateString() : '-';
    //     },
    // },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: ({ row }) => {
            const value = row.getValue('updated_at');
            return value ? new Date(value as string).toLocaleDateString() : '-';
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const account = row.original;

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
                                navigator.clipboard.writeText(account.account_number)
                            }
                        >
                            Copy account number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit account</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
