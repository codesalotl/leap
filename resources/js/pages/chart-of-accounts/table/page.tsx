import { columns, ChartOfAccount } from './columns';
import { DataTable } from './data-table';

type ChartOfAccountsTableProps = {
    chartOfAccounts: ChartOfAccount[];
};

export default function ChartOfAccountsTable({
    chartOfAccounts,
}: ChartOfAccountsTableProps) {
    return (
        <div className="container py-4">
            <DataTable columns={columns} data={chartOfAccounts} />
        </div>
    );
}
