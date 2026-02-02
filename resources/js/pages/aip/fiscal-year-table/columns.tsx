import { ColumnDef } from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';

// Define the shape of your data
export interface FiscalYear {
    id: number;
    year: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export const columns: ColumnDef<FiscalYear>[] = [
    {
        id: 'select',
        size: 30,
        minSize: 30,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'year',
        header: 'Year',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    variant={`${status === 'Open' ? 'default' : 'destructive'}`}
                    className="secondary text-white"
                >
                    {status === 'Open' ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        },
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
        cell: ({ row }) => {
            const date = new Date(row.original.updated_at);
            return date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        },
    },
    {
        id: 'actions',
        size: 30,
        enableHiding: false,
        cell: ({ row }) => {
            const aip = row.original;

            const handleStatusChange = (newStatus: string) => {
                router.patch(`/aip/${aip.id}`, { status: newStatus });
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
                            onClick={() =>
                                router.visit(`/aip/${aip.id}/summary`)
                            }
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
    },
];
