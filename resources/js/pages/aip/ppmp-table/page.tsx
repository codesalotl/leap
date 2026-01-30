import { columns, Ppmp } from './columns';
// import { DataTable } from './data-table';
import DataTable from '@/components/ui/data-table';
import {
    // ColumnDef,
    // flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

interface PpmpTableProps {
    ppmpItems?: any[];
    selectedEntry?: any;
}

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
    // Filter PPMP items based on selected AIP entry
    const filteredItems = selectedEntry
        ? ppmpItems.filter((item) => item.aip_entry_id === selectedEntry.id)
        : ppmpItems;

    const data = getData(filteredItems);

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
        <div>
            <DataTable table={table} />
        </div>
    );
}
