import { createColumnHelper } from '@tanstack/react-table'; // Added this import
import { router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import { summary } from '@/routes/aip';
import { PriceList } from '@/pages/types/types';
import { update } from '@/routes/aip/index';

// 1. Initialize the helper with your specific Data Type
const columnHelper = createColumnHelper<PriceList>();

// 2. Define columns using the helper methods
export const columns = [
    // Accessor Column
    columnHelper.accessor('item_number', {
        header: 'Item Number',
    }),

    // Accessor Column with Custom Cell
    columnHelper.accessor('description', {
        header: 'Description',
    }),
    columnHelper.accessor('unit_of_measurement', {
        header: 'Unit of Measurement',
    }),
    columnHelper.accessor('price', {
        header: 'Price',
    }),
    columnHelper.accessor('ppmp_category_id', {
        header: 'PPMP Category',
    }),
    columnHelper.accessor('chart_of_account_id', {
        header: 'Expense Account',
    }),

    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: (info) => {
            const value = info.getValue();

            if (!value)
                return <span className="text-muted-foreground">N/A</span>;

            return new Date(value).toLocaleString('en-US', {
                dateStyle: 'medium',
                // timeStyle: 'short',
            });
        },
    }),

    columnHelper.accessor('updated_at', {
        header: 'Updated At',
        cell: (info) => {
            const value = info.getValue();

            if (!value)
                return <span className="text-muted-foreground">N/A</span>;

            return new Date(value).toLocaleString('en-US', {
                dateStyle: 'medium',
                // timeStyle: 'short',
            });
        },
    }),

    // Display Column (Actions)
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => {
            const aip = row.original; // Access the full object

            const handleStatusChange = (newStatus: string) => {
                router.patch(update({ id: aip.id }), { status: newStatus });
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => router.visit(summary(aip.id).url)}
                        >
                            Open AIP Summary
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={aip.status === 'Open'}
                            onClick={() => handleStatusChange('Open')}
                        >
                            Mark as Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={aip.status === 'Closed'}
                            onClick={() => handleStatusChange('Closed')}
                        >
                            Mark as Closed
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];
