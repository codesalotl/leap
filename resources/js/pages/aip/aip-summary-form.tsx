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
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal, Library, Search } from 'lucide-react';

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
import PpaImportModal from '@/pages/aip/ppa-import-modal';

export interface AipEntry {
    id: number;
    aip_ref_code: string;
    ppa_desc: string;
    implementing_office_department: string;
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
    fiscalYears: { id: number; year: number };
    aipEntries: AipEntry[];
    masterPpas: any[];
}

const columnHelper = createColumnHelper<AipEntry>();

const columns = [
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
    columnHelper.accessor('aip_ref_code', {
        header: 'Ref Code',
        cell: (info) => (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {info.getValue()}
            </code>
        ),
    }),
    columnHelper.accessor('ppa_desc', {
        header: 'PPA Description',
        cell: ({ row, getValue }) => (
            <div
                style={{ paddingLeft: `${row.depth * 20}px` }} // Indentation logic
                className="flex items-center gap-2"
            >
                {
                    row.depth > 0 &&
                        // <span className="font-mono text-muted-foreground opacity-50">
                        '↳'
                    // </span>
                }
                <div className="py-1">{getValue()}</div>
            </div>
        ),
    }),

    columnHelper.accessor('implementing_office_department', {
        header: 'Department',
        cell: (info) =>
            // <span className="text-[10px] font-semibold text-muted-foreground uppercase">
            info.getValue(),
        // </span>
    }),

    columnHelper.group({
        header: 'Schedule',
        columns: [
            columnHelper.accessor('sched_implementation.start_date', {
                header: 'Start',
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('sched_implementation.completion_date', {
                header: 'End',
                cell: (info) => info.getValue(),
            }),
        ],
    }),

    columnHelper.group({
        header: 'Budget Breakdown',
        columns: [
            columnHelper.accessor('amount.ps', { header: 'PS' }),
            columnHelper.accessor('amount.mooe', { header: 'MOOE' }),
            columnHelper.accessor('amount.fe', { header: 'FE' }),
            columnHelper.accessor('amount.co', { header: 'CO' }),
            columnHelper.accessor('amount.total', {
                header: 'Total',
                cell: (info) => info.getValue(),
            }),
        ],
    }),
    columnHelper.accessor('funding_source', { header: 'Source' }),
    columnHelper.display({
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const entry = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    entry.aip_ref_code,
                                )
                            }
                        >
                            Copy Ref Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            Remove from AIP
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];

export default function AipSummaryTable({
    fiscalYears,
    aipEntries,
    masterPpas,
}: AipSummaryTableProp) {
    console.log(fiscalYears);
    console.log(aipEntries);
    console.log(masterPpas);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary Form ${fiscalYears.year}`, href: '#' },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [isImportOpen, setIsImportOpen] = React.useState(false);

    const table = useReactTable({
        data: aipEntries,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSubRows: (row) => row.children, // Ensure children are processed
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getExpandedRowModel: getExpandedRowModel(), // Required for hierarchy
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            expanded: true, // Make sure it is expanded by default to see hierarchy
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="flex items-center justify-between py-4">
                    <div className="flex flex-1 items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter PPAs..."
                                value={
                                    (table
                                        .getColumn('ppa_desc')
                                        ?.getFilterValue() as string) ?? ''
                                }
                                onChange={(event) =>
                                    table
                                        .getColumn('ppa_desc')
                                        ?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm pl-8"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Columns{' '}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id.replace(/_/g, ' ')}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="default"
                            onClick={() => setIsImportOpen(true)}
                        >
                            <Library className="mr-2 h-4 w-4" />
                            Import from Library
                        </Button>
                    </div>
                </div>

                <PpaImportModal
                    isOpen={isImportOpen}
                    onClose={() => setIsImportOpen(false)}
                    ppaTree={masterPpas}
                    fiscalYearsId={fiscalYears.id}
                />

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="text-sm text-muted-foreground"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
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
                                        colSpan={table.getAllColumns().length}
                                    >
                                        No AIP entries found for fiscal year{' '}
                                        {fiscalYears.year}.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between py-4">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>
                    <div className="flex items-center space-x-2">
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
