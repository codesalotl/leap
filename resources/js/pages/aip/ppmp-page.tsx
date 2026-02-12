import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import DataTable from '@/pages/aip/ppmp-table/data-table';
import {
    FiscalYear,
    Ppmp,
    ChartOfAccount,
    AipEntry,
    PpmpCategory,
} from '@/pages/types/types';
import { Button } from '@/components/ui/button';
import { Plus, FileDown } from 'lucide-react';
import { useState } from 'react';
import PpmpFormDialog from '@/pages/aip/ppmp-form-dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface PpmpPageProps {
    fiscalYear: FiscalYear;
    aipEntry: AipEntry;
    ppmpItems: Ppmp[];
    chartOfAccounts: ChartOfAccount[];
    ppmpCategories: PpmpCategory[];
}

export default function PpmpPage({
    fiscalYear,
    aipEntry,
    ppmpItems,
    chartOfAccounts,
    ppmpCategories, // for form
}: PpmpPageProps) {
    console.log(ppmpItems);
    // console.log(chartOfAccounts);

    const [open, setOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        {
            title: `AIP Summary FY ${fiscalYear.year}`,
            href: `/aip/${fiscalYear.id}/summary`,
        },
        { title: `PPMP Management`, href: `#` },
    ];

    async function exportToExcel() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PPMP');
        const initailRowCount = worksheet.rowCount; // returns the number of the very first row
        const headerRowCount = initailRowCount + 1; // returns the number where the header row is
        const firstRowCount = headerRowCount + 1; // returns the number where the header row is
        // const headerRow = worksheet.getRow(headerRowCount); // returns the header row data

        worksheet.columns = [
            { header: 'EXPENSE ACCOUNT', key: 'expenseAccount', width: 15 },
            { header: 'Item No.', key: 'itemNo', width: 4 },
            { header: 'Description', key: 'description', width: 20 },
            { header: 'Unit of Measure', key: 'unitOfMeasurement', width: 9 },
            { header: 'PRICELIST', key: 'price', width: 10 },
            { header: 'CY 2026-QTY', key: 'totalQuantity', width: 8 },
            { header: 'TOTAL', key: 'totalAmount', width: 12 },
            { header: 'JAN-QTY', key: 'janQuantity', width: 8 },
            { header: 'JAN', key: 'janAmount', width: 8 },
            { header: 'FEB-QTY', key: 'febQuantity', width: 8 },
            { header: 'FEB', key: 'febAmount', width: 8 },
            { header: 'MAR-QTY', key: 'marQuantity', width: 8 },
            { header: 'MAR', key: 'marAmount', width: 8 },
            { header: 'APR-QTY', key: 'aprQuantity', width: 8 },
            { header: 'APR', key: 'aprAmount', width: 8 },
            { header: 'MAY-QTY', key: 'mayQuantity', width: 8 },
            { header: 'MAY', key: 'mayAmount', width: 8 },
            { header: 'JUN-QTY', key: 'junQuantity', width: 8 },
            { header: 'JUN', key: 'junAmount', width: 8 },
            { header: 'JUL-QTY', key: 'julQuantity', width: 8 },
            { header: 'JUL', key: 'julAmount', width: 8 },
            { header: 'AUG-QTY', key: 'augQuantity', width: 8 },
            { header: 'AUG', key: 'augAmount', width: 8 },
            { header: 'SEP-QTY', key: 'sepQuantity', width: 8 },
            { header: 'SEP', key: 'sepAmount', width: 8 },
            { header: 'OCT-QTY', key: 'octQuantity', width: 8 },
            { header: 'OCT', key: 'octAmount', width: 8 },
            { header: 'NOV-QTY', key: 'novQuantity', width: 8 },
            { header: 'NOV', key: 'novAmount', width: 8 },
            { header: 'DEC-QTY', key: 'decQuantity', width: 8 },
            { header: 'DEC', key: 'decAmount', width: 8 },
        ];

        [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].forEach(
            (columnNumber) => {
                const column = worksheet.getColumn(columnNumber);
                column.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '92d050' },
                };
            },
        );

        let currentRow = firstRowCount;

        // processing data
        const groupedByCategory = Object.groupBy(
            ppmpItems,
            ({ ppmp_price_list }) => ppmp_price_list?.category?.id,
        );
        const groupedByExpenseAccount = Object.fromEntries(
            Object.entries(groupedByCategory).map(([key, value]) => {
                const subGrouped = Object.groupBy(
                    value,
                    ({ ppmp_price_list }) =>
                        ppmp_price_list?.chart_of_account_id,
                );

                return [key, subGrouped];
            }),
        );
        // console.log(groupedByExpenseAccount);
        // console.log(ppmpCategories);

        // Process each group
        Object.entries(groupedByExpenseAccount).forEach(
            ([categoryId, accounts]) => {
                // console.log(categoryId, accounts);

                worksheet.addRow({
                    description: ppmpCategories.find(
                        (category) => category.id === Number(categoryId),
                    )?.name,
                }).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'd0cece' },
                };

                currentRow++;

                Object.entries(accounts).forEach(([accountId, items]) => {
                    // console.log(accountId, items);

                    worksheet.addRow({
                        description: chartOfAccounts.find(
                            (account) => account.id === Number(accountId),
                        )?.account_title,
                    }).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'd0cece' },
                    };

                    currentRow++;
                    const groupStartRow = currentRow;

                    items.forEach((item) => {
                        worksheet.addRow({
                            expenseAccount: chartOfAccounts.find((account) => {
                                return (
                                    account.id ===
                                    item.ppmp_price_list?.chart_of_account_id
                                );
                            })?.account_title,
                            itemNo: item.ppmp_price_list?.item_number,
                            description: item.ppmp_price_list?.description,
                            unitOfMeasurement:
                                item.ppmp_price_list?.unit_of_measurement,
                            price: Number(item.ppmp_price_list?.price),
                            totalQuantity: {
                                formula: `SUM(H${currentRow}, J${currentRow}, L${currentRow}, N${currentRow}, P${currentRow}, R${currentRow}, T${currentRow}, V${currentRow}, X${currentRow}, Z${currentRow}, AB${currentRow}, AD${currentRow})`,
                            },
                            totalAmount: {
                                formula: `PRODUCT(E${currentRow}, F${currentRow})`,
                            },
                            janQuantity: Number(item.jan_qty),
                            janAmount: Number(item.jan_amount),
                            febQuantity: Number(item.feb_qty),
                            febAmount: Number(item.feb_amount),
                            marQuantity: Number(item.mar_qty),
                            marAmount: Number(item.mar_amount),
                            aprQuantity: Number(item.apr_qty),
                            aprAmount: Number(item.apr_amount),
                            mayQuantity: Number(item.may_qty),
                            mayAmount: Number(item.may_amount),
                            junQuantity: Number(item.jun_qty),
                            junAmount: Number(item.jun_amount),
                            julQuantity: Number(item.jul_qty),
                            julAmount: Number(item.jul_amount),
                            augQuantity: Number(item.aug_qty),
                            augAmount: Number(item.aug_amount),
                            sepQuantity: Number(item.sep_qty),
                            sepAmount: Number(item.sep_amount),
                            octQuantity: Number(item.oct_qty),
                            octAmount: Number(item.oct_amount),
                            novQuantity: Number(item.nov_qty),
                            novAmount: Number(item.nov_amount),
                            decQuantity: Number(item.dec_qty),
                            decAmount: Number(item.dec_amount),
                        });

                        currentRow++;
                    });

                    const groupEndRow = currentRow - 1;

                    worksheet.addRow({
                        description: 'TOTAL',
                        totalAmount: {
                            formula: `SUM(G${groupStartRow}:G${groupEndRow})`,
                        },
                        janAmount: {
                            formula: `SUM(I${groupStartRow}:I${groupEndRow})`,
                        },
                        febAmount: {
                            formula: `SUM(K${groupStartRow}:K${groupEndRow})`,
                        },
                        marAmount: {
                            formula: `SUM(M${groupStartRow}:M${groupEndRow})`,
                        },
                        aprAmount: {
                            formula: `SUM(O${groupStartRow}:O${groupEndRow})`,
                        },
                        mayAmount: {
                            formula: `SUM(Q${groupStartRow}:Q${groupEndRow})`,
                        },
                        junAmount: {
                            formula: `SUM(S${groupStartRow}:S${groupEndRow})`,
                        },
                        julAmount: {
                            formula: `SUM(U${groupStartRow}:U${groupEndRow})`,
                        },
                        augAmount: {
                            formula: `SUM(W${groupStartRow}:W${groupEndRow})`,
                        },
                        sepAmount: {
                            formula: `SUM(Y${groupStartRow}:Y${groupEndRow})`,
                        },
                        octAmount: {
                            formula: `SUM(AA${groupStartRow}:AA${groupEndRow})`,
                        },
                        novAmount: {
                            formula: `SUM(AC${groupStartRow}:AC${groupEndRow})`,
                        },
                        decAmount: {
                            formula: `SUM(AE${groupStartRow}:AE${groupEndRow})`,
                        },
                    }).fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'fef2cb' },
                    };

                    currentRow++;
                });
            },
        );

        // first is by column styles
        // set all cols font and size
        worksheet.columns.forEach((column) => {
            column.font = {
                name: 'Century Gothic',
                size: 8,
            };
            column.alignment = {
                vertical: 'middle',
                wrapText: true,
            };
            column.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // set certain rows to font size 5
        [1, 2, 3, 4, 5].forEach((rowNumber) => {
            const column = worksheet.getColumn(rowNumber);
            column.font = {
                size: 5,
            };
        });

        // center certain fields
        [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].forEach(
            (columnNumber) => {
                const column = worksheet.getColumn(columnNumber);
                column.alignment = {
                    ...column.alignment,
                    horizontal: 'center',
                };
            },
        );

        [7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31].forEach(
            (columnNumber) => {
                const column = worksheet.getColumn(columnNumber);
                column.numFmt = '#,##0.00';
            },
        );

        const headerRow = worksheet.getRow(headerRowCount);

        headerRow.font = {
            bold: true,
            name: 'Century Gothic',
            size: 8,
        };
        headerRow.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
        };
        headerRow.height = 30;

        // green color for qty fields

        // [
        //     'expenseAccount',
        //     'itemNo',
        //     'unitOfMeasurement',
        //     'totalQuantity',
        //     'janQuantity',
        //     'febQuantity',
        //     'marQuantity',
        //     'aprQuantity',
        //     'mayQuantity',
        //     'junQuantity',
        //     'julQuantity',
        //     'augQuantity',
        //     'sepQuantity',
        //     'octQuantity',
        //     'novQuantity',
        //     'decQuantity',
        // ].forEach((column) => {
        //     worksheet.getColumn(column).font = {
        //         name: 'Century Gothic',
        //         size: 8,
        //     };
        // });

        // worksheet.columns.map((column) => {
        //     worksheet.getColumn(column.key).font = {
        //         name: 'Century Gothic',
        //         size: 8,
        //     };
        // });

        // worksheet.columns.map((key) => {
        //     worksheet.getColumn(key.key).alignment = {
        //         horizontal: 'center',
        //         vertical: 'middle',
        //         wrapText: true,
        //     };
        // });

        // worksheet.getColumn(1).alignment = {
        //     horizontal: 'left',
        //     vertical: 'middle',
        //     wrapText: true,
        // };

        // headerRow.font = {
        //     bold: true,
        //     name: 'Century Gothic',
        //     size: 8,
        // };

        // headerRow.alignment = {
        //     horizontal: 'center',
        //     vertical: 'middle',
        //     wrapText: true,
        // };

        // headerRow.alignment.horizontal = 'center';
        // headerRow.alignment.vertical = 'middle';
        // headerRow.alignment.wrapText = true;

        // headerRow.height = 30;

        // [
        //     'expenseAccount',
        //     'itemNo',
        //     'unitOfMeasurement',
        //     'totalQuantity',
        //     'janQuantity',
        //     'febQuantity',
        //     'marQuantity',
        //     'aprQuantity',
        //     'mayQuantity',
        //     'junQuantity',
        //     'julQuantity',
        //     'augQuantity',
        //     'sepQuantity',
        //     'octQuantity',
        //     'novQuantity',
        //     'decQuantity',
        // ].forEach((key) => {
        //     // const column = worksheet.getColumn(key);

        //     console.log(headerRow.getCell(2));

        //     worksheet.getColumn(key).alignment.horizontal = 'left';
        //     headerRow.getCell(2).alignment.horizontal = 'center';
        // });

        const buf = await workbook.xlsx.writeBuffer();

        saveAs(new Blob([buf]), 'PPMP_Export.xlsx');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full flex-1 px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">PPMP Management</h1>

                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <FileDown /> Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    {/* <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel> */}
                                    <DropdownMenuItem onClick={exportToExcel}>
                                        Excel
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>PDF</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button onClick={() => setOpen(true)}>
                            <Plus /> Add Item
                        </Button>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-9rem)] rounded-md border">
                    <DataTable
                        ppmpItems={ppmpItems}
                        onDelete={(ppmp) => {
                            if (
                                confirm(
                                    `Are you sure you want to delete "${ppmp.ppmp_price_list?.description}"? This action cannot be undone.`,
                                )
                            ) {
                                // Call the delete API
                                router.delete(`/ppmp/${ppmp.id}`, {
                                    onSuccess: () => {
                                        console.log(
                                            'PPMP item deleted successfully',
                                        );
                                    },
                                    onError: (errors) => {
                                        console.error(
                                            'Error deleting PPMP item:',
                                            errors,
                                        );
                                        alert('Failed to delete PPMP item');
                                    },
                                    preserveState: false,
                                });
                            }
                        }}
                    />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            {/* Add Item Dialog */}
            <PpmpFormDialog
                open={open}
                onOpenChange={setOpen}
                chartOfAccounts={chartOfAccounts}
                ppmpCategories={ppmpCategories}
                ppmpPriceList={[]}
                selectedEntry={aipEntry}
                ppmpItems={ppmpItems}
            />
        </AppLayout>
    );
}
