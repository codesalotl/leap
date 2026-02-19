import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Ppmp, PpmpCategory, ChartOfAccount } from '@/pages/types/types';
import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { Ppmp, PpmpCategory, ChartOfAccount } from '@/pages/types/types';

interface ExportToExcelProps {
    ppmpItems: Ppmp[];
    ppmpCategories: PpmpCategory[];
    chartOfAccounts: ChartOfAccount[];
}

export async function exportToExcel({
    ppmpItems,
    ppmpCategories,
    chartOfAccounts,
}: ExportToExcelProps) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PPMP');
    const initailRowCount = worksheet.rowCount + 5; // returns the number of the very first row
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

    worksheet.spliceRows(1, 0, [], [], [], [], []);

    [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].forEach((columnNumber) => {
        const column = worksheet.getColumn(columnNumber);
        column.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '92d050' },
        };
    });

    let currentRow = firstRowCount;

    // processing data
    const groupedByCategory = ppmpItems.reduce(
        (acc, item) => {
            const key =
                item.ppmp_price_list?.category?.id?.toString() || 'undefined';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        },
        {} as Record<string, typeof ppmpItems>,
    );
    const groupedByExpenseAccount = Object.fromEntries(
        Object.entries(groupedByCategory).map(([key, value]) => {
            const subGrouped = value.reduce(
                (acc, item) => {
                    const subKey =
                        item.ppmp_price_list?.chart_of_account_id?.toString() ||
                        'undefined';
                    if (!acc[subKey]) {
                        acc[subKey] = [];
                    }
                    acc[subKey].push(item);
                    return acc;
                },
                {} as Record<string, typeof value>,
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
                    fgColor: { argb: 'fbe4d5' },
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

                    worksheet.getRow(currentRow).height = 30;

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
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'deeaf6' },
    };

    [1, 2, 3, 4, 5].forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);

        // Setting border to an empty object removes all borders
        row.border = {};
        row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffffff' },
        };
        row.alignment = {};
    });

    worksheet.mergeCells('B1:G2');
    worksheet.mergeCells('B3:G3');
    worksheet.mergeCells('B4:G4');
    worksheet.mergeCells('B5:G5');
    worksheet.mergeCells('H1:AE3');
    worksheet.mergeCells('H4:AE5');

    const officeName = worksheet.getCell('B1');
    const fundingSource = worksheet.getCell('B3'); // not the final name and is dynamic
    const aipRefCode = worksheet.getCell('B4');
    const ppaDesc = worksheet.getCell('B5');
    const headerTitle = worksheet.getCell('H1');
    const headerSubTitle = worksheet.getCell('H4');

    const fundingSourceSpacer = worksheet.getCell(
        fundingSource.row,
        String(Number(fundingSource.col) - 1),
    );
    const aipRefCodeSpacer = worksheet.getCell(
        aipRefCode.row,
        String(Number(aipRefCode.col) - 1),
    );
    const ppaDescSpacer = worksheet.getCell(
        ppaDesc.row,
        String(Number(ppaDesc.col) - 1),
    );

    officeName.value = 'NAME OF OFFICE';
    officeName.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffff00' },
    };
    officeName.font = {
        bold: true,
        size: 12,
        name: 'Century Gothic',
    };
    officeName.alignment = {
        vertical: 'middle',
    };

    fundingSource.value = 'FUNDING SOURCE';
    aipRefCode.value = 'AIP REF. CODE';
    ppaDesc.value = 'PPA DESCRIPTION';
    headerTitle.value = 'PROVINCIAL GOVERNMENT OF LA UNION';
    headerSubTitle.value = 'PROJECT PROCUREMENT MANAGEMENT PLAN(PPMP) CY 2026';

    // {
    //             text: 'PROJECT PROCUREMENT PLAN(PPMP) CY 2026',
    //             font: { bold: true, size: 15, name: 'Century Gothic' },
    //         },
    // 'PROVINCIAL GOVERNMENT OF LA UNION PROJECT PROCUREMENT PLAN(PPMP) CY 2026';

    [
        fundingSource,
        aipRefCode,
        ppaDesc,
        fundingSourceSpacer,
        aipRefCodeSpacer,
        ppaDescSpacer,
    ].map(
        (cell) => (
            (cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '92d050' },
            }),
            (cell.font = {
                bold: true,
                size: 8,
                name: 'Century Gothic',
                underline: true,
            })
        ),
    );

    headerTitle.alignment = {
        vertical: 'bottom',
        horizontal: 'center',
    };
    headerTitle.font = { bold: true, size: 30, name: 'Century Gothic' };

    headerSubTitle.alignment = {
        vertical: 'top',
        horizontal: 'center',
    };
    headerSubTitle.font = { bold: true, size: 20, name: 'Century Gothic' };

    // console.log(worksheet.getRow(1));
    // console.log(worksheet.getCell('A1'));
    // console.log(worksheet.getCell('A2'));
    // console.log(worksheet.getCell('A3'));
    // console.log(worksheet.getCell('A4'));
    // console.log(worksheet.getCell('A5'));

    const buf = await workbook.xlsx.writeBuffer();

    // saveAs(new Blob([buf]), 'PPMP_Export.xlsx');

    // // 2. Convert to HTML via SheetJS
    // // Use type: 'array' for the buffer compatibility
    // const readWorkbook = XLSX.read(buf, { type: 'array' });
    // const firstSheet = readWorkbook.Sheets[readWorkbook.SheetNames[0]];
    // const worksheetHtml = XLSX.utils.sheet_to_html(firstSheet);

    // // 3. Open Print Window
    // const printWindow = window.open('', '_blank');

    // if (printWindow) {
    //     printWindow.document.write(`
    //             <html>
    //                 <head>
    //                     <title>PPMP Print Preview</title>
    //                     <style>
    //                         @media print {
    //                             @page {
    //                                 size: legal landscape;
    //                                 margin: 0.5in;
    //                             }
    //                             body { margin: 0; }
    //                         }
    //                         body {
    //                             font-family: 'Century Gothic', sans-serif;
    //                             padding: 20px;
    //                         }
    //                         table {
    //                             border-collapse: collapse;
    //                             width: 100%;
    //                             font-size: 8px; /* PPMP needs tiny text to fit */
    //                             table-layout: auto;
    //                         }
    //                         td {
    //                             border: 1px solid #000;
    //                             padding: 2px;
    //                             text-align: center;
    //                             word-wrap: break-word;
    //                         }
    //                         /* Ensure background colors actually print */
    //                         tr td { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    //                     </style>
    //                 </head>
    //                 <body>
    //                     <div id="print-content">
    //                         ${worksheetHtml}
    //                     </div>
    //                     <script>
    //                         window.onload = function() {
    //                             setTimeout(() => {
    //                                 window.print();
    //                                 // window.close(); // Optional: closes tab after print dialog
    //                             }, 500);
    //                         };
    //                     </script>
    //                 </body>
    //             </html>
    //         `);
    //     printWindow.document.close();
    // }

    const readWorkbook = XLSX.read(buf, { type: 'array' });
    const worksheet1 = readWorkbook.Sheets[readWorkbook.SheetNames[0]];
    const htmlContent = XLSX.utils.sheet_to_html(worksheet1);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
                <html>
                    <head>
                        <style>
                            @media print {
                                @page { size: legal landscape; margin: 5mm; }
                                body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                            }
                            body { font-family: 'Century Gothic', sans-serif; }
                            table { border-collapse: collapse; width: 100%; font-size: 7pt; }
                            td { border: 1px solid #000; padding: 2px; text-align: center; }

                            /* 1. Header Row (Row 6 in your logic) */
                            tr:nth-child(6) td {
                                background-color: #deeaf6 !important;
                                font-weight: bold;
                            }

                            /* 2. Target Category/Account rows based on content or position */
                            /* Since we can't easily know the exact row number for every group,
                               we target cells that span across the whole table (Merged Cells) */
                            tr td[colspan] {
                                background-color: #fbe4d5 !important; /* Your Account Color */
                                text-align: left !important;
                                font-weight: bold;
                            }

                            /* 3. Monthly Quantity Columns (The Green ones) */
                            /* In your code: 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 */
                            td:nth-child(8), td:nth-child(10), td:nth-child(12),
                            td:nth-child(14), td:nth-child(16), td:nth-child(18),
                            td:nth-child(20), td:nth-child(22), td:nth-child(24),
                            td:nth-child(26), td:nth-child(28), td:nth-child(30) {
                                background-color: #92d050 !important;
                            }

                            /* 4. Total Rows (The yellow ones) */
                            /* Target rows where the second cell is "TOTAL" */
                            tr:has(td:nth-child(3):contains("TOTAL")) {
                                background-color: #fef2cb !important;
                            }
                        </style>
                    </head>
                    <body>${htmlContent}</body>
                </html>
            `);
        iframeDoc.close();

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            document.body.removeChild(iframe);
        }, 500);
    }
}

export async function exportToPDF({
    ppmpItems,
    ppmpCategories,
    chartOfAccounts,
}) {
    const longBondPaper = [8.5, 13];

    function convertInchToMm(inch: number[]) {
        return inch.map((value) => value * 25.4);
    }

    const doc = new jsPDF('l', 'mm', convertInchToMm(longBondPaper)); // Landscape, Legal size for wide PPMP

    // 1. Static Headers (The top section of your Excel)
    // doc.setFont('Helvetica', 'bold');
    // doc.setFontSize(22);
    // doc.text('PROVINCIAL GOVERNMENT OF LA UNION', 175, 15, { align: 'center' });
    // doc.setFontSize(14);
    // doc.text('PROJECT PROCUREMENT MANAGEMENT PLAN (PPMP) CY 2026', 175, 25, {
    //     align: 'center',
    // });

    // 2. Data Preparation (Grouping logic remains the same)
    const tableBody = [];

    // Grouping Logic...
    const groupedByCategory = ppmpItems.reduce((acc, item) => {
        const key =
            item.ppmp_price_list?.category?.id?.toString() || 'undefined';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    // Iterate through groups to build rows
    Object.entries(groupedByCategory).forEach(([categoryId, items]) => {
        const categoryName =
            ppmpCategories.find((c) => c.id === Number(categoryId))?.name ||
            'Unknown';

        // Category Row (Gray)
        tableBody.push({
            isCategory: true,
            data: [
                '',
                '',
                categoryName,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
        });

        // Group by Account
        const accounts = items.reduce((acc, item) => {
            const key =
                item.ppmp_price_list?.chart_of_account_id?.toString() ||
                'undefined';
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        Object.entries(accounts).forEach(([accountId, accountItems]) => {
            const accountTitle =
                chartOfAccounts.find((a) => a.id === Number(accountId))
                    ?.account_title || 'Unknown';

            // Account Row (Peach/Orange)
            tableBody.push({
                isAccount: true,
                data: [
                    '',
                    '',
                    accountTitle,
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                ],
            });

            let groupTotalAmount = 0;

            // Item Rows
            accountItems.forEach((item) => {
                const price = Number(item.ppmp_price_list?.price || 0);
                const totalQty = [
                    item.jan_qty,
                    item.feb_qty,
                    item.mar_qty,
                    item.apr_qty,
                    item.may_qty,
                    item.jun_qty,
                    item.jul_qty,
                    item.aug_qty,
                    item.sep_qty,
                    item.oct_qty,
                    item.nov_qty,
                    item.dec_qty,
                ].reduce((a, b) => a + Number(b || 0), 0);
                const totalAmt = price * totalQty;
                groupTotalAmount += totalAmt;

                tableBody.push({
                    isItem: true,
                    data: [
                        accountTitle,
                        item.ppmp_price_list?.item_number,
                        item.ppmp_price_list?.description,
                        item.ppmp_price_list?.unit_of_measurement,
                        price.toLocaleString(),
                        totalQty,
                        totalAmt.toLocaleString(),
                        item.jan_qty,
                        item.jan_amount,
                        item.feb_qty,
                        item.feb_amount,
                        item.mar_qty,
                        item.mar_amount,
                        item.apr_qty,
                        item.apr_amount,
                        item.may_qty,
                        item.may_amount,
                        item.jun_qty,
                        item.jun_amount,
                        item.jul_qty,
                        item.jul_amount,
                        item.aug_qty,
                        item.aug_amount,
                        item.sep_qty,
                        item.sep_amount,
                        item.oct_qty,
                        item.oct_amount,
                        item.nov_qty,
                        item.nov_amount,
                        item.dec_qty,
                        item.dec_amount,
                    ],
                });
            });

            // Total Row (Yellow)
            tableBody.push({
                isTotal: true,
                data: [
                    '',
                    '',
                    'TOTAL',
                    '',
                    '',
                    '',
                    groupTotalAmount.toLocaleString(),
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                ],
            });
        });
    });

    autoTable(doc, {
        startY: 20,
        head: [
            [
                {
                    content: '',
                    styles: { fillColor: [255, 255, 255] },
                },
                {
                    content: 'NAME OF OFFICE',
                    colSpan: 6,
                    rowSpan: 2,
                    styles: {
                        valign: 'middle',
                        fillColor: [255, 255, 0],
                        fontSize: 12,
                    },
                },
                {
                    content: 'PROVINCIAL GOVERNMENT OF LA UNION',
                    colSpan: 24,
                    rowSpan: 3,
                    styles: {
                        halign: 'center',
                        valign: 'bottom',
                        fillColor: [255, 255, 255],
                        fontSize: 30,
                    },
                },
            ],
            [
                {
                    content: '',
                    styles: { fillColor: [255, 255, 255] },
                },
            ],
            [
                {
                    content: '',
                    styles: { fillColor: [0, 255, 0] },
                },
                {
                    content: 'FUNDING SOURCE',
                    colSpan: 6,
                    styles: {
                        valign: 'middle',
                        fillColor: [0, 255, 0],
                        fontSize: 8,
                    },
                },
            ],
            [
                {
                    content: '',
                    styles: { fillColor: [0, 255, 0] },
                },
                {
                    content: 'AIP REF. CODE',
                    colSpan: 6,
                    styles: {
                        valign: 'middle',
                        fillColor: [0, 255, 0],
                        fontSize: 8,
                    },
                },
                {
                    content:
                        'PROJECT PROCUREMENT MANAGEMENT PLAN(PPMP) CY 2026',
                    colSpan: 24,
                    rowSpan: 2,
                    styles: {
                        halign: 'center',
                        valign: 'top',
                        fillColor: [255, 255, 255],
                        fontSize: 15,
                    },
                },
            ],
            [
                {
                    content: '',
                    styles: { fillColor: [0, 255, 0] },
                },
                {
                    content: 'PPA DESCRIPTION',
                    colSpan: 6,
                    styles: {
                        valign: 'middle',
                        fillColor: [0, 255, 0],
                        fontSize: 8,
                    },
                },
            ],
            [
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
            ],
        ],
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    });

    // 3. Generate Table
    autoTable(doc, {
        startY: 80,
        // head: [
        //     [
        //         {
        //             content: '',
        //             styles: { fillColor: [255, 255, 255] },
        //         },
        //         {
        //             content: 'NAME OF OFFICE',
        //             colSpan: 6,
        //             rowSpan: 2,
        //             styles: { halign: 'center', fillColor: [255, 255, 255] },
        //         },
        //         {
        //             content: 'PROVINCIAL GOVERNMENT OF LA UNION',
        //             colSpan: 24,
        //             rowSpan: 3,
        //             styles: { halign: 'center', fillColor: [255, 255, 255] },
        //         },
        //     ],
        //     [
        //         {
        //             content: '',
        //             styles: { fillColor: [255, 255, 255] },
        //         },
        //     ],
        //     [
        //         {
        //             content: '',
        //             styles: { fillColor: [255, 255, 255] },
        //         },
        //         {
        //             content: 'FUNDING SOURCE',
        //             colSpan: 6,
        //             styles: { halign: 'center', fillColor: [255, 255, 255] },
        //         },
        //     ],
        //     [
        //         {
        //             content: '',
        //             styles: { fillColor: [255, 255, 255] },
        //         },
        //         {
        //             content: 'AIP REF. CODE',
        //             colSpan: 6,
        //             styles: { halign: 'center', fillColor: [255, 255, 255] },
        //         },
        //         {
        //             content:
        //                 'PROJECT PROCUREMENT MANAGEMENT PLAN(PPMP) CY 2026',
        //             colSpan: 24,
        //             rowSpan: 2,
        //             styles: { halign: 'center', fillColor: [255, 255, 255] },
        //         },
        //     ],
        //     [
        //         {
        //             content: '',
        //             styles: { fillColor: [255, 255, 255] },
        //         },
        //         {
        //             content: 'PPA DESCRIPTION',
        //             colSpan: 6,
        //             styles: { halign: 'center', fillColor: [255, 255, 255] },
        //         },
        //     ],

        //     [
        //         'EXPENSE ACCOUNT',
        //         'Item No.',
        //         'Description',
        //         'Unit',
        //         'Price',
        //         'QTY',
        //         'TOTAL',
        //         'JAN-Q',
        //         'JAN',
        //         'FEB-Q',
        //         'FEB',
        //         'MAR-Q',
        //         'MAR',
        //         'APR-Q',
        //         'APR',
        //         'MAY-Q',
        //         'MAY',
        //         'JUN-Q',
        //         'JUN',
        //         'JUL-Q',
        //         'JUL',
        //         'AUG-Q',
        //         'AUG',
        //         'SEP-Q',
        //         'SEP',
        //         'OCT-Q',
        //         'OCT',
        //         'NOV-Q',
        //         'NOV',
        //         'DEC-Q',
        //         'DEC',
        //     ],
        // ],
        body: tableBody.map((row) => row.data),
        styles: {
            fontSize: 5,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            halign: 'center',
        },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        didParseCell: (data) => {
            const rowIndex = data.row.index;
            const rowMeta = tableBody[rowIndex];

            // Re-apply Excel logic: Green Columns for Quantities
            const greenCols = [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
            if (greenCols.includes(data.column.index)) {
                data.cell.styles.fillColor = [146, 208, 80];
            }

            // Apply Row Colors
            if (rowMeta?.isCategory)
                data.cell.styles.fillColor = [208, 206, 206];
            if (rowMeta?.isAccount)
                data.cell.styles.fillColor = [251, 228, 213];
            if (rowMeta?.isTotal) data.cell.styles.fillColor = [254, 242, 203];
        },
    });

    // 4. Print via Hidden Iframe
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
        iframe.contentWindow.print();
    };
}
