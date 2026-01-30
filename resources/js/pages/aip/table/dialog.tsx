import * as React from 'react';
import { useState, useMemo } from 'react';
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
import DataTable from '@/components/ui/data-table';

interface MasterPpa {
    id: number;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    full_code: string;
    is_active: boolean;
    children?: MasterPpa[];
}

interface AddEntryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ppaMasterData: MasterPpa | null;
    fiscalYearsId: number;
    existingPpaIds: Set<number>;
}

export default function AddEntryFormDialog({
    open,
    onOpenChange,
    ppaMasterData,
    fiscalYearsId,
    existingPpaIds,
}: AddEntryFormDialogProps) {
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // We turn the single master branch into an array so the table can process it
    const tableData = useMemo(
        () => (ppaMasterData ? [ppaMasterData] : []),
        [ppaMasterData],
    );

    const columns = useMemo<ColumnDef<MasterPpa>[]>(
        () => [
            {
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
                cell: ({ row }) => {
                    const isAlreadyInAip = existingPpaIds.has(row.original.id);

                    <Checkbox
                        checked={row.getIsSelected() || isAlreadyInAip}
                        disabled={isAlreadyInAip}
                        onCheckedChange={(value) => {
                            if (isAlreadyInAip) return;

                            setRowSelection((prev) => {
                                const next = { ...prev };
                                const isChecked = !!value;
                                if (isChecked) {
                                    next[row.id] = true;
                                    let parent = row.getParentRow();
                                    while (parent) {
                                        next[parent.id] = true;
                                        parent = parent.getParentRow();
                                    }
                                } else {
                                    delete next[row.id];
                                    const recursiveUncheck = (r: any) => {
                                        r.subRows?.forEach((child: any) => {
                                            delete next[child.id];
                                            recursiveUncheck(child);
                                        });
                                    };
                                    recursiveUncheck(row);
                                }
                                return next;
                            });
                        }}
                    />;
                },
            },
            {
                accessorKey: 'title',
                header: 'Type & Description',
                cell: ({ row }) => {
                    const isAlreadyInAip = existingPpaIds.has(row.original.id);
                    return (
                        <div
                            style={{ paddingLeft: `${row.depth * 20}px` }}
                            className="flex items-center gap-2"
                        >
                            {row.depth > 0 && (
                                <span className="text-muted-foreground opacity-50">
                                    ↳
                                </span>
                            )}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] leading-none font-bold text-muted-foreground uppercase">
                                        {row.original.type}
                                    </span>
                                    {isAlreadyInAip && (
                                        <Badge
                                            variant="secondary"
                                            className="h-4 border-green-200 bg-green-100 px-1 text-[8px] font-bold text-green-700 uppercase"
                                        >
                                            Added
                                        </Badge>
                                    )}
                                </div>
                                <span
                                    className={`text-sm ${row.depth === 0 ? 'font-bold' : 'font-medium'} ${isAlreadyInAip ? 'text-muted-foreground' : ''}`}
                                >
                                    {row.original.title}
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
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                        {getValue<string>()}
                    </code>
                ),
            },
        ],
        [existingPpaIds],
    );

    const table = useReactTable({
        data: tableData,
        columns,
        getSubRows: (row) => row.children,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getRowId: (row) => row.id.toString(),
        enableSubRowSelection: false,
        state: {
            rowSelection,
            globalFilter,
            expanded: true, // Always expanded to show the tree
        },
    });

    const handleImport = () => {
        // Filter out IDs that are already in the summary, just in case
        const selectedIds = table
            .getSelectedRowModel()
            .flatRows.map((row) => row.original.id)
            .filter((id) => !existingPpaIds.has(id));

        if (selectedIds.length === 0) return;

        setLoading(true);
        router.post(
            `/aip/${fiscalYearsId}/import`,
            { ppa_ids: selectedIds },
            {
                onSuccess: () => {
                    setLoading(false);
                    onOpenChange(false);
                    setRowSelection({});
                },
                onError: () => setLoading(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden p-0 sm:max-w-[70%]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Import from Library</DialogTitle>
                    <DialogDescription>
                        Select specific items from{' '}
                        <span className="font-bold">
                            "{ppaMasterData?.title}"
                        </span>{' '}
                        to include in your AIP.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-2">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter these results..."
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-2">
                    {/* <div className="rounded-md border">
                        <Table>
                            <TableHeader className="sticky top-0 z-20 bg-muted">
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((h) => (
                                            <TableHead
                                                key={h.id}
                                                className="text-[10px] font-bold uppercase"
                                            >
                                                {flexRender(
                                                    h.column.columnDef.header,
                                                    h.getContext(),
                                                )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-2"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div> */}

                    <DataTable table={table} />
                </div>

                <DialogFooter className="flex items-center justify-between border-t bg-muted/30 p-4">
                    <div className="text-xs font-medium text-muted-foreground">
                        {Object.keys(rowSelection).length} items marked for
                        import
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleImport}
                            disabled={
                                loading ||
                                Object.keys(rowSelection).length === 0
                            }
                        >
                            <Download className="mr-2 h-4 w-4" />
                            {loading ? 'Importing...' : 'Add to AIP Summary'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
