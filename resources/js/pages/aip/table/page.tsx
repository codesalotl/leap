import type { ReactElement } from 'react';
import { columns } from './columns';
import DataTable from './data-table';
import type { FiscalYear } from '@/types/global';

interface FiscalYearTablePageProps {
    data: FiscalYear[];
    onEdit: (record: FiscalYear) => void;
    onDelete: (record: FiscalYear) => void;
    children: ReactElement;
}

export default function FiscalYearTablePage({
    data,
    onEdit,
    onDelete,
    children,
}: FiscalYearTablePageProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            {children}
        </DataTable>
    );
}
