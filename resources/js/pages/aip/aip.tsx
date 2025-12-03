import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatData, nestData } from '@/pages/aip/aip';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from '@tanstack/react-table';

type Aip = {
    id: number;
    aipRefCode: string;
    ppaDescription: string;
    implementingOfficeDepartmentLocation: string;
    scheduleOfImplementation: {
        startingDate: string;
        completionDate: string;
    };
    expectedOutputs: string;
    fundingSource: string;
    amount: {
        ps: number;
        mooe: number;
        fe: number;
        co: number;
        total: number;
    };
    amountOfCcExpenditure: {
        ccAdaptation: string;
        ccMitigation: string;
    };
    ccTypologyCode: string;
    children?: Aip[];
    created_at: string;
    updated_at: string;
};

type AipRaw = {
    id: number;
    aipRefCode: string;
    ppaDescription: string;
    implementingOfficeDepartmentLocation: string;
    startingDate: string;
    completionDate: string;
    expectedOutputs: string;
    fundingSource: string;
    ps: number;
    mooe: number;
    fe: number;
    co: number;
    total: number;
    ccAdaptation: string;
    ccMitigation: string;
    ccTypologyCode: string;
    children?: Aip[];
    created_at: string;
    updated_at: string;
};

type AipProp = {
    auth: {
        user: null;
    };
    data: AipRaw[];
    error: {};
    name: string;
    quote: {
        author: string;
        message: string;
    };
    sidebarOpen: boolean;
};

const initialData: Aip[] = [
    {
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
            ps: 0,
            mooe: 0,
            fe: 0,
            co: 0,
            total: 0,
        },
        amountOfCcExpenditure: {
            ccAdaptation: '',
            ccMitigation: '',
        },
        ccTypologyCode: '',
        children: [],
        created_at: '',
        updated_at: '',
    },
];

const columnHelper = createColumnHelper<Aip>();

const defaultColumns = [
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
        cell: (row) => {
            return (
                <div className="flex gap-2">
                    <Button size="sm">Add</Button>
                    <Button size="sm" variant="secondary">
                        Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                        Delete
                    </Button>
                </div>
            );
        },
    }),
];

const getCommonPinningStyles = (column: Column<Person>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');

    // console.log(column.columnDef.id);
    // console.log(isPinned);
    // console.log(isLastLeftPinnedColumn);
    // console.log(isFirstRightPinnedColumn);

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

export default function Aip(prop: AipProp) {
    // console.log(prop);
    // console.log(formatData(prop.data));
    // console.log(nestData(formatData(prop.data)));

    const table = useReactTable({
        columns: defaultColumns,
        // data: initialData,
        data: nestData(formatData(prop.data)),
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.children,
        // getRowCanExpand: (row) => true,
        state: {
            expanded: true, // must pass expanded state back to the table
        },
        initialState: {
            columnPinning: {
                right: ['action'],
            },
        },
    });

    // console.log(table);

    // console.log(table);
    // console.log(table.getState().rowSelection); //read the row selection state
    // console.log(table.setRowSelection((old) => ({ ...old }))); //set the row selection state
    // console.log(table.resetRowSelection()); //reset the row selection state

    return (
        <div>
            {/*<CreateRowDialog
                buttonTitle={'Add Program'}
                initailRowData={emptyRowData}
                createRow={handleCreateRow}
            />*/}
            {/* <TempComponent title={"Temp Comp"} /> */}
            {/*<ExportToPDFButton />*/}
            {/*<ExportToExcelButton />*/}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => {
                        return (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // console.log(header);
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
                                                      header.column.columnDef
                                                          .header,
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
                            console.log(col);
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
                        // console.log(row.id === "0.0.0" ? row : "");
                        return (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell, index) => {
                                    // console.log(cell);
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
                                                cell.column.columnDef.cell,
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
    );
}
