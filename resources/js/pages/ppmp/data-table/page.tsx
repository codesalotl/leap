import { createColumns, PpmpPriceList } from './columns';
import { DataTable } from './data-table';

type PpmpPriceListTableProps = {
    data: PpmpPriceList[];
    onEdit?: (item: PpmpPriceList) => void;
};

export default function PpmpPriceListTable({ data, onEdit }: PpmpPriceListTableProps) {
    const columns = createColumns(onEdit);
    return <DataTable columns={columns} data={data} />;
}
