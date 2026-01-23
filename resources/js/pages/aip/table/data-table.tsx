import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[]; // Changed from 'descendants' to 'data' to match standard naming
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // 1. ADD THE META SECTION HERE
        // This is what the 'Add' button in columns.tsx calls
        meta: {
            onSelectPpa: (ppa: any) => {
                console.log('Item selected from library:', ppa);

                // 2. TRIGGER THE SAVE LOGIC
                // This sends the selected master PPA to your Laravel controller
                // to be added as a new entry in the AIP Summary
                router.post(
                    '/aip-entries',
                    {
                        ppa_id: ppa.id, // The ID from the master library
                        // Add other defaults if necessary
                    },
                    {
                        onSuccess: () => {
                            console.log('Successfully added to AIP Summary');
                        },
                        preserveScroll: true,
                    },
                );
            },
        },
    });

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader className="bg-muted/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-xs font-semibold uppercase"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
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
                                data-state={row.getIsSelected() && 'selected'}
                                className="transition-colors hover:bg-muted/30"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
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
                                className="h-24 text-center text-muted-foreground"
                            >
                                No items found in the library for this level.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
