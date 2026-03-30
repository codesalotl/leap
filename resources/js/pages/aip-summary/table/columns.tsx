import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Decimal } from 'decimal.js';

export const formatNumber = (val: string | null) => {
    if (!val) return '-';
    const num = parseFloat(val);
    return num
        ? num.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })
        : '-';
};

export const formatDate = (dateString: string) => {
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
    const dateSplit = dateString.split('-');
    return `${months[Number(dateSplit[1]) - 1]}-${dateSplit[2]}`;
};

const columnHelper = createColumnHelper<any>();

export const columns = [
    columnHelper.accessor('full_code', {
        id: 'full_code',
        header: 'AIP Reference Code',
        size: 200,
        cell: (info) => (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px]">
                {info.getValue()}
            </code>
        ),
    }),
    columnHelper.accessor('name', {
        id: 'name',
        header: 'Program/Project/Activity Description',
        size: 400,
        cell: ({ row, getValue }) => (
            <div
                style={{ paddingLeft: `${row.original.depth * 20}px` }}
                className="flex gap-2"
            >
                {row.original.depth > 0 && (
                    <span className="text-muted-foreground opacity-50">↳</span>
                )}
                <span className="break-words whitespace-normal">
                    {getValue()}
                </span>
            </div>
        ),
    }),
    columnHelper.accessor('office.acronym', {
        id: 'office_acronym',
        header: 'Implementing Office',
        size: 150,
        cell: (info) => info.getValue(),
    }),
    columnHelper.group({
        header: 'Schedule',
        columns: [
            columnHelper.accessor('aip_entries', {
                id: 'start_date',
                header: 'Start',
                cell: (info) =>
                    info.getValue()?.[0]
                        ? formatDate(info.getValue()[0].start_date)
                        : '—',
            }),
            columnHelper.accessor('aip_entries', {
                id: 'end_date',
                header: 'End',
                cell: (info) =>
                    info.getValue()?.[0]
                        ? formatDate(info.getValue()[0].end_date)
                        : '—',
            }),
        ],
    }),
    columnHelper.accessor('aip_entries', {
        id: 'expected_output',
        header: 'Expected Outputs',
        size: 400,
        cell: (info) => (
            <div className="text-xs break-words whitespace-normal">
                {info.getValue()?.[0]?.expected_output || '—'}
            </div>
        ),
    }),
    columnHelper.accessor('current_fs.funding_source.code', {
        id: 'funding_sources',
        header: 'Funding Source',
        size: 250,
        cell: (info) =>
            info.getValue() ? <Badge>{info.getValue()}</Badge> : '-',
    }),

    // --- GROUPED AMOUNTS ---
    columnHelper.group({
        header: 'Amount (in thousand pesos)',
        size: 400,
        columns: [
            columnHelper.accessor('current_fs.ps_amount', {
                id: 'ps_amount',
                header: () => <div className="text-right">PS</div>,
                cell: (info) => (
                    <div className="text-right">
                        {formatNumber(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('current_fs.mooe_amount', {
                id: 'mooe_amount',
                header: () => <div className="text-right">MOOE</div>,
                cell: (info) => (
                    <div className="text-right">
                        {formatNumber(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('current_fs.fe_amount', {
                id: 'fe_amount',
                header: () => <div className="text-right">FE</div>,
                cell: (info) => (
                    <div className="text-right">
                        {formatNumber(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('current_fs.co_amount', {
                id: 'co_amount',
                header: () => <div className="text-right">CO</div>,
                cell: (info) => (
                    <div className="text-right">
                        {formatNumber(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.display({
                id: 'amount_total',
                header: () => <div className="text-right font-bold">Total</div>,
                cell: ({ row }) => {
                    const fs = row.original.current_fs;
                    if (!fs) return <div className="text-right">-</div>;
                    const total = new Decimal(fs.co_amount || 0)
                        .plus(fs.fe_amount || 0)
                        .plus(fs.mooe_amount || 0)
                        .plus(fs.ps_amount || 0);
                    return (
                        <div className="text-right font-bold">
                            {formatNumber(total.toString())}
                        </div>
                    );
                },
            }),
        ],
    }),

    // --- GROUPED CLIMATE CHANGE ---
    columnHelper.group({
        header: 'Climate Change Expenditure',
        size: 250,
        columns: [
            columnHelper.accessor('current_fs.ccet_adaptation', {
                id: 'cc_adaptation',
                header: () => (
                    <div className="text-right text-[10px]">Adaptation</div>
                ),
                cell: (info) => (
                    <div className="text-right">
                        {formatNumber(info.getValue())}
                    </div>
                ),
            }),
            columnHelper.accessor('current_fs.ccet_mitigation', {
                id: 'cc_mitigation',
                header: () => (
                    <div className="text-right text-[10px]">Mitigation</div>
                ),
                cell: (info) => (
                    <div className="text-right">
                        {formatNumber(info.getValue())}
                    </div>
                ),
            }),
        ],
    }),

    columnHelper.display({
        id: 'cc_typology_code',
        header: 'Typology',
        cell: () => <div className="text-right">-</div>,
    }),
    columnHelper.display({
        id: 'actions',
        size: 124,
        cell: ({ row, table }) => (
            <div className="flex items-center gap-1">
                <Button
                    size="icon"
                    onClick={() => table.options.meta?.onAdd?.(row.original)}
                    disabled={row.original.type === 'Sub-Activity'}
                >
                    <Plus className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    onClick={() => table.options.meta?.onEdit?.(row.original)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => table.options.meta?.onDelete?.(row.original)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        ),
    }),
];
