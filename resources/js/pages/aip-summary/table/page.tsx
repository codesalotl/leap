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
    const flattenAipEntries = (ppas: Ppa[], depth = 0) => {
        const rows: any[] = [];

        ppas.forEach((ppa) => {
            const sources = ppa.ppa_funding_sources || [];
            const rowCount = Math.max(sources.length, 1);

            if (sources.length === 0) {
                rows.push({
                    ...ppa,
                    current_fs: null,
                    isFirstInGroup: true,
                    groupSize: 1,
                    depth,
                });
            } else {
                sources.forEach((fs, index) => {
                    rows.push({
                        ...ppa,
                        current_fs: fs,
                        isFirstInGroup: index === 0,
                        groupSize: rowCount,
                        depth,
                    });
                });
            }

            if (ppa.children && ppa.children.length > 0) {
                rows.push(...flattenAipEntries(ppa.children, depth + 1));
            }
        });

        return rows;
    };

    return (
        <DataTable
            columns={columns}
            data={flattenAipEntries(data)}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
        >
            {children}
        </DataTable>
    );
}
