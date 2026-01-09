// this is a table for the ppa and the budget in one

import * as React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Annual Investment Programs',
        href: '/aip',
    },
    {
        title: 'AIP Summary',
        href: '/aip-summary',
    },
];

const data: Payment[] = [
    {
        id: 'm5gr84i9',
        amount: 316,
        status: 'success',
        email: 'ken99@example.com',
    },
    {
        id: '3u1reuv4',
        amount: 242,
        status: 'success',
        email: 'Abe45@example.com',
    },
    {
        id: 'derv1ws0',
        amount: 837,
        status: 'processing',
        email: 'Monserrat44@example.com',
    },
    {
        id: '5kma53ae',
        amount: 874,
        status: 'success',
        email: 'Silas22@example.com',
    },
    {
        id: 'bhqecj4p',
        amount: 721,
        status: 'failed',
        email: 'carmella@example.com',
    },
];

export type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
};

interface AipEntry {
    id: number;
    aip_ref_code: number;
    ppa_desc: number;
    implementing_office_department: number;
    sched_implementation: {
        start_date: string;
        completion_date: string;
    };
    expected_outputs: string;
    funding_source: string;
    amount: {
        ps: string;
        mooe: string;
        fe: string;
        co: string;
        total: string;
    };
    amount_cc_expenditure: string;
    cc_adaptation: string;
    cc_mitigation: string;
    cc_typology_code: string;
    children?: AipEntry[];
}

interface AipSummaryTableProp {
    aip_entries: AipEntry[];
}

const columnHelper = createColumnHelper<AipEntry>();

const columns = [
    // 1. Display Column: Select Checkbox
    columnHelper.display({
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
    }),

    // 2. Accessor Columns: Data mapping
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('aip_ref_code', { header: 'Ref Code' }),
    columnHelper.accessor('ppa_desc', { header: 'PPA Description' }),
    columnHelper.accessor('implementing_office_department', {
        header: 'Department',
    }),

    columnHelper.group({
        header: 'Starting Date',
        columns: [
            columnHelper.accessor('sched_implementation.start_date', {
                header: 'Start Date',
            }),
            columnHelper.accessor('sched_implementation.completion_date', {
                header: 'Completion Date',
            }),
        ],
    }),

    columnHelper.accessor('expected_outputs', { header: 'Expected Outputs' }),
    columnHelper.accessor('funding_source', { header: 'Funding' }),

    // Nested amount object
    columnHelper.group({
        header: 'Amount',
        columns: [
            columnHelper.accessor('amount.ps', { header: 'PS' }),
            columnHelper.accessor('amount.mooe', { header: 'MOOE' }),
            columnHelper.accessor('amount.fe', { header: 'FE' }),
            columnHelper.accessor('amount.co', { header: 'CO' }),
            columnHelper.accessor('amount.total', { header: 'Total' }),
        ],
    }),

    columnHelper.accessor('amount_cc_expenditure', {
        header: 'CC Expenditure',
    }),
    columnHelper.accessor('cc_adaptation', { header: 'Adaptation' }),
    columnHelper.accessor('cc_mitigation', { header: 'Mitigation' }),
    columnHelper.accessor('cc_typology_code', { header: 'Typology Code' }),

    // 3. Display Column: Actions
    columnHelper.display({
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(payment.id)
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
    }),
];

export default function AipSummaryTable({ aip_entries }: AipSummaryTableProp) {
    console.log(aip_entries);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        columns,
        data: aip_entries,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSubRows: (row) => row.children,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            expanded: true,
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={
                            (table
                                .getColumn('email')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('email')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
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
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                className="border text-center font-bold"
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
