import { useState, useMemo, useEffect } from 'react';
import { Library, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { router } from '@inertiajs/react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/pages/aip-summary/table/data-table';
import PpaSelectorDialog from '@/pages/aip-summary/ppa-selector-dialog';
import AipEntryFormDialog from '@/pages/aip-summary/aip-entry-form-dialog';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { type BreadcrumbItem } from '@/types';
import {
    getColumns,
    AipEntry,
    formatNumber,
} from '@/pages/aip-summary/table/columns';
import {
    FiscalYear,
    ChartOfAccount,
    PriceList,
    Office,
    Ppmp,
} from '@/pages/types/types';

type Ppa = {
    id: number;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    full_code: string;
    is_active: boolean;
    children?: Ppa[];
};

interface AipSummaryTableProp {
    fiscalYear: FiscalYear;
    aipEntries: AipEntry[];
    masterPpas: Ppa[];
    offices: Office[];
    chartOfAccounts: ChartOfAccount[];
    ppmpPriceList: PriceList[];
    ppmpItems: Ppmp[];
}

const findEntryInTree = (
    nodes: AipEntry[],
    targetId: number,
): AipEntry | null => {
    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children && node.children.length > 0) {
            const found = findEntryInTree(node.children, targetId);
            if (found) return found;
        }
    }
    return null;
};

const findPpaInTree = (nodes: any[], targetId: number) => {
    for (const node of nodes) {
        if (node.id === targetId) return node;
        if (node.children && node.children.length > 0) {
            const found = findPpaInTree(node.children, targetId);
            if (found) return found;
        }
    }
    return null;
};

export default function AipSummaryTable({
    fiscalYear,
    aipEntries,
    masterPpas,
    offices,
    chartOfAccounts,
    ppmpPriceList,
    ppmpItems,
}: AipSummaryTableProp) {
    // console.log(ppmpItems);

    const [searchValue, setSearchValue] = useState('');
    const [selectorState, setSelectorState] = useState({
        isOpen: false,
        data: [] as Ppa[],
        title: '',
        description: '',
    });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMooeOpen, setIsMooeOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<AipEntry | null>(null);
    const [mode, setMode] = useState<string | null>(null);

    useEffect(() => {
        if (selectedEntry) {
            const updated = findEntryInTree(aipEntries, selectedEntry.id);
            if (updated) setSelectedEntry(updated);
        }
    }, [aipEntries]);

    const handleImportLibrary = () => {
        setSelectorState({
            isOpen: true,
            data: masterPpas,
            title: 'Import from Library',
            description:
                'Select Programs, Projects, and Activities to import. Items already in the AIP are disabled.',
        });
    };

    const handleAddEntry = (entry: AipEntry) => {
        const masterNode = findPpaInTree(masterPpas, entry.ppa_id);

        if (
            !masterNode ||
            !masterNode.children ||
            masterNode.children.length === 0
        ) {
            console.warn(
                'Cannot add entries to an Activity or item without children',
            );
            return;
        }

        setSelectorState({
            isOpen: true,
            data: masterNode.children,
            title: `Add Sub-entries to: ${masterNode.title}`,
            description: `Select items to add under ${masterNode.type} ${masterNode.full_code}`,
        });
    };

    const handleSwitchToMooe = () => {
        setIsEditOpen(false);
        setIsMooeOpen(true);
    };

    const handleDelete = (entry: AipEntry) => {
        router.delete(`/aip-entries/${entry.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleteAlertOpen(false);
                setSelectedEntry(null);
            },
        });
    };

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
        XLSX.writeFile(wb, `AIP_Summary_${fiscalYear.year}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        const flatData = flattenForExport(aipEntries);

        doc.setFontSize(10);
        doc.text(
            `Annual Investment Program (AIP) Summary FY ${fiscalYear.year}`,
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
            styles: { fontSize: 5.5, cellPadding: 1, valign: 'middle' },
            headStyles: { fillColor: [40, 40, 40], halign: 'center' },
            margin: { left: 5, right: 5 },
        });

        doc.save(`AIP_Summary_${fiscalYear.year}.pdf`);
    };

    // --- Table Columns ---
    const columns = useMemo(
        () =>
            getColumns({
                onAddEntry: (entry) => {
                    handleAddEntry(entry);
                },
                onEdit: (entry) => {
                    setSelectedEntry(entry);
                    setIsEditOpen(true);
                    setMode('edit');
                },
                onDelete: (entry) => {
                    setSelectedEntry(entry);
                    setIsDeleteAlertOpen(true);
                },
            }),
        [],
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary FY ${fiscalYear.year}`, href: '#' },
    ];

    const selectedPpaMasterData = useMemo(() => {
        if (!selectedEntry || !masterPpas) return null;
        return findPpaInTree(masterPpas, selectedEntry.ppa_id);
    }, [selectedEntry, masterPpas]);

    const existingPpaIds = useMemo(() => {
        const ids = new Set<number>();
        const extractIds = (entries: AipEntry[]) => {
            entries.forEach((entry) => {
                ids.add(entry.ppa_id);
                if (entry.children && entry.children.length > 0)
                    extractIds(entry.children);
            });
        };
        extractIds(aipEntries);
        return ids;
    }, [aipEntries]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="w-full">
                    <div className="flex items-center justify-between py-4">
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects or activities..."
                                value={searchValue}
                                onChange={(event) =>
                                    setSearchValue(event.target.value)
                                }
                                className="max-w-sm pl-8"
                            />
                        </div>

                        <div className="ml-auto flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <FileDown className="mr-2 h-4 w-4" />{' '}
                                        Export
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

                            <Button onClick={handleImportLibrary}>
                                <Library className="mr-2 h-4 w-4" /> Import from
                                Library
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-9rem)] rounded-md border">
                        <DataTable
                            data={aipEntries}
                            columns={columns}
                            searchKey="ppa_desc"
                            searchValue={searchValue}
                            onSearchChange={setSearchValue}
                            getSubRows={(row) => row.children}
                        />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>

            {/* for importing and adding of ppa */}
            <PpaSelectorDialog
                isOpen={selectorState.isOpen}
                onClose={() =>
                    setSelectorState((prev) => ({ ...prev, isOpen: false }))
                }
                data={selectorState.data}
                title={selectorState.title}
                description={selectorState.description}
                fiscalYearId={fiscalYear.id}
                existingPpaIds={Array.from(existingPpaIds)}
            />

            {/* for editing ppa */}
            <AipEntryFormDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSwitch={handleSwitchToMooe}
                data={selectedEntry}
                mode={mode}
                offices={offices}
                fiscalYear={fiscalYear}
            />

            {/* for delete ppa */}
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
        </AppLayout>
    );
}
