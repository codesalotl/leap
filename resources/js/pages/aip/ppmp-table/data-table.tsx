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

import { columns, Ppmp } from './columns';

interface PpmpTableProps {
    ppmpItems?: any[];
    selectedEntry?: any;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
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
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
        backgroundColor: isPinned ? 'var(--background)' : undefined,
    };
};

function getData(ppmpItems: any[] = []): Ppmp[] {
    return ppmpItems.map((item) => ({
        id: item.id.toString(),
        aip_entry_id: item.aip_entry_id,
        expense_account_id:
            item.expense_account_id ||
            item.ppmp_price_list?.chart_of_account_id,
        ppmp_price_list_id: item.ppmp_price_list_id,
        item_description:
            item.item_description ||
            item.ppmp_price_list?.description ||
            'Custom Item',
        quantity: parseFloat(item.quantity || 0),
        unit: item.unit || item.ppmp_price_list?.unit_of_measurement || 'unit',
        unit_price: parseFloat(item.unit_price || 0),
        total_amount: parseFloat(item.total_amount || 0),
        specifications: item.specifications,
        jan_qty: parseFloat(item.jan_qty || 0),
        jan_amount: parseFloat(item.jan_amount || 0),
        feb_qty: parseFloat(item.feb_qty || 0),
        feb_amount: parseFloat(item.feb_amount || 0),
        mar_qty: parseFloat(item.mar_qty || 0),
        mar_amount: parseFloat(item.mar_amount || 0),
        apr_qty: parseFloat(item.apr_qty || 0),
        apr_amount: parseFloat(item.apr_amount || 0),
        may_qty: parseFloat(item.may_qty || 0),
        may_amount: parseFloat(item.may_amount || 0),
        jun_qty: parseFloat(item.jun_qty || 0),
        jun_amount: parseFloat(item.jun_amount || 0),
        jul_qty: parseFloat(item.jul_qty || 0),
        jul_amount: parseFloat(item.jul_amount || 0),
        aug_qty: parseFloat(item.aug_qty || 0),
        aug_amount: parseFloat(item.aug_amount || 0),
        sep_qty: parseFloat(item.sep_qty || 0),
        sep_amount: parseFloat(item.sep_amount || 0),
        oct_qty: parseFloat(item.oct_qty || 0),
        oct_amount: parseFloat(item.oct_amount || 0),
        nov_qty: parseFloat(item.nov_qty || 0),
        nov_amount: parseFloat(item.nov_amount || 0),
        dec_qty: parseFloat(item.dec_qty || 0),
        dec_amount: parseFloat(item.dec_amount || 0),
        created_at: item.created_at,
        updated_at: item.updated_at,
    }));
}

export default function PpmpTable({
    ppmpItems = [],
    selectedEntry = null,
}: PpmpTableProps) {
    // // Filter PPMP items based on selected AIP entry
    // const filteredItems = selectedEntry
    //     ? ppmpItems.filter((item) => item.aip_entry_id === selectedEntry.id)
    //     : ppmpItems;

    // const data = getData(filteredItems);

    return (
        <div>
            <DataTable columns={columns} data={ppmpItems} />
        </div>
    );
}

export function DataTable<TData, TValue>({
    columns,
    data,
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
    });

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header: any) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            ...getCommonPinningStyles(
                                                header.column,
                                            ),
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
                        table.getRowModel().rows.map((row: any) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell: any) => (
                                    <TableCell 
                                        key={cell.id}
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
                                colSpan={table.getVisibleLeafColumns().length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
