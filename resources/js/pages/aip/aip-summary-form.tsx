import * as React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import {
    ChevronDown,
    MoreHorizontal,
    Library,
    Search,
    Trash2,
    FileDown,
    FileSpreadsheet,
    FileText,
    Edit,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import PpaImportModal from '@/pages/aip/ppa-import-modal';
import AipEntryFormDialog from '@/pages/aip/aip-entry-form-dialog';
import { router } from '@inertiajs/react';

// Export Libraries
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface AipEntry {
    id: number;
    aip_ref_code: string;
    ppa_desc: string;
    implementing_office_department: string;
    sched_implementation: {
        start_date: string;
        completion_date: string;
    };
    expected_outputs: string;
    funding_source: string;
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

interface AipSummaryTableProp {
    fiscalYears: { id: number; year: number };
    aipEntries: AipEntry[];
    masterPpas: any[];
}

const formatNumber = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num)
        ? '0.00'
        : num.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          });
};

export default function AipSummaryTable({
    fiscalYears,
    aipEntries,
    masterPpas,
}: AipSummaryTableProp) {
    console.log(fiscalYears);
    console.log(aipEntries);
    console.log(masterPpas);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary Form ${fiscalYears.year}`, href: '#' },
    ];

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [isImportOpen, setIsImportOpen] = React.useState(false);

    // Modal States
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
    const [selectedEntry, setSelectedEntry] = React.useState<AipEntry | null>(
        null,
    );

    // --- DELETE LOGIC ---
    const handleDelete = (entry: AipEntry) => {
        router.delete(`/aip-entries/${entry.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleteAlertOpen(false);
                setSelectedEntry(null);
            },
        });
    };

    // --- EXPORT LOGIC ---
    const flattenForExport = (entries: AipEntry[], depth = 0): any[] => {
        let flat: any[] = [];
        entries.forEach((entry) => {
            const indent = '    '.repeat(depth);
            const prefix = depth > 0 ? '↳ ' : '';
            flat.push({
                ...entry,
                indented_desc: `${indent}${prefix}${entry.ppa_desc}`,
            });
            if (entry.children && entry.children.length > 0) {
                flat = [
                    ...flat,
                    ...flattenForExport(entry.children, depth + 1),
                ];
            }
        });
        return flat;
    };

    const exportToExcel = () => {
        const flatData = flattenForExport(aipEntries);
        const data = flatData.map((e) => ({
            'AIP Ref Code': e.aip_ref_code ?? '',
            'Program/Project/Activity Description': e.indented_desc ?? '',
            'Implementing Office': e.implementing_office_department ?? '',
            'Start Date': e.sched_implementation?.start_date ?? '',
            'Completion Date': e.sched_implementation?.completion_date ?? '',
            'Expected Outputs': e.expected_outputs ?? '',
            'Funding Source': e.funding_source ?? '',
            PS: e.amount?.ps ?? '0.00',
            MOOE: e.amount?.mooe ?? '0.00',
            FE: e.amount?.fe ?? '0.00',
            CO: e.amount?.co ?? '0.00',
            Total: e.amount?.total ?? '0.00',
            'CC Adaptation': e.cc_adaptation ?? '0.00',
            'CC Mitigation': e.cc_mitigation ?? '0.00',
            'Typology Code': e.cc_typology_code ?? '',
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'AIP Summary');
        XLSX.writeFile(wb, `AIP_Summary_${fiscalYears.year}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape A4
        const flatData = flattenForExport(aipEntries);

        doc.setFontSize(10);
        doc.text(
            `Annual Investment Program (AIP) Summary FY ${fiscalYears.year}`,
            14,
            10,
        );

        autoTable(doc, {
            startY: 15,
            head: [
                [
                    'Ref Code',
                    'Description',
                    'Office',
                    'Start',
                    'End',
                    'Outputs',
                    'Source',
                    'PS',
                    'MOOE',
                    'FE',
                    'CO',
                    'Total',
                    'Adapt',
                    'Mitig',
                    'Typo',
                ],
            ],
            body: flatData.map((e) => [
                e.aip_ref_code ?? '',
                e.indented_desc ?? '',
                e.implementing_office_department ?? '',
                e.sched_implementation?.start_date ?? '',
                e.sched_implementation?.completion_date ?? '',
                e.expected_outputs ?? '',
                e.funding_source ?? '',
                formatNumber(e.amount?.ps ?? '0'),
                formatNumber(e.amount?.mooe ?? '0'),
                formatNumber(e.amount?.fe ?? '0'),
                formatNumber(e.amount?.co ?? '0'),
                formatNumber(e.amount?.total ?? '0'),
                formatNumber(e.cc_adaptation ?? '0'),
                formatNumber(e.cc_mitigation ?? '0'),
                e.cc_typology_code ?? '',
            ]),
            styles: {
                fontSize: 5.5, // Reduced font size to fit all 15 columns
                cellPadding: 1,
                valign: 'middle',
            },
            headStyles: {
                fillColor: [40, 40, 40],
                halign: 'center',
            },
            columnStyles: {
                1: { cellWidth: 40 }, // Description
                5: { cellWidth: 25 }, // Expected Outputs
                6: { cellWidth: 20 }, // Source
            },
            margin: { left: 5, right: 5 }, // Wider margins for more space
        });

        doc.save(`AIP_Summary_${fiscalYears.year}.pdf`);
    };

    // --- TABLE DEFINITION ---
    const columnHelper = createColumnHelper<AipEntry>();

    const columns = React.useMemo(
        () => [
            columnHelper.display({
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                ),
            }),
            columnHelper.accessor('aip_ref_code', {
                header: 'AIP Reference Code',
                cell: (info) => (
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px] font-bold">
                        {info.getValue()}
                    </code>
                ),
            }),
            columnHelper.accessor('ppa_desc', {
                header: 'Description',
                cell: ({ row, getValue }) => (
                    <div
                        style={{ paddingLeft: `${row.depth * 20}px` }}
                        className="flex min-w-[300px] items-center gap-2 py-1"
                    >
                        {row.depth > 0 && (
                            <span className="text-muted-foreground opacity-50">
                                ↳
                            </span>
                        )}
                        <span
                            className={
                                row.depth === 0
                                    ? 'font-bold'
                                    : 'text-muted-foreground'
                            }
                        >
                            {getValue()}
                        </span>
                    </div>
                ),
            }),
            columnHelper.accessor('implementing_office_department', {
                header: 'Office',
            }),
            columnHelper.group({
                header: 'Schedule',
                columns: [
                    columnHelper.accessor('sched_implementation.start_date', {
                        header: 'Start',
                    }),
                    columnHelper.accessor(
                        'sched_implementation.completion_date',
                        { header: 'End' },
                    ),
                ],
            }),
            columnHelper.group({
                header: 'Amount (PHP)',
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
                        header: 'Adapt',
                        cell: (i) => formatNumber(i.getValue()),
                    }),
                    columnHelper.accessor('cc_mitigation', {
                        header: 'Mitig',
                        cell: (i) => formatNumber(i.getValue()),
                    }),
                ],
            }),
            columnHelper.display({
                id: 'actions',
                cell: ({ row }) => {
                    const entry = row.original;
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
                                    onClick={() => {
                                        setSelectedEntry(entry);
                                        setIsEditOpen(true);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Edit Entry
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => {
                                        setSelectedEntry(entry);
                                        setIsDeleteAlertOpen(true);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                    from AIP
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: aipEntries,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSubRows: (row) => row.children,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            expanded: true,
        },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary FY ${fiscalYears.year}`, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="flex items-center justify-between py-4">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search PPAs..."
                            value={
                                (table
                                    .getColumn('ppa_desc')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn('ppa_desc')
                                    ?.setFilterValue(e.target.value)
                            }
                            className="max-w-sm pl-8"
                        />
                    </div>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <FileDown className="mr-2 h-4 w-4" /> Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={exportToExcel}>
                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />{' '}
                                    Excel (.xlsx)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportToPDF}>
                                    <FileText className="mr-2 h-4 w-4 text-red-600" />{' '}
                                    PDF (.pdf)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button onClick={() => setIsImportOpen(true)}>
                            <Library className="mr-2 h-4 w-4" /> Import from
                            Library
                        </Button>
                    </div>
                </div>

                <AipEntryFormDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    data={selectedEntry}
                />

                <AlertDialog
                    open={isDeleteAlertOpen}
                    onOpenChange={setIsDeleteAlertOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Remove from AIP Summary?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to remove{' '}
                                <span className="font-bold text-foreground">
                                    "{selectedEntry?.ppa_desc}"
                                </span>
                                ?
                                {selectedEntry?.children &&
                                    selectedEntry.children.length > 0 && (
                                        <span className="mt-2 block font-semibold text-destructive italic">
                                            Warning: This will also remove all
                                            nested sub-projects and activities.
                                        </span>
                                    )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setSelectedEntry(null)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() =>
                                    selectedEntry && handleDelete(selectedEntry)
                                }
                            >
                                Confirm Removal
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <PpaImportModal
                    isOpen={isImportOpen}
                    onClose={() => setIsImportOpen(false)}
                    ppaTree={masterPpas}
                    fiscalYearsId={fiscalYears.id}
                />

                <div className="overflow-x-auto rounded-md border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((h) => (
                                        <TableHead
                                            key={h.id}
                                            colSpan={h.colSpan}
                                            className="border-x border-b px-2 py-2 text-center text-[10px] font-bold tracking-tighter text-foreground uppercase"
                                        >
                                            {h.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      h.column.columnDef.header,
                                                      h.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="border-x px-2 py-1 text-[11px]"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
