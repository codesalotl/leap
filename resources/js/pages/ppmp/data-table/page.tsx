import { createColumns, PpmpPriceList } from './columns';
import { DataTable } from './data-table';

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

    return <DataTable columns={columns} data={data} />;
}
