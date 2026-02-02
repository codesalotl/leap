// resources\js\pages\aip\aip-summary-table\data-table.tsx

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
    Column,
} from '@tanstack/react-table';
import { CSSProperties } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
    Table as UITable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    children?: React.ReactNode;
    getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
    emptyMessage?: string;
}

const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-1px 0 0 0 var(--muted) inset'
            : isFirstRightPinnedColumn
              ? '1px 0 0 0 var(--muted) inset'
              : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        // --- CRITICAL FIX ---
        // Ensure we use the calculated size from TanStack
        width: column.getSize(),
        minWidth: column.columnDef.minSize,
        maxWidth: column.columnDef.maxSize,
        // --------------------
        zIndex: isPinned ? 1 : 0,
        backgroundColor: isPinned ? 'var(--background)' : undefined,
    };
};

export default function DataTable<TData, TValue>({
    columns,
    data,
    searchKey = 'ppa_desc',
    children,
    getSubRows,
    emptyMessage = 'No results.',
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [expanded, setExpanded] = React.useState<ExpandedState>(true);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            expanded,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows,
        filterFromLeafRows: true,
        maxLeafRowFilterDepth: 100,
        enableColumnPinning: true,
        initialState: {
            columnPinning: { right: ['actions'] },
        },
        columnResizeMode: 'onChange',
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                {searchKey && (
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects or activities..."
                            value={
                                (table
                                    .getColumn(searchKey)
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(event) =>
                                table
                                    .getColumn(searchKey)
                                    ?.setFilterValue(
                                        event.target.value || undefined,
                                    )
                            }
                            className="max-w-sm pl-8"
                        />
                    </div>
                )}
                <div className="ml-auto flex gap-2">{children}</div>
            </div>

            <div className="overflow-x-auto rounded-md border">
                {/* ADD 'table-fixed' and explicitly set the width 
                   based on the total table width to ensure sizing is respected.
                */}
                <UITable
                    style={{
                        width: table.getTotalSize(),
                        tableLayout: 'fixed',
                    }}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                ...getCommonPinningStyles(
                                                    header.column,
                                                ),
                                                // Handle width for grouped headers
                                                width: header.getSize(),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
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
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="truncate" // Prevents long text from breaking widths
                                            style={{
                                                ...getCommonPinningStyles(
                                                    cell.column,
                                                ),
                                            }}
                                        >
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
                                    colSpan={
                                        table.getVisibleLeafColumns().length
                                    }
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </UITable>
            </div>
        </div>
    );
}
