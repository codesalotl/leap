import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AipEntry } from '@/pages/types/types';
import { Ppa } from '@/pages/types/types';

export const formatNumber = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num)
        ? '0.00'
        : num.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });
};

interface ColumnActions {
    onAddEntry: (entry: AipEntry) => void;
    onEdit: (entry: AipEntry) => void;
    onDelete: (entry: AipEntry) => void;
    masterPpas: Ppa[];
}

const columnHelper = createColumnHelper<AipEntry>();

const findPpaInTree = (nodes: Ppa[], targetId: number): Ppa | null => {
    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children && node.children.length > 0) {
            const found = findPpaInTree(node.children, targetId);
            if (found) return found;
        }
    }
    return null;
};

export const useAipColumns = (actions: ColumnActions) => {
    return useMemo(
        () => getColumns(actions),
        [actions]
    );
};

export const getColumns = ({ onAddEntry, onEdit, onDelete, masterPpas }: ColumnActions): ColumnDef<AipEntry, any>[] => [
    columnHelper.accessor('aip_ref_code', {
        header: 'AIP Reference Code',
        cell: (info) => (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[12px]">
                {info.getValue()}
            </code>
        ),
    }),
    columnHelper.accessor('ppa_desc', {
        header: 'Program/Project/Activity Description',
        filterFn: (row, _columnId, value) => {
            const description = row.getValue('ppa_desc') as string;
            const refCode = row.getValue('aip_ref_code') as string;
            const searchValue = (value as string)?.toLowerCase() || '';

            return (
                description.toLowerCase().includes(searchValue) ||
                refCode.toLowerCase().includes(searchValue)
            );
        },
        cell: ({ row, getValue }) => (
            <div
                style={{ paddingLeft: `${row.depth * 20}px` }}
                className="flex gap-2"
            >
                {row.depth > 0 && (
                    <span className="text-muted-foreground opacity-50">↳</span>
                )}
                <span>{getValue()}</span>
            </div>
        ),
    }),
    columnHelper.accessor('implementing_office_department', {
        header: 'Implementing Office/Department',
    }),
    columnHelper.group({
        header: 'Schedule of Implementation',
        columns: [
            columnHelper.accessor('sched_implementation.start_date', {
                header: 'Start Date',
            }),
            columnHelper.accessor('sched_implementation.completion_date', {
                header: 'Completion Date',
            }),
        ],
    }),
    columnHelper.accessor('expected_outputs', {
        header: 'Expected Outputs',
    }),
    columnHelper.accessor('funding_source', {
        header: 'Funding Source',
    }),
    columnHelper.group({
        header: 'Amount (in thousand pesos)',
        columns: [
            columnHelper.accessor('amount.ps', {
                header: 'PS',
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('amount.mooe', {
                header: 'MOOE',
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('amount.fe', {
                header: 'FE',
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('amount.co', {
                header: 'CO',
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('amount.total', {
                header: 'Total',
                cell: (i) => (
                    <span className="block text-right font-bold">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
        ],
    }),
    columnHelper.group({
        header: 'CC Expenditure',
        columns: [
            columnHelper.accessor('cc_adaptation', {
                header: 'Adaptation',
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('cc_mitigation', {
                header: 'Mitigation',
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
        ],
    }),
    columnHelper.accessor('cc_typology_code', {
        header: 'CC Typology Code',
    }),
    columnHelper.display({
        id: 'actions',
        // enableHiding: false,
        // enablePinning: true,
        size: 116,
        cell: ({ row }) => {
            const entry = row.original;
            const masterNode = findPpaInTree(masterPpas, entry.ppa_id);
            const isActivity = masterNode?.type === 'Activity';

            return (
                <div className="flex justify-between">
                    <Button
                        title="Add PPA"
                        size="icon"
                        onClick={() => onAddEntry(entry)}
                        disabled={isActivity}
                    >
                        <Plus />
                    </Button>

                    <Button
                        title="Edit"
                        size="icon"
                        onClick={() => onEdit(entry)}
                    >
                        <Pencil />
                    </Button>

                    <Button
                        title="Delete"
                        variant="destructive"
                        size="icon"
                        onClick={() => onDelete(entry)}
                    >
                        <Trash />
                    </Button>
                </div>
            );
        },
    }),
];
