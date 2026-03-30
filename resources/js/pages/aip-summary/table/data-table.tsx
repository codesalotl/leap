import { useState, type ReactElement } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/pages/utils/column-pinning-styles';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    onAdd?: (record: TData) => void;
    onEdit?: (record: TData) => void;
    onDelete?: (record: TData) => void;
    children: ReactElement;
}

export default function DataTable<TData>({
    columns,
    data,
    onAdd,
    onEdit,
    onDelete,
    children,
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: { onAdd, onEdit, onDelete },
        enableColumnPinning: true,
        initialState: {
            columnPinning: { right: ['actions'] },
        },
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Filter aip summary..."
                    value={(table.getState().globalFilter as string) ?? ''}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-2">{children}</div>
            </div>

            <ScrollArea className="h-[calc(100vh-8rem)] rounded-md border">
                <Table style={{ tableLayout: 'fixed' }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <TableRow
                                key={headerGroup.id}
                                className="hover:bg-transparent"
                            >
                                {headerGroup.headers.map((header) => {
                                    const isTopRow = index === 0;
                                    const isGroup =
                                        header.column.columns.length > 0;

                                    /**
                                     * Logic:
                                     * 1. On the Top Row: Only render if it's a Group (has children).
                                     *    If it's a single column (AIP Code, etc.), render an empty cell.
                                     * 2. On the Bottom Row: Render the header.
                                     *    If the header is a placeholder (for single columns), we force it
                                     *    to render the actual column header.
                                     */
                                    let headerContent = null;

                                    if (isTopRow) {
                                        if (isGroup) {
                                            headerContent = flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            );
                                        }
                                    } else {
                                        // If it's the bottom row and not a group title container
                                        if (!isGroup) {
                                            headerContent = flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            );
                                        }
                                    }

                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                width: header.getSize(),
                                                ...getCommonPinningStyles(
                                                    header.column,
                                                ),
                                                backgroundColor:
                                                    'var(--primary)',
                                                color: 'var(--primary-foreground)',
                                                textAlign: 'center',
                                                zIndex: header.column.getIsPinned()
                                                    ? 30
                                                    : 1,
                                            }}
                                            className="h-10 border border-black px-2 font-bold"
                                        >
                                            {headerContent}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="group hover:bg-muted/50"
                            >
                                {row.getVisibleCells().map((cell) => {
                                    // List of column IDs that should span the whole group
                                    const spannedCols = [
                                        'full_code',
                                        'name',
                                        'office_acronym',
                                        'start_date',
                                        'end_date',
                                        'expected_output',
                                        'actions', // Added actions here
                                    ];

                                    const rowData = row.original as any;

                                    // Skip rendering if this is a spanned column but not the first row in the PPA group
                                    if (
                                        spannedCols.includes(cell.column.id) &&
                                        !rowData.isFirstInGroup
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <TableCell
                                            key={cell.id}
                                            // Apply vertical span
                                            rowSpan={
                                                spannedCols.includes(
                                                    cell.column.id,
                                                )
                                                    ? rowData.groupSize
                                                    : 1
                                            }
                                            style={{
                                                width: cell.column.getSize(),
                                                verticalAlign: 'top',
                                                ...getCommonPinningStyles(
                                                    cell.column,
                                                ),
                                                // Ensure spanned sticky cells stay on top of non-spanned scrolling cells
                                                zIndex: cell.column.getIsPinned()
                                                    ? 10
                                                    : 1,
                                            }}
                                            className="border bg-background p-2"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
