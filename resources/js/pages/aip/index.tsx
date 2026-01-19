import * as React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FiscalYearDialog from '@/pages/aip/fiscal-year-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import {
    ChevronDown,
    MoreHorizontal,
    BadgeCheckIcon,
    BadgeX,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Annual Investment Programs',
        href: '/aip',
    },
];

interface FiscalYear {
    id: number;
    year: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface AipProp {
    fiscalYears: FiscalYear[];
}

export const columns: ColumnDef<FiscalYear>[] = [
    {
        id: 'select',
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
                    variant={`${status === 'Open' ? 'secondary' : 'destructive'}`}
                    className="secondary text-white"
                >
                    {status === 'Open' ? <CheckCircle2 /> : <XCircle />}
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const data = row.original;
            const date = new Date(data.created_at);

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
            const data = row.original;
            const date = new Date(data.updated_at);

            return date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const aip = row.original;

            const handleStatusChange = (newStatus: string) => {
                router.patch(
                    `/aip/${aip.id}`,
                    { status: newStatus },
                    // {
                    //     preserveScroll: true,
                    // },
                );
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
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

                        {/* Status Toggle Sub-menu */}
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

export default function Aip({ fiscalYears }: AipProp) {
    // console.log(fiscalYears);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: fiscalYears,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Filter year..."
                        value={
                            (table
                                .getColumn('year')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('year')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value,
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* initialize aip form dialog */}
                        <FiscalYearDialog />
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="text-sm text-muted-foreground"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>

                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
