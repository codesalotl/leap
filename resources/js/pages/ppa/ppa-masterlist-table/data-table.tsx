// resources\js\pages\ppa\ppa-masterlist-table\data-table.tsx

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta?: any; // Used for the onAdd/onEdit/onDelete callbacks
    children?: React.ReactNode;
}

const PINNED_COLUMN_COLORS = {
    header: {
        background: 'var(--primary)',
    },
    cell: {
        background: 'var(--background)',
        evenBackground: 'var(--muted)',
    },
};

const getCommonPinningStyles = <TData,>(
    column: Column<TData>,
    isHeaderCell = false,
    isEvenRow = false,
): CSSProperties => {
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
        width: column.getSize(),
        minWidth: column.columnDef.minSize,
        maxWidth: column.columnDef.maxSize,
        backgroundColor: isPinned
            ? isHeaderCell
                ? PINNED_COLUMN_COLORS.header.background
                : isEvenRow
                  ? PINNED_COLUMN_COLORS.cell.evenBackground
                  : PINNED_COLUMN_COLORS.cell.background
            : undefined,
    };
};

export function PpaDataTable<TData, TValue>({
    columns,
    data,
    meta,
    children,
}: DataTableProps<TData, TValue>) {
    const [value, setValue] = React.useState('');
    const [globalFilter, setGlobalFilter] = React.useState('');

    // Debounce Search
    React.useEffect(() => {
        const timeout = setTimeout(() => setGlobalFilter(value), 300);
        return () => clearTimeout(timeout);
    }, [value]);

    const table = useReactTable({
        data,
        columns,
        getSubRows: (row: any) => row.children ?? [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        filterFromLeafRows: true,
        globalFilterFn: 'includesString',
        onGlobalFilterChange: setGlobalFilter,
        state: {
            expanded: true,
            globalFilter,
        },
        meta,
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search Programs/Projects/Activities..."
                    className="max-w-sm"
                />

                <div>{children}</div>
            </div>

            <ScrollArea className="h-[calc(100vh-9rem)] rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="bg-primary font-bold text-primary-foreground"
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
                    <TableBody className="[&_tr:nth-child(even)]:bg-muted">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
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
            </ScrollArea>
        </div>
    );
}
