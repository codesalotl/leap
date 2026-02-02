import { columns, ChartOfAccount } from './columns';
import DataTable from '@/components/ui/data-table';
import {
    // ColumnDef,
    // flexRender,
    getCoreRowModel,
    useReactTable,
    getExpandedRowModel,
} from '@tanstack/react-table';

type ChartOfAccountsTableProps = {
    chartOfAccounts: ChartOfAccount[];
};

export default function ChartOfAccountsTable({
    chartOfAccounts,
}: ChartOfAccountsTableProps) {
    const table = useReactTable({
        data: chartOfAccounts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.children,
        getRowCanExpand: (row) => true,
        state: {
            expanded: true, // must pass expanded state back to the table
        },
    });

    return (
        <div className="container py-4">
            <DataTable table={table} />
        </div>
    );
}
