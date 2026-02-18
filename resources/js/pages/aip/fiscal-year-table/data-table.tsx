import { useState, useEffect, ReactNode } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
    Column,
} from '@tanstack/react-table';
import { CSSProperties } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    children?: ReactNode;
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

export function FiscalYearDataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    children,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Reset filters and sorting when data changes
    useEffect(() => {
        setColumnFilters([]);
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
        enableColumnPinning: true,
        columnResizeMode: 'onChange',
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                {searchKey && (
                    <Input
                        placeholder={`Filter ${searchKey}...`}
                        value={
                            (table
                                .getColumn(searchKey)
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn(searchKey)
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}

                <div className="flex gap-2">{children}</div>
            </div>

            <ScrollArea className="h-[calc(100vh-9rem)] rounded-md border">
                <Table
                // className="fixed"
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const { column } = header;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="bg-primary font-bold text-primary-foreground"
                                            style={{
                                                ...getCommonPinningStyles(
                                                    column,
                                                    true,
                                                ),
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
                    <TableBody className="[&_tr:nth-child(even)]:bg-muted">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell, index) => {
                                        const { column } = cell;
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    ...getCommonPinningStyles(
                                                        column,
                                                        false,
                                                        index % 2 === 1,
                                                    ),
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        );
                                    })}
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
