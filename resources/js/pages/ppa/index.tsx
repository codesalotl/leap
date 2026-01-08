import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getExpandedRowModel,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
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
import { type BreadcrumbItem } from '@/types';
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
import AipForm from '@/pages/aip-ppa/form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react'; // Ensure router is imported

type DialogMode = 'add' | 'edit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPA',
        href: '/ppa',
    },
];

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

interface Ppa {
    id: number;
    type: 'Program' | 'Project' | 'Activity'; // Using a Union for better type safety
    reference_code: string;
    description: string;
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    descendants: Ppa[]; // Recursive reference
}

interface Office {
    id: number;
    sector_id: number;
    lgu_level_id: 1 | 2 | 3;
    office_type_id: 1 | 2 | 3;
    office_number: number;
    title: string;
    full_code?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
}

interface PpaProps {
    ppa: Ppa[];
    offices: Office[];
}

export type Payment = {
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
};

export const columns: ColumnDef<Ppa>[] = [
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
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row, getValue }) => {
            return (
                <div
                    style={{
                        // Increase padding based on how deep the row is
                        paddingLeft: `${row.depth * 24}px`,
                    }}
                    className="flex items-center"
                >
                    {/* Visual indicator for children */}
                    {row.depth > 0 && (
                        <span className="mr-2 text-muted-foreground opacity-50">
                            ↳
                        </span>
                    )}
                    <span
                        className={
                            row.depth === 0 ? 'font-bold' : 'font-normal'
                        }
                    >
                        {getValue<string>()}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'reference_code',
        header: 'Reference Code',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'parent_id',
        header: 'Parent ID',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
    },
    {
        accessorKey: 'updated_at',
        header: 'Updated At',
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
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row, table }) => {
            const ppa = row.original;
            const meta = table.options.meta as {
                onAdd: (parent: Ppa, childType: 'Project' | 'Activity') => void;
                onEdit: (ppa: Ppa) => void;
                onDelete: (ppa: Ppa) => void; // Add this
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    ppa.reference_code,
                                )
                            }
                        >
                            Copy Reference Code
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Edit is common to all */}
                        <DropdownMenuItem onClick={() => meta.onEdit(ppa)}>
                            Edit {ppa.type}
                        </DropdownMenuItem>

                        {/* Conditional Add Child logic */}
                        {ppa.type === 'Program' && (
                            <DropdownMenuItem
                                onClick={() => meta.onAdd(ppa, 'Project')}
                            >
                                Add Project
                            </DropdownMenuItem>
                        )}
                        {ppa.type === 'Project' && (
                            <DropdownMenuItem
                                onClick={() => meta.onAdd(ppa, 'Activity')}
                            >
                                Add Activity
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => meta.onDelete(ppa)} // Trigger delete
                        >
                            Delete {ppa.type}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function Ppa({ ppa, offices }: PpaProps) {
    // console.log(Ppa);
    console.log(offices);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // New state
    const [dialogMode, setDialogMode] = useState<DialogMode>('add');
    const [activePpa, setActivePpa] = useState<Ppa | null>(null);
    const [targetType, setTargetType] = useState<
        'Program' | 'Project' | 'Activity'
    >('Program');
    const [ppaToDelete, setPpaToDelete] = useState<Ppa | null>(null); // Track item to delete

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState(''); // Add this state

    const table = useReactTable({
        data: ppa,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSubRows: (row) => row.descendants,
        // getRowCanExpand: (row) => true,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            expanded: true,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter, // Add this handler
        meta: {
            onAdd: (parent: Ppa, childType: 'Project' | 'Activity') => {
                setDialogMode('add');
                setActivePpa(parent);
                setTargetType(childType);
                setIsDialogOpen(true);
            },
            onEdit: (ppa: Ppa) => {
                setDialogMode('edit');
                setActivePpa(ppa);
                setTargetType(ppa.type);
                setIsDialogOpen(true);
            },
            onDelete: (ppa: Ppa) => {
                // New handler
                setPpaToDelete(ppa);
                setIsDeleteDialogOpen(true);
            },
        },
    });

    // console.log(table);

    const handleAddProgram = () => {
        setDialogMode('add');
        setActivePpa(null);
        setTargetType('Program');
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!ppaToDelete) return;

        router.delete(`/aip-ppa/${ppaToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setPpaToDelete(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Search reference code or description..."
                        value={(table.getState().globalFilter as string) ?? ''}
                        onChange={(event) =>
                            table.setGlobalFilter(event.target.value)
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

                        <Button onClick={handleAddProgram}>Add Program</Button>
                    </div>
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

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="w-11/12 max-w-none sm:max-w-7xl">
                        <DialogHeader>
                            <DialogTitle>
                                {dialogMode === 'add'
                                    ? `Add New ${targetType}`
                                    : `Edit ${targetType}: ${activePpa?.reference_code}`}
                            </DialogTitle>
                            <DialogDescription>
                                {dialogMode === 'add' && activePpa
                                    ? `Creating a ${targetType} under ${activePpa.description}`
                                    : `Update the details for this ${targetType.toLowerCase()}.`}
                            </DialogDescription>
                        </DialogHeader>

                        <AipForm
                            mode={dialogMode}
                            data={activePpa} // Pass activePpa as data
                            id={activePpa?.id} // Pass activePpa.id as the ID (Parent ID if adding, Record ID if editing)
                            onSuccess={() => setIsDialogOpen(false)}
                            offices={offices}
                        />

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            {/* form="ppa-form" triggers the submit handler in AipForm */}
                            <Button type="submit" form="ppa-form">
                                {dialogMode === 'add' ? 'Save' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Alert Dialog */}
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the{' '}
                                <strong>{ppaToDelete?.type}</strong>:
                                <span className="mt-2 block rounded bg-muted p-2 font-mono text-sm">
                                    {ppaToDelete?.reference_code} -{' '}
                                    {ppaToDelete?.description}
                                </span>
                                <span className="mt-2 block text-xs font-semibold text-destructive uppercase">
                                    Warning: Deleting this will also delete all
                                    nested projects and activities.
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setPpaToDelete(null)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/*<div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
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
            </div>*/}
            </div>
        </AppLayout>
    );
}
