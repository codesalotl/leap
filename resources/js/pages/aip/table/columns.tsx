import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

// 1. Define the shape based on your masterPpas JSON
export type MasterPpa = {
    id: number;
    full_code: string;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    is_active: boolean;
    // You can add more fields if needed, like office
};

export const columns: ColumnDef<MasterPpa>[] = [
    {
        accessorKey: 'full_code',
        header: 'Code',
        cell: ({ row }) => (
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                {row.getValue('full_code')}
            </code>
        ),
    },
    {
        accessorKey: 'title',
        header: 'Description',
        cell: ({ row }) => (
            <div className="max-w-[400px] truncate font-medium">
                {row.getValue('title')}
            </div>
        ),
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            return (
                <Badge variant="outline" className="capitalize">
                    {type}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row, table }) => {
            const ppa = row.original;
            
            // Note: We use meta to pass functions from the main component to the columns
            // You will need to define 'onSelect' in your table options meta
            return (
                <Button 
                    size="sm" 
                    className="h-8 gap-1"
                    onClick={() => {
                        // @ts-ignore - 'onSelectPpa' will be passed via table meta
                        table.options.meta?.onSelectPpa(ppa);
                    }}
                >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                </Button>
            );
        },
    },
];