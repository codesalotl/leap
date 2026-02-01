// resources\js\pages\aip\aip-summary-table\columns.tsx

import { createColumnHelper } from '@tanstack/react-table';
import {
    MoreHorizontal,
    SquareArrowOutUpRight,
    Edit,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Types ---
export interface AipEntry {
    id: number;
    ppa_id: number;
    parent_ppa_id: number | null;
    aip_ref_code: string;
    ppa_desc: string;
    implementing_office_department: string;
    sched_implementation: {
        start_date: string;
        completion_date: string;
    };
    expected_outputs: string;
    funding_source: string;
    itemized_costs?: any[];
    amount: {
        ps: string;
        mooe: string;
        fe: string;
        co: string;
        total: string;
    };
    cc_adaptation: string;
    cc_mitigation: string;
    cc_typology_code: string;
    children?: AipEntry[];
}

// --- Helpers ---
export const formatNumber = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num)
        ? '0.00'
        : num.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });
};

// --- Column Definitions ---
const columnHelper = createColumnHelper<AipEntry>();

interface ColumnActions {
    onAddEntry: (entry: AipEntry) => void;
    onEdit: (entry: AipEntry) => void;
    onDelete: (entry: AipEntry) => void;
}

export const getColumns = ({ onAddEntry, onEdit, onDelete }: ColumnActions) => [
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
        filterFn: (row, columnId, value) => {
            const description = row.getValue('ppa_desc') as string;
            const refCode = row.getValue('aip_ref_code') as string;
            const searchValue = (value as string)?.toLowerCase() || '';
            
            return description.toLowerCase().includes(searchValue) || 
                   refCode.toLowerCase().includes(searchValue);
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
                cell: (i) => formatNumber(i.getValue()),
            }),
            columnHelper.accessor('amount.mooe', {
                header: 'MOOE',
                cell: (i) => formatNumber(i.getValue()),
            }),
            columnHelper.accessor('amount.fe', {
                header: 'FE',
                cell: (i) => formatNumber(i.getValue()),
            }),
            columnHelper.accessor('amount.co', {
                header: 'CO',
                cell: (i) => formatNumber(i.getValue()),
            }),
            columnHelper.accessor('amount.total', {
                header: 'Total',
                cell: (i) => (
                    <span className="font-bold">
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
                cell: (i) => formatNumber(i.getValue()),
            }),
            columnHelper.accessor('cc_mitigation', {
                header: 'Mitigation',
                cell: (i) => formatNumber(i.getValue()),
            }),
        ],
    }),
    columnHelper.accessor('cc_typology_code', {
        header: 'CC Typology Code',
    }),
    columnHelper.display({
        id: 'actions',
        enableHiding: false,
        enablePinning: true,
        cell: ({ row }) => {
            const entry = row.original;
            const isLeaf = !entry.children || entry.children.length === 0;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onSelect={() => onAddEntry(entry)}
                            disabled={isLeaf}
                        >
                            <SquareArrowOutUpRight className="mr-2 h-4 w-4" />{' '}
                            Add Entry
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(entry)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Entry
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete(entry)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Remove from AIP
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
];