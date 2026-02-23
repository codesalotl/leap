import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, XCircle, Pencil, Trash, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ppa } from '@/pages/types/types';

// --- Column Definitions ---
export const columns: ColumnDef<Ppa>[] = [
    {
        accessorKey: 'full_code',
        header: 'AIP Reference Code',
        cell: ({ getValue }) => (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                {getValue<string>()}
            </code>
        ),
    },
    {
        accessorKey: 'title',
        header: 'Program/Project/Activity Description',
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

            console.log(ppa);

            return (
                <>
                    {/*<DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {ppa.type === 'Program' && (
                                <DropdownMenuItem
                                    onClick={() => meta.onAdd(ppa, 'Project')}
                                >
                                    Add Project
                                </DropdownMenuItem>
                            )}

                            {ppa.type === 'Project' && (
                                <DropdownMenuItem
                                    onClick={() => meta.onAdd(ppa, 'Activity')}
                                >
                                    Add Activity
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>*/}

                    <Button
                        onClick={() => {
                            // Logic to determine what the next child level should be
                            let nextType:
                                | 'Project'
                                | 'Activity'
                                | 'Sub-Activity';

                            if (ppa.type === 'Program') nextType = 'Project';
                            else if (ppa.type === 'Project')
                                nextType = 'Activity';
                            else nextType = 'Sub-Activity'; // If it's an Activity, add a Sub-Activity

                            meta.onAdd(ppa, nextType);
                        }}
                        size="icon"
                        disabled={ppa.type === 'Sub-Activity'}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>

                    <Button onClick={() => meta.onEdit(ppa)} size="icon">
                        <Pencil />
                    </Button>

                    <Button
                        onClick={() => meta.onDelete(ppa)}
                        size="icon"
                        variant="destructive"
                    >
                        <Trash />
                    </Button>
                </>
            );
        },
    },
];
