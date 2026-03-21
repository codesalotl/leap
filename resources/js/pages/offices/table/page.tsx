import type { ReactElement } from 'react';
import { columns } from './columns';
import DataTable from './data-table';
import type { Office } from '@/types/global';

interface OfficeTablePageProps {
    data: Office[];
    onEdit: (record: Office) => void;
    onDelete: (record: Office) => void;
    children: ReactElement;
}

export default function OfficeTablePage({
    data,
    onEdit,
    onDelete,
    children,
}: OfficeTablePageProps) {
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
