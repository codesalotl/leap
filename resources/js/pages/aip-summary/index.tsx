import { useState, useMemo, useCallback } from 'react';

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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import AppLayout from '@/layouts/app-layout';
import DataTable from '@/pages/aip-summary/table/data-table';
import PpaSelectorDialog from '@/pages/aip-summary/ppa-selector-dialog';
import DeleteDialog from '@/pages/aip-summary/delete-dialog';
import AipEntryFormDialog from '@/pages/aip-summary/aip-entry-form-dialog';
import { useAipColumns } from '@/pages/aip-summary/table/columns';
import {
    // exportToExcel,
    // exportToPDF,
    exportToPrint,
} from '@/pages/aip-summary/utils/export-utils';

import { type AipEntry, FiscalYear, Ppa } from '@/pages/types/types';
import { type BreadcrumbItem } from '@/types';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';

interface AipSummaryTableProp {
    fiscalYear: FiscalYear;
    aipEntries: Ppa[];
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
    masterPpas,
}: AipSummaryTableProp) {
    console.log(fiscalYear);
    console.log(aipEntries);
    console.log(masterPpas);

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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        { title: `AIP Summary FY ${fiscalYear.year}`, href: '#' },
    ];

    const selectedEntry = useMemo(() => {
        console.log(selectedEntryId);
        console.log(!selectedEntryId);

        if (!selectedEntryId) return null;

        console.log(selectedEntryId);

        // return findEntryInTree(aipEntries, selectedEntryId);
        console.log(findPpaInTree(aipEntries, selectedEntryId));

        return findPpaInTree(aipEntries, selectedEntryId);
    }, [aipEntries, selectedEntryId]);

    console.log(selectedEntry);

    const handleImportLibrary = () => {
        setSelectorState({
            isOpen: true,
            data: masterPpas,
            title: 'Import from Library',
            description:
                'Select Programs, Projects, and Activities to import. Items already in the AIP are disabled.',
        });
    };

    const handleAddEntry = (entry: Ppa) => {
        const masterNode = findPpaInTree(masterPpas, entry.aip_entry.ppa_id);

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

    const handleEdit = useCallback((entry) => {
        console.log(entry.id);
        setSelectedEntryId(entry.id);
        setIsEditOpen(true);
    }, []);

    const handleOpenDeleteDialog = useCallback((entry) => {
        setSelectedEntryId(entry.id);
        setIsDeleteAlertOpen(true);
    }, []);

    const columns = useAipColumns({
        onAddEntry: handleAddEntry,
        onEdit: handleEdit,
        onDelete: handleOpenDeleteDialog,
        masterPpas,
    });

    const handleExportExcel = () => {
        exportToExcel(aipEntries, fiscalYear);
    };

    const handleExportPDF = () => {
        exportToPrint({ aipEntries, fiscalYear });

        // import { Ppmp, PpmpCategory, ChartOfAccount } from '@/pages/types/types';
    };

    // 1. Configuration & Widths (Total must sum to 100)
    const COLUMN_KEYS = [
        'aipCode',
        'description',
        'office',
        'start',
        'end',
        'outputs',
        'funding',
        'ps',
        'mooe',
        'fe',
        'co',
        'total',
        'adaptation',
        'mitigation',
        'typology',
    ];

    const COLUMN_WIDTHS = [
        6, // aipCode
        12, // description
        7, // office
        5, // start
        5, // end
        7, // outputs
        7, // funding
        7, // ps
        10, // mooe
        6, // fe
        6, // co
        8, // total
        5, // adaptation
        5, // mitigation
        4, // typology
    ];

    const styles = StyleSheet.create({
        page: {
            padding: 36,
        },
        table: {
            display: 'table',
            width: '100%',
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderColor: '#000',
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCol: {
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            borderColor: '#000',
        },
        tableCell: {
            margin: 2,
            fontSize: 6,
            textAlign: 'center',
        },
        headerGroup: {
            flexDirection: 'column',
            padding: 0,
        },
    });

    const MyDocument = ({ mockData }) => {
        const renderCell = (item, index) => {
            const key = COLUMN_KEYS[index];
            return item[key] || '';
        };

        return (
            <Document>
                <Page
                    size={[612, 936]} // 8.5" x 13"
                    orientation="landscape"
                    style={styles.page}
                >
                    <View style={styles.table}>
                        {/* --- ROW 0: COMPLEX HEADERS --- */}
                        <View
                            style={[
                                styles.tableRow,
                                { backgroundColor: '#f0f0f0' },
                            ]}
                        >
                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[0]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>AIP REF</Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[1]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>
                                    DESCRIPTION
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[2]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>OFFICE</Text>
                            </View>

                            {/* Nested Schedule Group */}
                            <View
                                style={[
                                    styles.tableCol,
                                    styles.headerGroup,
                                    {
                                        width: `${COLUMN_WIDTHS[3] + COLUMN_WIDTHS[4]}%`,
                                    },
                                ]}
                            >
                                <View style={{ borderBottomWidth: 1 }}>
                                    <Text style={styles.tableCell}>
                                        SCHEDULE
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View
                                        style={[
                                            styles.tableCol,
                                            {
                                                width: '50%',
                                                borderLeftWidth: 0,
                                                borderBottomWidth: 0,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.tableCell}>
                                            START
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.tableCol,
                                            {
                                                width: '50%',
                                                borderBottomWidth: 0,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.tableCell}>
                                            END
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[5]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>OUTPUTS</Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[6]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>SOURCE</Text>
                            </View>

                            {/* Nested Amount Group (Indices 7-11) */}
                            <View
                                style={[
                                    styles.tableCol,
                                    styles.headerGroup,
                                    {
                                        width: `${COLUMN_WIDTHS.slice(7, 12).reduce((a, b) => a + b, 0)}%`,
                                    },
                                ]}
                            >
                                <View style={{ borderBottomWidth: 1 }}>
                                    <Text style={styles.tableCell}>AMOUNT</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {['PS', 'MOOE', 'FE', 'CO', 'TOTAL'].map(
                                        (label, i) => {
                                            const groupSum =
                                                COLUMN_WIDTHS.slice(
                                                    7,
                                                    12,
                                                ).reduce((a, b) => a + b, 0);
                                            const innerWidth =
                                                (COLUMN_WIDTHS[7 + i] /
                                                    groupSum) *
                                                100;
                                            return (
                                                <View
                                                    key={label}
                                                    style={[
                                                        styles.tableCol,
                                                        {
                                                            width: `${innerWidth}%`,
                                                            borderLeftWidth:
                                                                i === 0 ? 0 : 1,
                                                            borderBottomWidth: 0,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={styles.tableCell}
                                                    >
                                                        {label}
                                                    </Text>
                                                </View>
                                            );
                                        },
                                    )}
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[12]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>ADAPT</Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[13]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>MITIG</Text>
                            </View>
                            <View
                                style={[
                                    styles.tableCol,
                                    { width: `${COLUMN_WIDTHS[14]}%` },
                                ]}
                            >
                                <Text style={styles.tableCell}>TYPO</Text>
                            </View>
                        </View>

                        {/* --- ROW 1: NUMBERED ROW --- */}
                        <View
                            style={[
                                styles.tableRow,
                                { backgroundColor: '#e0e0e0' },
                            ]}
                        >
                            {COLUMN_WIDTHS.map((width, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.tableCol,
                                        { width: `${width}%` },
                                    ]}
                                >
                                    <Text style={styles.tableCell}>
                                        ({i + 1})
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* --- ROW 2+: DATA ROWS --- */}
                        {mockData.map((item, rowIndex) => (
                            <View key={rowIndex} style={styles.tableRow}>
                                {COLUMN_WIDTHS.map((width, colIndex) => (
                                    <View
                                        key={colIndex}
                                        style={[
                                            styles.tableCol,
                                            { width: `${width}%` },
                                        ]}
                                    >
                                        <Text style={styles.tableCell}>
                                            {renderCell(item, colIndex)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    };

    // Example Usage
    const sampleData = [
        {
            aipCode: '1000-01',
            description: 'General Administration and Support Services',
            office: 'MAYOR',
            start: '01/2026',
            end: '12/2026',
            outputs: '12 Reports',
            funding: 'GF',
            ps: '500,000',
            mooe: '250,000',
            fe: '0',
            co: '100,000',
            total: '850,000',
            adaptation: 'Yes',
            mitigation: 'No',
            typology: 'Admin',
        },
    ];

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
                            searchKey="title"
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
                existingPpaIds={Array.from(existingPpaIds(aipEntries))}
            />

            <AipEntryFormDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                data={selectedEntry}
                fiscalYear={fiscalYear}
            />

            {/*alert dialog*/}
            <DeleteDialog
                isDeleteAlertOpen={isDeleteAlertOpen}
                setIsDeleteAlertOpen={setIsDeleteAlertOpen}
                selectedEntry={selectedEntry}
                setSelectedEntryId={setSelectedEntryId}
            />

            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent className="m-0 h-full rounded-none p-0 pt-11 sm:max-w-full">
                    <DialogTitle className="sr-only">PDF Viewer</DialogTitle>
                    <DialogDescription className="sr-only">
                        This is a PDF Viewer.
                    </DialogDescription>

                    <div className="h-full rounded-none bg-white sm:max-w-full">
                        <PDFViewer width="100%" height="100%">
                            <MyDocument mockData={sampleData} />
                        </PDFViewer>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
