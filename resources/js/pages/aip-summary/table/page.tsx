import type { ReactElement } from 'react';
import { columns } from './columns';
import DataTable from './data-table';
import type { Ppa } from '@/types/global';

interface TablePageProps {
    data: Ppa[];
    onAdd: (record: Ppa) => void;
    onEdit: (record: Ppa) => void;
    onDelete: (record: Ppa) => void;
    children: ReactElement;
}

export default function TablePage({
    data,
    onAdd,
    onEdit,
    onDelete,
    children,
}: TablePageProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            {children}
        </DataTable>
    );
}
