import * as React from 'react';
import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';

import { DataTable } from '@/pages/aip/ppa-import-table/data-table';
import { getPpaColumns, Ppa } from '@/pages/aip/ppa-import-table/columns';
import { RowSelectionState } from '@tanstack/react-table';

interface PpaSelectorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    data: Ppa[]; // <--- Dynamic Data
    title: string; // <--- Dynamic Title
    description: string; // <--- Dynamic Desc
    fiscalYearId: number;
    existingPpaIds: number[];
}

export default function PpaSelectorDialog({
    isOpen,
    onClose,
    data,
    title,
    description,
    fiscalYearId,
    existingPpaIds = [], 
}: PpaSelectorDialogProps) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);

    // Create a Set for faster lookups in the column definitions
    const existingIdsSet = useMemo(() => new Set(existingPpaIds), [existingPpaIds]);

    // Pass the existing IDs Set to the columns
    const columns = useMemo(() => getPpaColumns({ 
        setRowSelection, 
        existingPpaIds: existingIdsSet 
    }), [setRowSelection, existingIdsSet]);

    const handleImport = () => {
        // Since rowSelection keys are the string IDs
        // Filter out any IDs that are already in existingIdsSet (just in case)
        const selectedIds = Object.keys(rowSelection).filter(id => !existingIdsSet.has(Number(id)));
        
        console.log("Importing IDs:", selectedIds);

        if (selectedIds.length === 0) return;

        setLoading(true);

        router.post(
            `/aip/${fiscalYearId}/import`,
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

    // Calculate actual new items selected (excluding already added ones that might be visually checked)
    const newSelectedCount = Object.keys(rowSelection).filter(id => !existingIdsSet.has(Number(id))).length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-[80%]">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
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
                    <DataTable
                        columns={columns}
                        data={data}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        getSubRows={(row) => row.children}
                    />
                </div>

                <DialogFooter className="flex items-center justify-between border-t bg-muted/30 p-6 pt-3">
                    <div className="text-sm text-muted-foreground">
                        {newSelectedCount} new item(s) selected
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={newSelectedCount === 0 || loading}
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
