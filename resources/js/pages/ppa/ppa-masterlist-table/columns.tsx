// resources\js\pages\ppa\ppa-masterlist-table\columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, MoreHorizontal, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Interfaces ---
export interface Ppa {
    id: number;
    office_id: number;
    parent_id: number | null;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    code_suffix: string;
    is_active: boolean;
    full_code: string;
    created_at: string;
    updated_at: string;
    children?: Ppa[];
}

// --- Column Definitions ---
export const columns: ColumnDef<Ppa>[] = [
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
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            {ppa.type}
                        </span>
                        <span
                            className={`leading-tight break-words whitespace-normal ${
                                row.depth === 0 ? 'font-bold' : 'font-medium'
                            }`}
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
        header: 'Aip Reference Code',
        cell: ({ getValue }) => (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                {getValue<string>()}
            </code>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ getValue }) => {
            const active = getValue<boolean>();
            return active ? (
                <Badge variant="primary">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                </Badge>
            ) : (
                <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" /> Inactive
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        size: 30,
        cell: ({ row, table }) => {
            const ppa = row.original;
            const meta = table.options.meta as any;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        {/* 1. Edit is always available */}
                        <DropdownMenuItem onClick={() => meta.onEdit(ppa)}>
                            Edit Details
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* 2. Strict Hierarchy Logic */}

                        {/* If it's a Program, it can ONLY have a Project */}
                        {ppa.type === 'Program' && (
                            <DropdownMenuItem
                                onClick={() => meta.onAdd(ppa, 'Project')}
                            >
                                Add Project
                            </DropdownMenuItem>
                        )}

                        {/* If it's a Project, it can ONLY have an Activity */}
                        {ppa.type === 'Project' && (
                            <DropdownMenuItem
                                onClick={() => meta.onAdd(ppa, 'Activity')}
                            >
                                Add Activity
                            </DropdownMenuItem>
                        )}

                        {/* Note: If it's an Activity, no "Add" options will appear */}

                        <DropdownMenuSeparator />

                        {/* 3. Delete Logic */}
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => meta.onDelete(ppa)}
                        >
                            Delete {ppa.type}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
