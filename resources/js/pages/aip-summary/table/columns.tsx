import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ppa, PpaFundingSource } from '@/types/global';
import { Badge } from '@/components/ui/badge';
import { Decimal } from 'decimal.js';

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

export const formatNumber = (val: string | null) => {
    if (!val) return;

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

const columnHelper = createColumnHelper<Ppa>();

export const columns = [
    columnHelper.accessor('office', {
        header: 'AIP Reference Code',
        size: 250,
        cell: (info) => {
            const office = info.getValue();
            const row = info.row;

            // 1. Base Office Codes (keeping their specific padding)
            const sector = office?.sector?.code ?? '0';
            const lguLevel = office?.lgu_level?.code ?? '00';
            const officeType = office?.office_type?.code ?? '00';
            const officeCode = office?.code ?? '000';
            const baseCode = `${sector}-${lguLevel}-${officeType}-${officeCode}`;

            // 2. Generate the Hierarchy Path
            const getHierarchyPath = (currentRow: any): string[] => {
                const path: string[] = [];
                let current = currentRow;

                while (current) {
                    const suffix = current.original.code_suffix;
                    const depth = current.depth; // 0 = Program, 1 = Project, 2 = Activity, 3 = Sub-Activity

                    if (suffix) {
                        // If it's the 4th level (Sub-Activity), strip leading zeros
                        // Otherwise, keep the original string (e.g., "001")
                        const formattedSuffix =
                            depth === 3
                                ? parseInt(suffix, 10).toString()
                                : suffix;

                        path.unshift(formattedSuffix);
                    }
                    current = current.getParentRow();
                }
                return path;
            };

            const hierarchyCode = getHierarchyPath(row).join('-');

            return (
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[12px]">
                    {hierarchyCode ? `${baseCode}-${hierarchyCode}` : baseCode}
                </code>
            );
        },
    }),
    columnHelper.accessor('title', {
        header: 'Program/Project/Activity Description',
        size: 400,
        filterFn: (row, _columnId, value) => {
            const description: string = row.getValue('title');
            const refCode: string = row.getValue('full_code');
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
                <span className="break-words whitespace-normal">
                    {getValue()}
                </span>
            </div>
        ),
    }),
    columnHelper.accessor('office.acronym', {
        header: 'Implementing Office/Department',
        size: 250,
        cell: (info) => (
            <div className="break-words whitespace-normal">
                {info.getValue()}
            </div>
        ),
    }),
    columnHelper.group({
        header: 'Schedule of Implementation',
        size: 250,
        columns: [
            columnHelper.accessor('aip_entries', {
                id: 'start_date',
                header: 'Start Date',
                cell: (info) => {
                    const aipEntry = info.getValue();

                    if (!aipEntry || aipEntry.length === 0) {
                        return '—';
                    }

                    return formatDate(aipEntry[0].start_date);
                },
            }),
            columnHelper.accessor('aip_entries', {
                id: 'end_date',
                header: 'Completion Date',
                cell: (info) => {
                    const aipEntry = info.getValue();

                    if (!aipEntry || aipEntry.length === 0) {
                        return '—';
                    }

                    return formatDate(aipEntry[0].end_date);
                },
            }),
        ],
    }),
    columnHelper.accessor('aip_entries', {
        id: 'expected_output',
        header: 'Expected Outputs',
        size: 500,
        cell: (info) => {
            const aipEntry = info.getValue();

            if (!aipEntry || aipEntry.length === 0) {
                return '—';
            }

            return (
                <div className="break-words whitespace-normal">
                    {aipEntry[0].expected_output}
                </div>
            );
        },
    }),

    columnHelper.accessor('ppa_funding_sources', {
        id: 'funding_sources',
        header: 'Funding Source',
        size: 300,
        cell: (info) => {
            const ppaFs = info.getValue();
            // console.log(ppaFs);

            return ppaFs?.length !== 0 ? (
                <div className="flex flex-col gap-4">
                    {ppaFs?.map((item) => (
                        <Badge key={item.funding_source?.id}>
                            {item.funding_source?.code}
                        </Badge>
                    ))}
                </div>
            ) : (
                '-'
            );
        },
    }),
    columnHelper.group({
        header: 'Amount (in thousand pesos)',
        size: 600,
        columns: [
            columnHelper.accessor('ppa_funding_sources', {
                id: 'ps_amount',
                header: () => <div className="text-right">PS</div>,
                cell: (info) => {
                    const ppaFs = info.getValue();
                    // console.log(ppaFs);

                    return ppaFs.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {ppaFs.map((amount: PpaFundingSource) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(amount.ps_amount)}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
            columnHelper.accessor('ppa_funding_sources', {
                id: 'mooe_amount',
                header: () => <div className="text-right">MOOE</div>,
                cell: (info) => {
                    const ppaFs = info.getValue();

                    return ppaFs.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {ppaFs.map((amount: PpaFundingSource) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(amount.mooe_amount)}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
            columnHelper.accessor('ppa_funding_sources', {
                id: 'fe_amount',
                header: () => <div className="text-right">FE</div>,
                cell: (info) => {
                    const ppaFs = info.getValue();

                    return ppaFs.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {ppaFs.map((amount: PpaFundingSource) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(amount.fe_amount)}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
            columnHelper.accessor('ppa_funding_sources', {
                id: 'co_amount',
                header: () => <div className="text-right">CO</div>,
                cell: (info) => {
                    const ppaFs = info.getValue();

                    return ppaFs.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {ppaFs.map((amount: PpaFundingSource) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(amount.co_amount)}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
            columnHelper.display({
                id: 'amount_total',
                header: () => <div className="text-right">Total</div>,
                cell: ({ row }) => {
                    const items = row.original.ppa_funding_sources;

                    function calcTotalAmount(data: PpaFundingSource) {
                        const ppaFs = data;

                        const total = new Decimal(ppaFs.co_amount || 0)
                            .plus(new Decimal(ppaFs.fe_amount || 0))
                            .plus(new Decimal(ppaFs.mooe_amount || 0))
                            .plus(new Decimal(ppaFs.ps_amount || 0));

                        return total.toString();
                    }

                    return items?.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {items?.map((amount) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(calcTotalAmount(amount))}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
        ],
    }),
    columnHelper.group({
        header: 'AMOUNT of Climate Change Expenditure (in thousand pesos)',
        size: 400,
        columns: [
            columnHelper.accessor('ppa_funding_sources', {
                id: 'cc_adaptation',
                header: () => (
                    <div className="text-right">Climate Change Adaptation</div>
                ),
                cell: (info) => {
                    const ppaFs = info.getValue();

                    return ppaFs.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {ppaFs.map((amount: PpaFundingSource) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(amount.ccet_adaptation)}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
            columnHelper.accessor('ppa_funding_sources', {
                id: 'cc_mitigation',
                header: () => (
                    <div className="text-right">Climate Change Mitigation</div>
                ),
                cell: (info) => {
                    const ppaFs = info.getValue();

                    return ppaFs.length !== 0 ? (
                        <div className="flex flex-col gap-4">
                            {ppaFs.map((amount: PpaFundingSource) => {
                                return (
                                    <span
                                        key={amount.id}
                                        className="block text-right"
                                    >
                                        {formatNumber(amount.ccet_mitigation)}
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="block text-right">-</span>
                    );
                },
            }),
        ],
    }),
    columnHelper.display({
        id: 'cc_typology_code',
        header: 'CC Typology Code',
        size: 124,
        cell: () => {
            return <span className="block text-right">-</span>;
        },
    }),
    columnHelper.display({
        id: 'actions',
        size: 124,
        cell: ({ row, table }) => {
            const entry = row.original;

            // FIX: Use the type directly from the row data instead of searching a tree
            const isSubActivity = entry.type === 'Sub-Activity';

            return (
                <div className="flex items-center gap-1">
                    <Button
                        title="Add Sub-entry"
                        size="icon"
                        onClick={() => {
                            console.log('Button clicked for PPA:', entry.id);
                            table.options.meta?.onAdd?.(entry);
                        }}
                        disabled={isSubActivity}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                        title="Edit"
                        size="icon"
                        onClick={() => table.options.meta?.onEdit?.(entry)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        title="Delete"
                        size="icon"
                        variant="destructive"
                        className="text-destructive hover:text-destructive"
                        onClick={() => table.options.meta?.onDelete?.(entry)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    }),
];
