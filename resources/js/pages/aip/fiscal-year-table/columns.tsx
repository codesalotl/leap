import { ColumnDef } from '@tanstack/react-table';
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
import { FiscalYear } from '@/pages/types/types';

export const columns: ColumnDef<FiscalYear>[] = [
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
    },
];
