import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    getExpandedRowModel,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    ChevronDown,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import PpaFormDialog from '@/pages/ppa/form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';
import DataTable from '@/components/ui/data-table';

type DialogMode = 'add' | 'edit';

interface Sector {
    id: number;
    code: string;
}

interface LguLevel {
    id: number;
    code: string;
}

interface OfficeType {
    id: number;
    code: string;
}

interface Office {
    id: number;
    sector_id: number;
    lgu_level_id: number;
    office_type_id: number;
    code: string;
    name: string;
    is_lee: number; // Use 0 | 1 if you want to be stricter
    created_at: string;
    updated_at: string;
    full_code: string;

    // Relationships (Eager Loaded)
    sector?: Sector;
    lgu_level?: LguLevel;
    office_type?: OfficeType;
}

interface Ppa {
    id: number;
    office_id: number;
    parent_id: number | null;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    code_suffix: string; // 001, 002, etc.
    is_active: boolean;
    full_code: string;
    created_at: string;
    updated_at: string;
    children?: Ppa[]; // Recursive children for the tree
}

interface PpaProps {
    ppaTree: Ppa[]; // Renamed to ppaTree to reflect hierarchical data
    offices: Office[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPA Master Library',
        href: '/offices',
    },
];

export const columns: ColumnDef<Ppa>[] = [
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
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
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
                                row.depth === 0 ? 'font-bold' : 'font-medium'
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
        header: 'Aip Reference Code',
        cell: ({ getValue }) => (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
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
                <Badge
                    variant="primary"
                    // className="gap-1 border-green-200 bg-green-50 text-green-600"
                >
                    <CheckCircle2 className="h-3 w-3" /> Active
                </Badge>
            ) : (
                <Badge
                    variant="destructive"
                    // className="gap-1 text-muted-foreground"
                >
                    <XCircle className="h-3 w-3" /> Inactive
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ getValue }) => {
            const date = new Date(getValue());
            return date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        },
    },
    {
        id: 'actions',
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
                        <DropdownMenuItem onClick={() => meta.onEdit(ppa)}>
                            Edit Details
                        </DropdownMenuItem>

                        {/* Validation Logic: Program -> Project/Activity, Project -> Activity */}
                        {ppa.type === 'Program' && (
                            <DropdownMenuItem
                                onClick={() => meta.onAdd(ppa, 'Project')}
                            >
                                Add Project
                            </DropdownMenuItem>
                        )}
                        {(ppa.type === 'Program' || ppa.type === 'Project') && (
                            <DropdownMenuItem
                                onClick={() => meta.onAdd(ppa, 'Activity')}
                            >
                                Add Activity
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
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

export default function PpaPage({ ppaTree, offices }: PpaProps) {
    console.log(ppaTree);
    console.log(offices);
    // console.log(sectors);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<DialogMode>('add');
    const [activePpa, setActivePpa] = useState<Ppa | null>(null);
    const [targetType, setTargetType] = useState<Ppa['type']>('Program');
    const [ppaToDelete, setPpaToDelete] = useState<Ppa | null>(null);

    const [value, setValue] = useState('');
    const [globalFilter, setGlobalFilter] = useState('');

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setGlobalFilter(value);
        }, 300); // 300ms delay

        return () => clearTimeout(timeout);
    }, [value]);

    const table = useReactTable({
        data: ppaTree || [],
        columns,
        getSubRows: (row) => row.children ?? [],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        // ADD THESE TWO LINES:
        filterFromLeafRows: true, // Search children and include parents if a child matches
        globalFilterFn: 'includesString', // Ensure it's using the standard string search
        state: {
            expanded: true,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        meta: {
            onAdd: (parent: Ppa, childType: Ppa['type']) => {
                setDialogMode('add');
                setActivePpa(parent);
                setTargetType(childType);
                setIsDialogOpen(true);
            },
            onEdit: (ppa: Ppa) => {
                setDialogMode('edit');
                setActivePpa(ppa);
                setTargetType(ppa.type);
                setIsDialogOpen(true);
            },
            onDelete: (ppa: Ppa) => {
                setPpaToDelete(ppa);
                setIsDeleteDialogOpen(true);
            },
        },
    });

    const confirmDelete = () => {
        if (!ppaToDelete) return;
        router.delete(`/ppas/${ppaToDelete.id}`, {
            onSuccess: () => setIsDeleteDialogOpen(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <div className="flex items-center justify-between py-4">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search Programs/Projects/Activities..."
                        className="max-w-sm"
                    />

                    <Button
                        onClick={() => {
                            setDialogMode('add');
                            setActivePpa(null);
                            setTargetType('Program');
                            setIsDialogOpen(true);
                        }}
                    >
                        New Program
                    </Button>
                </div>

                {/* <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-sm text-muted-foreground"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
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
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
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
                                        No PPAs found for this office.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div> */}

                <DataTable table={table} />

                {/* Main Form Dialog */}
                <PpaFormDialog
                    mode={dialogMode}
                    data={activePpa}
                    type={targetType}
                    onSuccess={() => setIsDialogOpen(false)}
                    offices={offices}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    dialogMode={dialogMode}
                    targetType={targetType}
                    activePpa={activePpa}
                />

                {/* Delete Alert */}
                <AlertDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete {ppaToDelete?.type}?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will permanently remove{' '}
                                <span className="font-semibold text-foreground">
                                    {ppaToDelete?.title}
                                </span>
                                .
                                {ppaToDelete?.type !== 'Activity' && (
                                    <span className="mt-2 block text-xs font-medium text-destructive uppercase">
                                        Warning: All nested sub-projects and
                                        activities will also be deleted.
                                    </span>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-white hover:bg-destructive/90"
                            >
                                Delete Permanently
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
