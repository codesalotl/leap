import { columns, PpmpPriceList } from './columns';
import { DataTable } from './data-table';

type PpmpPriceListTableProps = {
    data: PpmpPriceList[];
};

export default function PpmpPriceListTable({ data }: PpmpPriceListTableProps) {
    return <DataTable columns={columns} data={data} />;
}
