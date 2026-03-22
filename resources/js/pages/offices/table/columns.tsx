import type { RowData } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { Office } from '@/types/global';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        onEdit?: (record: TData) => void;
        onDelete?: (record: TData) => void;
    }
}

const columnHelper = createColumnHelper<Office>();

export const columns = [
    columnHelper.display({
        id: 'full_code',
        header: 'Office Account Code',
        // size: 200,
        cell: ({ row }) => {
            const office = row.original;
            const sector = office.sector?.code ?? '0000';
            // const subsector = '000';
            const lgu = office.lgu_level?.code ?? '0';
            const type = office.office_type?.code ?? '00';
            const officeCode = office.code ?? '000';
            return (
                // <code className="font-mono text-xs">{`${sector}-${subsector}-${lgu}-${type}-${officeCode}`}</code>
                <code className="font-mono text-xs">{`${sector}-${lgu}-${type}-${officeCode}`}</code>
            );
        },
    }),
    columnHelper.accessor('name', {
        header: 'Office Name',
        // size: 200,
        cell: (value) => <span className="text-wrap">{value.getValue()}</span>,
    }),
    columnHelper.accessor('acronym', {
        header: 'Acronym',
        // size: 200,
        cell: (value) => (
            <span className="text-wrap">{value.getValue() ?? '-'}</span>
        ),
    }),
    columnHelper.accessor('is_lee', {
        header: 'LEE',
        // size: 80,
        cell: ({ row }) => (
            <div className="flex items-center">
                {row.getValue('is_lee') ? (
                    <Badge>Yes</Badge>
                ) : (
                    <Badge variant="secondary">No</Badge>
                )}
            </div>
        ),
    }),
    columnHelper.display({
        id: 'action',
        size: 46,
        cell: ({ row, table }) => (
            <div className="flex items-center gap-1">
                <Button
                    size="icon"
                    onClick={() => table.options.meta?.onEdit?.(row.original)}
                >
                    <Pencil />
                </Button>

                <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => table.options.meta?.onDelete?.(row.original)}
                >
                    <Trash />
                </Button>
            </div>
        ),
    }),
];
