import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type AipCollection = {
    id: number;
    year: string;
    created_at: string;
    updated_at: string;
};

type AipCollectionProp = {
    aipCollection: AipCollection[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AIP Collections',
        href: '/aip-collections',
    },
];

const columnHelper = createColumnHelper<AipCollection>();

const columns = [
    columnHelper.accessor('id', {
        header: 'Id',
    }),
    columnHelper.accessor('year', {
        header: 'Year',
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
    }),
    columnHelper.accessor('updated_at', {
        header: 'Updated At',
    }),
    columnHelper.display({
        header: 'Action',
        cell: ({ row }) => {
            return <Button size="sm">Open</Button>;
        },
    }),
];

const formSchema = z.object({
    year: z.string().min(1, { message: 'Please select a year' }),
});

function getShadcnYearData() {
    const currentYear = new Date().getFullYear();
    const yearsBack = 5;
    const yearsFront = 5;

    const startYear = currentYear - yearsBack;
    const endYear = currentYear + yearsFront;

    const yearData = [];

    // Loop from the latest year (endYear) down to the earliest (startYear)
    for (let year = endYear; year >= startYear; year--) {
        const yearString = String(year);
        yearData.push({
            value: yearString,
            label: yearString,
        });
    }

    return yearData;
}

export default function Layout({ aipCollection }: AipCollectionProp) {
    // console.log(aipCollection);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            year: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);

        router.post('/aip-collections', values, {
            onSuccess: () => {
                // Close the dialog on success
                setIsDialogOpen(false);
                // Reset the form
                form.reset();
            },
            onError: (errors) => {
                // Inertia automatically handles validation errors,
                // but you can log them here if needed.
                console.error(errors);
            },
        });
    }

    const table = useReactTable({
        data: aipCollection,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const yearsForSelect = getShadcnYearData();
    // console.log(yearsForSelect);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="flex items-center justify-between py-4">
                    <Input
                        placeholder="Filter AIP collections..."
                        value={
                            (table
                                .getColumn('year')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('year')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value,
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>Create AIP Summary Form</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Create AIP Summary Form
                                    </DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        save when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <div className="grid gap-3">
                                        {/*<Label htmlFor="name-1">
                                                Select Year
                                            </Label>*/}
                                        {/*<Input
                                                id="name-1"
                                                name="name"
                                                defaultValue="Pedro Duarte"
                                            />*/}

                                        <Form {...form}>
                                            <form
                                                id="aip-collection-form"
                                                onSubmit={form.handleSubmit(
                                                    onSubmit,
                                                )}
                                                className="space-y-8"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="year"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Select Year
                                                            </FormLabel>
                                                            <FormControl>
                                                                {/*<Input placeholder="shadcn" {...field} />*/}
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }
                                                                >
                                                                    <SelectTrigger className="w-[280px]">
                                                                        <SelectValue placeholder="Select a year" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {yearsForSelect.map(
                                                                            (
                                                                                item,
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        item.value
                                                                                    } // Unique key for list rendering
                                                                                    value={
                                                                                        item.value
                                                                                    } // The actual year value (e.g., '2025')
                                                                                >
                                                                                    {
                                                                                        item.label
                                                                                    }
                                                                                    {/* The displayed year (e.g., 2025) */}
                                                                                </SelectItem>
                                                                            ),
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            {/*<FormDescription>
                                                                    This is your
                                                                    public
                                                                    display
                                                                    name.
                                                                </FormDescription>*/}
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {/*<Button type="submit">
                                                        Submit
                                                    </Button>*/}
                                            </form>
                                        </Form>
                                    </div>
                                    {/*<div className="grid gap-3">
                                            <Label htmlFor="username-1">
                                                Username
                                            </Label>
                                            <Input
                                                id="username-1"
                                                name="username"
                                                defaultValue="@peduarte"
                                            />
                                        </div>*/}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        form="aip-collection-form"
                                    >
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
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
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    {/*<div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
                    </div>*/}
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
