import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
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
import { columns } from './columns';
import { Ppmp } from '@/pages/types/types';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface PpmpTableProps {
    ppmpItems: Ppmp[];
    onDelete: (item: Ppmp) => void;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDelete: (item: TData) => void;
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

const getCommonPinningStyles = (
    column: Column<any>,
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
        zIndex: isPinned ? 0 : 0,
        backgroundColor: isPinned
            ? isHeaderCell
                ? PINNED_COLUMN_COLORS.header.background
                : isEvenRow
                  ? PINNED_COLUMN_COLORS.cell.evenBackground
                  : PINNED_COLUMN_COLORS.cell.background
            : undefined,
    };
};

export default function PpmpTable({ ppmpItems, onDelete }: PpmpTableProps) {
    return (
        <div>
            <DataTable<Ppmp, unknown> columns={columns} data={ppmpItems} onDelete={onDelete} />
        </div>
    );
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onDelete,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            columnPinning: {
                right: ['actions'],
            },
        },
        enableColumnPinning: true,
        columnResizeMode: 'onChange',
        meta: {
            onDelete: (item: TData) => onDelete(item),
        },
    });

    return (
        // <div className="overflow-hidden rounded-md border">
        <ScrollArea className="h-[calc(100vh-10rem)] rounded-md border">
            <Table
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
                                        className="bg-primary font-bold text-primary-foreground"
                                        style={{
                                            ...getCommonPinningStyles(
                                                header.column,
                                                true,
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
                <TableBody className="[&_tr:nth-child(even)]:bg-muted">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="truncate" // Prevents long text from breaking widths
                                        style={{
                                            ...getCommonPinningStyles(
                                                cell.column,
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
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getVisibleLeafColumns().length}
                                className="h-24 text-center"
                            >
                                No PPMP items found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        // </div>
    );
}
