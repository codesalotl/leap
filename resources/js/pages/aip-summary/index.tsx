import { useState, useMemo, useCallback } from 'react';

import { router } from '@inertiajs/react';
import {
    Library,
    FileDown,
    FileSpreadsheet,
    FileText,
    Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import AppLayout from '@/layouts/app-layout';
import DataTable from '@/pages/aip-summary/table/data-table';
import PpaSelectorDialog from '@/pages/aip-summary/ppa-selector-dialog';
import AipEntryFormDialog from '@/pages/aip-summary/aip-entry-form-dialog';
import { useAipColumns } from '@/pages/aip-summary/table/columns';
import {
    exportToExcel,
    exportToPDF,
} from '@/pages/aip-summary/utils/export-utils';

import { type AipEntry, FiscalYear, Ppa } from '@/pages/types/types';
import { type BreadcrumbItem } from '@/types';

interface AipSummaryTableProp {
    fiscalYear: FiscalYear;
    aipEntries: AipEntry[];
    masterPpas: Ppa[];
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

export default function AipSummaryTable({
    fiscalYear,
    aipEntries,
    masterPpas,
}: AipSummaryTableProp) {
    console.log(aipEntries);

    const [searchValue, setSearchValue] = useState('');
    const [selectorState, setSelectorState] = useState({
        isOpen: false,
        data: [] as Ppa[],
        title: '',
        description: '',
    });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

    const selectedEntry = useMemo(() => {
        if (!selectedEntryId) return null;
        return findEntryInTree(aipEntries, selectedEntryId);
    }, [aipEntries, selectedEntryId]);

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

        console.log(masterNode);

        if (!masterNode) {
            console.warn('Master PPA not found');
            return;
        }

        setSelectorState({
            isOpen: true,
            data: masterNode.children || [],
            title: `Add Sub-entries to: ${masterNode.title}`,
            description: `Select items to add under ${masterNode.type} ${masterNode.full_code}`,
        });
    };

    const handleDelete = (entry: AipEntry) => {
        router.delete(`/aip-entries/${entry.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleteAlertOpen(false);
                setSelectedEntryId(null);
            },
        });
    };

    const handleExportExcel = () => {
        exportToExcel(aipEntries, fiscalYear);
    };

    const handleExportPDF = () => {
        exportToPDF(aipEntries, fiscalYear);
    };

    const handleEdit = useCallback((entry: AipEntry) => {
        setSelectedEntryId(entry.id);
        setIsEditOpen(true);
    }, []);

    const handleDeleteClick = useCallback((entry: AipEntry) => {
        setSelectedEntryId(entry.id);
        setIsDeleteAlertOpen(true);
    }, []);

    const columns = useAipColumns({
        onAddEntry: handleAddEntry,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        masterPpas,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary FY ${fiscalYear.year}`, href: '#' },
    ];

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
                                    <DropdownMenuItem
                                        onClick={handleExportExcel}
                                    >
                                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />{' '}
                                        Excel (.xlsx)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleExportPDF}>
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

            <AipEntryFormDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                data={selectedEntry}
                fiscalYear={fiscalYear}
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
                            onClick={() => setSelectedEntryId(null)}
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
