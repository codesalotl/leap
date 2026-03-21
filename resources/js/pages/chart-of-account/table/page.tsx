import type { ReactElement } from 'react';
import { columns } from './columns';
import DataTable from './data-table';
import type { ChartOfAccount } from '@/types/global';

interface ChartOfAccountTablePageProps {
    data: ChartOfAccount[];
    onEdit: (record: ChartOfAccount) => void;
    onDelete: (record: ChartOfAccount) => void;
    children: ReactElement;
}

export default function ChartOfAccountTablePage({
    data,
    onEdit,
    onDelete,
    children,
}: ChartOfAccountTablePageProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            onEdit={onEdit}
            onDelete={onDelete}
            children={children}
        />
    );
}
