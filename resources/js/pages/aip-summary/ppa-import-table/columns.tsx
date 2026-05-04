import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ppa } from '@/types/global';

type SelectablePpa = Ppa & { _isSelected?: boolean; _isAdded?: boolean };

const columnHelper = createColumnHelper<SelectablePpa>();

const columns = [
    columnHelper.display({
        id: 'select',
        size: 50,
        header: 'Select',
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            const ppa = row.original;

            // Access the injected properties
            const isSelected = ppa._isSelected;
            const isAdded = ppa._isAdded;

            return (
                <div className="flex items-center justify-center">
                    <Checkbox
                        // Logic: Light up if it's in the staged Map OR already in AIP
                        checked={!!isSelected || !!isAdded}
                        disabled={isAdded}
                        onCheckedChange={() => meta.onToggle?.(ppa)}
                    />
                </div>
            );
        },
    }),
    columnHelper.accessor('full_code', {
        header: 'Code',
        cell: (info) => <code className="text-xs">{info.getValue()}</code>,
    }),
    columnHelper.accessor('name', {
        header: 'Description',
        size: 500,
        cell: ({ row }) => {
            const ppa = row.original;
            const isAdded = ppa._isAdded;

            return (
                <div
                    className={`flex flex-col py-1 ${isAdded ? 'opacity-50' : ''}`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            {ppa.type}
                        </span>
                        {isAdded && (
                            <Badge
                                variant="outline"
                                className="h-4 px-1 text-[9px]"
                            >
                                <CheckCircle2 className="mr-1 h-2 w-2" /> IN
                                SUMMARY
                            </Badge>
                        )}
                    </div>
                    <span className="text-sm leading-tight font-medium">
                        {ppa.name}
                    </span>
                </div>
            );
        },
    }),
    columnHelper.display({
        id: 'actions',
        size: 60,
        header: 'Open',
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            const ppa = row.original;
            const canOpen = ppa.type !== 'Sub-Activity';

            return (
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={!canOpen}
                    onClick={() => meta.onNavigate?.(ppa.id)}
                >
                    <FolderOpen className="h-4 w-4" />
                </Button>
            );
        },
    }),
];

export default columns;
