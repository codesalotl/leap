import { createColumnHelper } from '@tanstack/react-table';
import type { RowData } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PpmpCategory } from '@/pages/types/types';

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        onEdit?: (record: TData) => void;
        onDelete?: (record: TData) => void;
    }
}

const columnHelper = createColumnHelper<PpmpCategory>();

export const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        size: 300,
        cell: (value) => <span className="text-wrap">{value.getValue()}</span>,
    }),
    columnHelper.display({
        id: 'action',
        size: 87,
        cell: ({ row, table }) => (
            <div className="flex gap-0.5">
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
