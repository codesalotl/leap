import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import * as React from 'react';
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

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Offices',
        href: '/office',
    },
];

interface Office {
    id: number;
    sector_id: number;
    lgu_level_id: number;
    office_type_id: number;
    code: string;
    name: string;
    is_lee: boolean;
    sector?: { code: string };
    lgu_level?: { code: string };
    office_type?: { code: string };
    created_at: string;
    updated_at: string;
}

interface OfficesProp {
    offices: Office[];
}

// const data: Payment[] = [
//     {
//         id: 'm5gr84i9',
//         amount: 316,
//         status: 'success',
//         email: 'ken99@example.com',
//     },
//     {
//         id: '3u1reuv4',
//         amount: 242,
//         status: 'success',
//         email: 'Abe45@example.com',
//     },
//     {
//         id: 'derv1ws0',
//         amount: 837,
//         status: 'processing',
//         email: 'Monserrat44@example.com',
//     },
//     {
//         id: '5kma53ae',
//         amount: 874,
//         status: 'success',
//         email: 'Silas22@example.com',
//     },
//     {
//         id: 'bhqecj4p',
//         amount: 721,
//         status: 'failed',
//         email: 'carmella@example.com',
//     },
// ];

// export type Payment = {
//     id: string;
//     amount: number;
//     status: 'pending' | 'processing' | 'success' | 'failed';
//     email: string;
// };

export const columns: ColumnDef<Office>[] = [
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
        id: 'full_code',
        header: 'Office Account Code',
        cell: ({ row }) => {
            const office = row.original;

            // Extract codes or default to zeros if missing
            const sector = office.sector?.code ?? '0000';
            const subsector = '000'; // Hardcoded as requested
            const lgu = office.lgu_level?.code ?? '0';
            const type = office.office_type?.code ?? '00';
            const officeCode = office.code ?? '000';

            return (
                <code className="font-mono text-xs">{`${sector}-${subsector}-${lgu}-${type}-${officeCode}`}</code>
            );
        },
    },
    // {
    //     accessorKey: 'sector_id',
    // },
    // {
    //     accessorKey: 'lgu_level_id',
    // },
    // {
    //     accessorKey: 'office_type_id',
    // },
    // {
    //     accessorKey: 'code',
    // },
    {
        accessorKey: 'name',
    },
    {
        accessorKey: 'is_lee',
        header: 'LEE',
        cell: ({ row }) => (
            <span
                className={`rounded-full px-2 py-1 text-xs ${row.getValue('is_lee') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
            >
                {row.getValue('is_lee') ? 'Yes' : 'No'}
            </span>
        ),
    },
    {
        accessorKey: 'created_at',
        cell: ({ getValue }) => {
            const date = new Date(getValue());
            return date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        },
    },
    {
        accessorKey: 'updated_at',
        cell: ({ getValue }) => {
            const date = new Date(getValue());
            return date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        },
    },
    // {
    //     accessorKey: 'status',
    //     header: 'Status',
    //     cell: ({ row }) => (
    //         <div className="capitalize">{row.getValue('status')}</div>
    //     ),
    // },
    // {
    //     accessorKey: 'email',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() =>
    //                     column.toggleSorting(column.getIsSorted() === 'asc')
    //                 }
    //             >
    //                 Email
    //                 <ArrowUpDown />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="lowercase">{row.getValue('email')}</div>
    //     ),
    // },
    // {
    //     accessorKey: 'amount',
    //     header: () => <div className="text-right">Amount</div>,
    //     cell: ({ row }) => {
    //         const amount = parseFloat(row.getValue('amount'));
    //         // Format the amount as a dollar amount
    //         const formatted = new Intl.NumberFormat('en-US', {
    //             style: 'currency',
    //             currency: 'USD',
    //         }).format(amount);
    //         return <div className="text-right font-medium">{formatted}</div>;
    //     },
    // },
    // {
    //     id: 'actions',
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         const payment = row.original;
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() =>
    //                             navigator.clipboard.writeText(payment.id)
    //                         }
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem>View customer</DropdownMenuItem>
    //                     <DropdownMenuItem>
    //                         View payment details
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Office</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

export default function Offices({ offices }: OfficesProp) {
    console.log(offices);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const table = useReactTable({
        data: offices,
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
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter offices..."
                        value={
                            (table
                                .getColumn('name')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('name')
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

                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button>Add Office</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name-1">Name</Label>
                                        <Input
                                            id="name-1"
                                            name="name"
                                            defaultValue="Pedro Duarte"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="username-1">
                                            Username
                                        </Label>
                                        <Input
                                            id="username-1"
                                            name="username"
                                            defaultValue="@peduarte"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
