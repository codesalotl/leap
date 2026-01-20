import * as React from 'react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, CheckCircle2, XCircle } from 'lucide-react';

interface Ppa {
    id: number;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    full_code: string;
    is_active: boolean;
    children?: Ppa[];
}

interface PpaImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    ppaTree: Ppa[];
    fiscalYearsId: number;
}

export default function PpaImportModal({
    isOpen,
    onClose,
    ppaTree,
    fiscalYearsId,
}: PpaImportModalProps) {
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const columns: ColumnDef<Ppa>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        // 1. Toggle the row and all its children (downward)
                        row.toggleSelected(!!value);

                        // 2. Custom Logic: If checking a child, force all ancestors to be checked (upward)
                        if (!!value) {
                            let parent = row.getParentRow();
                            while (parent) {
                                parent.toggleSelected(true);
                                parent = parent.getParentRow();
                            }
                        }
                    }}
                    aria-label="Select row"
                />
            ),
        },
        {
            accessorKey: 'title',
            header: 'Type & Title',
            cell: ({ row }) => {
                const ppa = row.original;
                return (
                    <div
                        style={{ paddingLeft: `${row.depth * 24}px` }}
                        className="flex items-center gap-2"
                    >
                        {row.depth > 0 && (
                            <span className="text-muted-foreground opacity-50">
                                ↳
                            </span>
                        )}
                        <div className="flex flex-col">
                            <span className="text-[10px] leading-none font-bold text-muted-foreground uppercase">
                                {ppa.type}
                            </span>
                            <span
                                className={
                                    row.depth === 0
                                        ? 'font-bold'
                                        : 'font-medium'
                                }
                            >
                                {ppa.title}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'full_code',
            header: 'Code',
            cell: ({ getValue }) => (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold">
                    {getValue<string>()}
                </code>
            ),
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ getValue }) =>
                getValue<boolean>() ? (
                    <Badge
                        variant="secondary"
                        className="h-5 px-1.5 text-[10px]"
                    >
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                    </Badge>
                ) : (
                    <Badge
                        variant="destructive"
                        className="h-5 px-1.5 text-[10px]"
                    >
                        <XCircle className="mr-1 h-3 w-3" /> Inactive
                    </Badge>
                ),
        },
    ];

    const table = useReactTable({
        data: ppaTree || [],
        columns,
        getSubRows: (row) => row.children,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,

        // Ensure that selecting a parent row selects all sub-rows
        enableSubRowSelection: true,

        filterFromLeafRows: true,
        state: {
            rowSelection,
            globalFilter,
            expanded: true,
        },
    });

    const handleImport = () => {
        // USE flatRows TO GET EVERY SINGLE SELECTED CHILD/GRANDCHILD
        const selectedIds = table
            .getSelectedRowModel()
            .flatRows.map((row) => row.original.id);

        console.log('selectedIds', selectedIds);

        if (selectedIds.length === 0) return;

        setLoading(true);

        router.post(
            `/aip/${fiscalYearsId}/import`,
            { ppa_ids: selectedIds },
            {
                onSuccess: () => {
                    setLoading(false);
                    onClose();
                    setRowSelection({}); // Clear checkboxes after import
                },
                onError: () => setLoading(false),
            },
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[80%]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Import PPA from Library</DialogTitle>
                    <DialogDescription>
                        Select the Programs and their nested Projects/Activities
                        to import.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search library..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="bg-muted/50 pl-9"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader className="sticky top-0 z-20 bg-muted">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                key={header.id}
                                                className="text-[11px] tracking-wider uppercase"
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="py-2"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
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
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No programs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between border-t bg-muted/30 p-6 pt-3">
                    <div className="text-sm text-muted-foreground">
                        {table.getSelectedRowModel().flatRows.length} items
                        selected
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={
                                table.getSelectedRowModel().flatRows.length ===
                                    0 || loading
                            }
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {loading ? 'Importing...' : 'Import Selected'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
