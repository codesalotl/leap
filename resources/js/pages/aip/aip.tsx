import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

type AIP = {
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
        ps: string;
        mooe: string;
        fe: string;
        co: string;
        total: string;
    };
    amountOfCcExpenditure: {
        ccAdaptation: string;
        ccMitigation: string;
    };
    ccTypologyCode: string;
    children?: AIP[];
};

const initialData: AIP[] = [
    {
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
    },
];

const columnHelper = createColumnHelper<AIP>();

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
];

export default function Aip() {
    const table = useReactTable({
        columns: defaultColumns,
        data: initialData,
        getCoreRowModel: getCoreRowModel(),
    });

    console.log(table);
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
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ width: header.getSize() }}
                                            className="border"
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
                        {table.getAllLeafColumns().map((col, index) => (
                            <TableCell
                                key={col.id}
                                style={{ width: col.getSize() }}
                                className="border"
                            >
                                {index + 1}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>

                <TableBody>
                    {table.getRowModel().rows.map((row) => {
                        // console.log(row.id === "0.0.0" ? row : "");
                        return (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell, index) => {
                                    // console.log(cell);
                                    return (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                // width: cell.column.getSize(),
                                                paddingLeft:
                                                    index === 1
                                                        ? `${row.depth * 2}rem`
                                                        : undefined,
                                            }}
                                            className="border"
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
