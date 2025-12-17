import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import AipAlertDialog from '@/pages/aip/aip-alert-dialog';
import AipDialog from '@/pages/aip/aip-dialog';
import { formatData, nestData } from '@/pages/aip/aip-utils';
import type { Aip, AipProp } from '@/pages/aip/types';
import { type BreadcrumbItem } from '@/types';
import {
    Column,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { CSSProperties, useMemo } from 'react';

const initialFormData: Aip = {
    id: 0,
    aipRefCode: '',
    ppaDescription: '',
    implementingOfficeDepartmentLocation: '',
    scheduleOfImplementation: {
        startingDate: '',
        completionDate: '',
    },
    expectedOutputs: '',
    fundingSource: '',
    amount: {
        ps: '',
        mooe: '',
        fe: '',
        co: '',
        total: '',
    },
    amountOfCcExpenditure: {
        ccAdaptation: '',
        ccMitigation: '',
    },
    ccTypologyCode: '',
    children: [],
    created_at: '',
    updated_at: '',
};

const columnHelper = createColumnHelper<Aip>();

const getCommonPinningStyles = (column: Column<Aip>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px gray inset'
            : isFirstRightPinnedColumn
              ? '4px 0 4px -4px gray inset'
              : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

export default function Aip({ collection, data, programs }: AipProp) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'AIP Collections',
            href: '/aip-collections',
        },
        {
            title: `AIP Summary Form ${collection.year}`,
            href: '/aip-collections',
        },
    ];

    const tableData = useMemo(() => {
        return nestData(formatData(data));
    }, [data]);

    // const defaultColumns = ;

    const columns = useMemo(
        () => [
            columnHelper.accessor('aipRefCode', {
                header: 'AIP Ref. Code',
            }),
            columnHelper.accessor('ppaDescription', {
                header: 'Program/Project/Activity Description',
            }),
            columnHelper.accessor('implementingOfficeDepartmentLocation', {
                header: 'Implementing Office Department Location',
            }),
            columnHelper.group({
                header: 'Schedule of Implementation',
                columns: [
                    columnHelper.accessor(
                        (row) => row.scheduleOfImplementation.startingDate,
                        {
                            id: 'startingDate',
                            header: 'Starting Date',
                        },
                    ),
                    columnHelper.accessor(
                        (row) => row.scheduleOfImplementation.completionDate,
                        {
                            id: 'completionDate',
                            header: 'Completion Date',
                        },
                    ),
                ],
            }),
            columnHelper.accessor('expectedOutputs', {
                header: 'Expected Outputs',
            }),
            columnHelper.accessor('fundingSource', {
                header: 'Funding Source',
            }),
            columnHelper.group({
                header: 'Amount',
                columns: [
                    columnHelper.accessor((row) => row.amount.ps, {
                        id: 'ps',
                        header: 'Personal Services (PS)',
                        size: 100,
                    }),
                    columnHelper.accessor((row) => row.amount.mooe, {
                        id: 'mooe',
                        header: 'Maintenance and Other Operating Expenses (MOOE)',
                        size: 100,
                    }),
                    columnHelper.accessor((row) => row.amount.fe, {
                        id: 'fe',
                        header: 'Financial Expenses (FE)',
                        size: 100,
                    }),
                    columnHelper.accessor((row) => row.amount.co, {
                        id: 'co',
                        header: 'Capital Outlay (CO)',
                        size: 100,
                    }),
                    columnHelper.accessor((row) => row.amount.total, {
                        id: 'total',
                        header: 'Total',
                        size: 100,
                    }),
                ],
            }),
            columnHelper.group({
                header: 'Amount of Climate Change Expenditure',
                columns: [
                    columnHelper.accessor(
                        (row) => row.amountOfCcExpenditure.ccAdaptation,
                        {
                            id: 'ccAdaptation',
                            header: 'Climate Change Adaption',
                        },
                    ),
                    columnHelper.accessor(
                        (row) => row.amountOfCcExpenditure.ccMitigation,
                        {
                            id: 'ccMitigation',
                            header: 'Climate Change Mitigation',
                        },
                    ),
                ],
            }),
            columnHelper.accessor('ccTypologyCode', {
                header: 'CC Typology Code',
            }),
            columnHelper.display({
                id: 'action',
                header: 'Action',
                cell: ({ row }) => {
                    const idLength = row.id.split('.').length;
                    const isHidden = idLength === 3;

                    const hasParent = row.original.parentId === null;

                    console.log(row.original);

                    return (
                        <div className="flex gap-2">
                            <AipDialog
                                id={row.original.id}
                                aipRefCode={row.original.aipRefCode}
                                collectionId={collection.id}
                                data={initialFormData}
                                mode="add"
                                hidden={isHidden}
                            />
                            <AipDialog data={row.original} mode="edit" />
                            <AipAlertDialog
                                data={row.original}
                                hidden={hasParent}
                            />
                        </div>
                    );
                },
            }),
        ],
        [],
    );

    const table = useReactTable({
        columns,
        data: tableData, // <--- Use the memoized variable
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.children,
        state: {
            expanded: true,
        },
        initialState: {
            columnPinning: {
                right: ['action'],
            },
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                {/*<ExportToPDFButton />*/}
                {/*<ExportToExcelButton />*/}
                {/*<AipDialog data={initialFormData} mode="create" />*/}
                {/*<div className="flex">
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {programs.map((program) => (
                                    <SelectItem key={program.id} value={program.id}>
                                        {program.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button>Add</Button>
                </div>*/}

                {/*<ProgramForm programs={programs} />*/}

                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => {
                            return (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        const { column } = header;
                                        return (
                                            <TableHead
                                                key={header.id}
                                                colSpan={header.colSpan}
                                                style={{
                                                    ...getCommonPinningStyles(
                                                        column,
                                                    ),
                                                    width: header.getSize(),
                                                }}
                                                className="border bg-background"
                                            >
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
                            );
                        })}
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            {table.getAllLeafColumns().map((col, index) => {
                                return (
                                    <TableCell
                                        key={col.id}
                                        style={{
                                            ...getCommonPinningStyles(col),
                                            width: col.getSize(),
                                        }}
                                        className="border bg-background"
                                    >
                                        {index + 1}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableBody>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <TableRow key={row.id}>
                                    {row
                                        .getVisibleCells()
                                        .map((cell, index) => {
                                            const { column } = cell;
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{
                                                        ...getCommonPinningStyles(
                                                            column,
                                                        ),
                                                        // width: cell.column.getSize(),
                                                        paddingLeft:
                                                            index === 1
                                                                ? `${row.depth * 2}rem`
                                                                : undefined,
                                                    }}
                                                    className="border bg-background"
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
