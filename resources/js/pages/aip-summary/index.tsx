import { useState, useMemo, useCallback } from 'react';
import { Library, FileDown, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
// import DataTable from '@/pages/aip-summary/table/data-table';
import PpaSelectorDialog from '@/pages/aip-summary/ppa-selector-dialog';
import { DeleteDialog } from '@/components/delete-dialog';
import AipEntryFormDialog from '@/pages/aip-summary/aip-entry-form-dialog';
// import { useAipColumns } from '@/pages/aip-summary/table/columns';
import ExportToPdfDialog from '@/pages/aip-summary/export-to-pdf-dialog';
import type { FiscalYear, Ppa, FundingSource, Office } from '@/types/global';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import TablePage from '@/pages/aip-summary/table/page';

interface AipSummaryTableProp {
    fiscalYear: FiscalYear;
    aipEntries: Ppa[];
    fundingSources: FundingSource[];
    offices: Office[];
    masterPpas: Ppa[];
}

const existingPpaIds = (aipEntries: Ppa[]) => {
    const ppaIds: Set<number> = new Set();

    const parentEntries = [...aipEntries];

    while (parentEntries.length > 0) {
        const entry = parentEntries.pop();

        if (!entry) continue;

        ppaIds.add(entry.id);

        if (entry?.children && entry.children.length > 0) {
            parentEntries.push(...entry.children);
        }

        if (!(parentEntries.length > 0)) break;
    }

    return ppaIds;
};

const findPpaInTree = (ppas: Ppa[], targetId: number) => {
    const ppasList = [...ppas];

    while (ppasList.length > 0) {
        const item = ppasList.pop();

        if (!item) continue;

        if (item.id === targetId) return item;

        if (item.children && item.children.length > 0) {
            ppasList.push(...item.children);
        }

        if (ppasList.length === 0) break;
    }

    return null;
};

// const findEntryInTree = (nodes: Ppa[], targetId: number) => {
//     for (const node of nodes) {
//         if (node.id === targetId) return node;

//         if (node.children && node.children.length > 0) {
//             const found = findEntryInTree(node.children, targetId);
//             if (found) return found;
//         }
//     }

//     return null;
// };

export default function AipSummaryTable({
    fiscalYear,
    aipEntries,
    fundingSources,
    offices,
    masterPpas,
}: AipSummaryTableProp) {
    console.log(masterPpas);
    // console.log(fiscalYear);
    // console.log(aipEntries);
    // console.log(fundingSources);

    // const [searchValue, setSearchValue] = useState('');
    // const [selectorState, setSelectorState] = useState({
    //     isOpen: false,
    //     data: [] as Ppa[],
    //     title: '',
    //     description: '',
    // });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Ppa | null>(null);
    // const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectorState, setSelectorState] = useState({
        isOpen: false,
        data: [] as Ppa[],
        title: '',
        description: '',
    });

    console.log(selectedEntry);

    // console.log(selectedEntryId);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary FY ${fiscalYear.year}`, href: '#' },
    ];

    // const selectedEntry = useMemo(() => {
    //     if (!selectedEntryId) return null;
    //     return findPpaInTree(aipEntries, selectedEntryId);
    // }, [aipEntries, selectedEntryId]);

    const handleImportLibrary = () => {
        setSelectorState({
            isOpen: true,
            data: masterPpas,
            title: 'Import from Library',
            description:
                'Select Programs, Projects, and Activities to import into this Fiscal Year.',
        });
    };

    const handleAddEntry = useCallback(
        (entry: Ppa) => {
            // 1. Find the node in the masterPpas tree to get all its potential children
            const masterNode = findPpaInTree(masterPpas, entry.id);

            if (!masterNode) {
                console.warn('This PPA does not exist in the Master Library');
                return;
            }

            // 2. Open the selector with the children of the selected PPA
            setSelectorState({
                isOpen: true,
                data: masterNode.children || [], // Only show children of this specific node
                title: `Add Sub-entries to: ${masterNode.title}`,
                description: `Select items to add under ${masterNode.type} ${masterNode.full_code}`,
            });
        },
        [masterPpas],
    );

    const handleEditDialogOpen = (data: Ppa) => {
        setSelectedEntry(data);
        setIsEditDialogOpen(true);
    };

    function handleDeleteDialogOpen(data: Ppa) {
        setSelectedEntry(data);
        setIsDeleteDialogOpen(true);
    }

    function handleDelete() {
        const entryId = selectedEntry?.aip_entries?.[0]?.id;

        router.delete(`/aip-entries/${entryId}`, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedEntry(null);
            },
            onFinish: () => setIsLoading(false),
        });
    }

    // const columns = useAipColumns({
    // onAddEntry: handleAddEntry,
    // onEdit: handleEdit,
    // onDelete: handleOpenDeleteDialog,
    // masterPpas,
    // });

    // const handleDelete = () => {
    //     if (!selectedEntry) return;

    //     router.delete(`/aip-entries/${selectedEntry.aip_entry.id}`, {
    //         preserveScroll: true,
    //         onFinish: () => {
    //             setIsDeleteDialogOpen(false);
    //             setSelectedEntry(null);
    //         },
    //     });
    // };

    function handlePrintPreview() {
        setIsExportOpen(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <TablePage
                    data={aipEntries}
                    onAdd={handleAddEntry}
                    onEdit={handleEditDialogOpen}
                    onDelete={handleDeleteDialogOpen}
                    // columns={columns}
                    // ---
                    // searchKey="title"
                    // searchValue={searchValue}
                    // onSearchChange={setSearchValue}
                    // getSubRows={(row) => row.children}
                >
                    {/* <div className="relative">
                            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects or activities..."
                                value={searchValue}
                                onChange={(event) =>
                                    setSearchValue(event.target.value)
                                }
                                className="max-w-sm pl-8"
                            />
                        </div> */}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <FileDown className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handlePrintPreview}>
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span className="text-nowrap">
                                        Print Preview
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleImportLibrary}>
                        <Library className="mr-2 h-4 w-4" /> Import from Library
                    </Button>
                    {/* </div> */}
                </TablePage>
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
                existingPpaIds={Array.from(existingPpaIds(aipEntries))}
            />

            <AipEntryFormDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                data={selectedEntry}
                fiscalYear={fiscalYear}
                fundingSources={fundingSources}
                offices={offices}
            />

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Remove from AIP Summary?"
                description={
                    <>
                        Are you sure you want to remove{' '}
                        <span className="font-bold text-foreground">
                            "{selectedEntry?.title}"
                        </span>
                        ?
                        {selectedEntry?.children &&
                            selectedEntry.children.length > 0 && (
                                <span className="mt-2 block font-semibold text-destructive italic">
                                    Warning: This will also remove all nested
                                    sub-projects and activities.
                                </span>
                            )}
                    </>
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedEntry(null);
                }}
                isLoading={isLoading}
            />

            <ExportToPdfDialog
                open={isExportOpen}
                onOpenChange={setIsExportOpen}
                aipEntries={aipEntries}
                fiscalYear={fiscalYear}
            />
        </AppLayout>
    );
}
