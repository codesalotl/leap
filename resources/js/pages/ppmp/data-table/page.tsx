import { createColumns, PpmpPriceList } from './columns';
// import { DataTable } from './data-table';
import DataTable from '@/components/ui/data-table';
import {
    // ColumnDef,
    // flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

type PpmpPriceListTableProps = {
    data: PpmpPriceList[];
    onEdit?: (item: PpmpPriceList) => void;
    onDelete?: (item: PpmpPriceList) => void;
};

export default function PpmpPriceListTable({
    data,
    onEdit,
    onDelete,
}: PpmpPriceListTableProps) {
    const columns = createColumns(onEdit, onDelete);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return <DataTable table={table} />;
}
