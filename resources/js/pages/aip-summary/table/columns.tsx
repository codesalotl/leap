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

export const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);

    return `${month}-${year}`;
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
    return useMemo(() => getColumns(actions), [actions]);
};

export const getColumns = ({
    onAddEntry,
    onEdit,
    onDelete,
    masterPpas,
}: ColumnActions): ColumnDef<AipEntry, any>[] => [
    columnHelper.accessor('full_code', {
        header: 'AIP Reference Code',
        size: 300,
        cell: (info) => (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[12px]">
                {info.getValue()}
            </code>
        ),
    }),
    columnHelper.accessor('title', {
        header: 'Program/Project/Activity Description',
        filterFn: (row, _columnId, value) => {
            const description = row.getValue('title') as string;
            const refCode = row.getValue('full_code') as string;
            const searchValue = (value as string)?.toLowerCase() || '';

            return (
                description.toLowerCase().includes(searchValue) ||
                refCode.toLowerCase().includes(searchValue)
            );
        },
        size: 600,
        cell: ({ row, getValue }) => (
            <div
                style={{ paddingLeft: `${row.depth * 20}px` }}
                className="flex gap-2"
            >
                {row.depth > 0 && (
                    <span className="text-muted-foreground opacity-50">↳</span>
                )}
                <span className="break-words whitespace-normal">
                    {getValue()}
                </span>
            </div>
        ),
    }),
    columnHelper.accessor('office.name', {
        header: 'Implementing Office/Department',
        size: 500,
        cell: (info) => (
            <div className="break-words whitespace-normal">
                {info.getValue()}
            </div>
        ),
    }),
    columnHelper.group({
        header: 'Schedule of Implementation',
        columns: [
            columnHelper.accessor('aip_entry_for_year.start_date', {
                header: 'Start Date',
                cell: (info) => formatDate(info.getValue()),
            }),
            columnHelper.accessor('aip_entry_for_year.end_date', {
                header: 'Completion Date',
                cell: (info) => formatDate(info.getValue()),
            }),
        ],
    }),
    columnHelper.accessor('aip_entry_for_year.expected_output', {
        header: 'Expected Outputs',
        size: 600,
        cell: (info) => (
            <div className="break-words whitespace-normal">
                {info.getValue()}
            </div>
        ),
    }),
    columnHelper.accessor('funding_source', {
        header: 'Funding Source',
        cell: (info) => info.getValue() || '-',
    }),
    columnHelper.group({
        header: 'Amount (in thousand pesos)',
        columns: [
            columnHelper.accessor('aip_entry_for_year.ps_amount', {
                header: () => <div className="text-right">PS</div>,
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('aip_entry_for_year.mooe_amount', {
                header: () => <div className="text-right">MOOE</div>,
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('aip_entry_for_year.fe_amount', {
                header: () => <div className="text-right">FE</div>,
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('aip_entry_for_year.co_amount', {
                header: () => <div className="text-right">CO</div>,
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.display({
                id: 'amount.total',
                header: () => <div className="text-right">Total</div>,
                cell: ({ row }) => {
                    // console.log(row.original);

                    // const amount = row.original;
                    const total =
                        parseFloat(
                            row.original.aip_entry_for_year.ps_amount || '0',
                        ) +
                        parseFloat(
                            row.original.aip_entry_for_year.mooe_amount || '0',
                        ) +
                        parseFloat(
                            row.original.aip_entry_for_year.fe_amount || '0',
                        ) +
                        parseFloat(
                            row.original.aip_entry_for_year.co_amount || '0',
                        );
                    return (
                        <span className="block text-right font-bold">
                            {formatNumber(total.toString())}
                        </span>
                    );
                },
            }),
        ],
    }),
    columnHelper.group({
        header: 'CC Expenditure',
        columns: [
            columnHelper.accessor('aip_entry_for_year.ccet_adaptation', {
                header: () => <div className="text-right">Adaptation</div>,
                cell: (i) => (
                    <span className="block text-right">
                        {formatNumber(i.getValue())}
                    </span>
                ),
            }),
            columnHelper.accessor('aip_entry_for_year.ccet_mitigation', {
                header: () => <div className="text-right">Mitigation</div>,
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
        cell: (info) => info.getValue() || '-',
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
