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

import { centuryGothicBase64 } from '@/fonts/CenturyGothic';
import { centuryGothicBoldBase64 } from '@/fonts/CenturyGothicBold';

export async function exportToPDF({
    ppmpItems,
    ppmpCategories,
    chartOfAccounts,
}) {
    const longBondPaper = [8.5, 13];
    const convertInchToMm = (inch) => inch.map((value) => value * 25.4);

    // 1. Setup Document (Landscape, Long Bond Paper / 13 inches wide)
    const doc = new jsPDF('l', 'mm', convertInchToMm(longBondPaper));

    // 2. Register Custom Fonts (Regular and Bold)
    doc.addFileToVFS('CenturyGothic.ttf', centuryGothicBase64);
    doc.addFont('CenturyGothic.ttf', 'CenturyGothic', 'normal');
    doc.addFileToVFS('CenturyGothic-Bold.ttf', centuryGothicBoldBase64);
    doc.addFont('CenturyGothic-Bold.ttf', 'CenturyGothic', 'bold');

    doc.setFont('CenturyGothic');

    const tableBody = [];

    // --- DATA PREPARATION ---
    const groupedByCategory = ppmpItems.reduce((acc, item) => {
        const key =
            item.ppmp_price_list?.category?.id?.toString() || 'undefined';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    Object.entries(groupedByCategory).forEach(([categoryId, items]) => {
        const categoryName =
            ppmpCategories.find((c) => c.id === Number(categoryId))?.name ||
            'Unknown';

        // Category Row (Gray)
        tableBody.push({
            isCategory: true,
            data: Array(31)
                .fill('')
                .map((_, i) => (i === 2 ? categoryName : '')),
        });

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

            // Account Row (Peach)
            tableBody.push({
                isAccount: true,
                data: Array(31)
                    .fill('')
                    .map((_, i) => (i === 2 ? accountTitle : '')),
            });

            let groupTotalAmount = 0;
            // Initialize totals for the 12 month amount columns
            const monthlyTotals = Array(12).fill(0);

            accountItems.forEach((item) => {
                const price = Number(item.ppmp_price_list?.price || 0);

                // Array of monthly amounts to accumulate
                const monthlyAmts = [
                    item.jan_amount,
                    item.feb_amount,
                    item.mar_amount,
                    item.apr_amount,
                    item.may_amount,
                    item.jun_amount,
                    item.jul_amount,
                    item.aug_amount,
                    item.sep_amount,
                    item.oct_amount,
                    item.nov_amount,
                    item.dec_amount,
                ];

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

                // Sum up monthly amounts
                monthlyAmts.forEach((amt, idx) => {
                    monthlyTotals[idx] += Number(amt || 0);
                });

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
                        item.jan_amount?.toLocaleString(),
                        item.feb_qty,
                        item.feb_amount?.toLocaleString(),
                        item.mar_qty,
                        item.mar_amount?.toLocaleString(),
                        item.apr_qty,
                        item.apr_amount?.toLocaleString(),
                        item.may_qty,
                        item.may_amount?.toLocaleString(),
                        item.jun_qty,
                        item.jun_amount?.toLocaleString(),
                        item.jul_qty,
                        item.jul_amount?.toLocaleString(),
                        item.aug_qty,
                        item.aug_amount?.toLocaleString(),
                        item.sep_qty,
                        item.sep_amount?.toLocaleString(),
                        item.oct_qty,
                        item.oct_amount?.toLocaleString(),
                        item.nov_qty,
                        item.nov_amount?.toLocaleString(),
                        item.dec_qty,
                        item.dec_amount?.toLocaleString(),
                    ],
                });
            });

            // Total Row (Yellow) - Includes Monthly Column Totals
            tableBody.push({
                isTotal: true,
                data: Array(31)
                    .fill('')
                    .map((_, i) => {
                        if (i === 2) return 'TOTAL';
                        if (i === 6) return groupTotalAmount.toLocaleString();

                        // Monthly Amount Columns are 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30
                        const monthAmtCols = [
                            8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30,
                        ];
                        if (monthAmtCols.includes(i)) {
                            const monthIdx = (i - 8) / 2;
                            return monthlyTotals[monthIdx] > 0
                                ? monthlyTotals[monthIdx].toLocaleString()
                                : '';
                        }
                        return '';
                    }),
            });
        });
    });

    // --- TABLE GENERATION ---
    autoTable(doc, {
        startY: 5,
        margin: { left: 5, right: 5, top: 5, bottom: 5 },
        showHead: 'firstPage' as any, // TypeScript bypass
        head: [
            [
                { content: '', styles: { fillColor: [255, 255, 255] } },
                {
                    content: 'NAME OF OFFICE',
                    colSpan: 6,
                    rowSpan: 2,
                    styles: {
                        valign: 'middle',
                        fillColor: [255, 255, 0],
                        fontSize: 9,
                        halign: 'left',
                        fontStyle: 'bold',
                    },
                },
                {
                    content: 'PROVINCIAL GOVERNMENT OF LA UNION',
                    colSpan: 24,
                    rowSpan: 3,
                    styles: {
                        halign: 'center',
                        valign: 'bottom',
                        fontSize: 28,
                        fontStyle: 'bold',
                    },
                },
            ],
            [{ content: '', styles: { fillColor: [255, 255, 255] } }],
            [
                { content: '', styles: { fillColor: [146, 208, 80] } },
                {
                    content: 'FUNDING SOURCE',
                    colSpan: 6,
                    styles: {
                        fillColor: [146, 208, 80],
                        fontSize: 5,
                        halign: 'left',
                        fontStyle: 'bold',
                    },
                },
            ],
            [
                { content: '', styles: { fillColor: [146, 208, 80] } },
                {
                    content: 'AIP REF. CODE',
                    colSpan: 6,
                    styles: {
                        fillColor: [146, 208, 80],
                        fontSize: 5,
                        halign: 'left',
                        fontStyle: 'bold',
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
                        fontSize: 16,
                        fontStyle: 'bold',
                    },
                },
            ],
            [
                { content: '', styles: { fillColor: [146, 208, 80] } },
                {
                    content: 'PPA DESCRIPTION',
                    colSpan: 6,
                    styles: {
                        fillColor: [146, 208, 80],
                        fontSize: 5,
                        halign: 'left',
                        fontStyle: 'bold',
                    },
                },
            ],
            [
                'EXPENSE ACCOUNT',
                'Item No.',
                'Description',
                'Unit',
                'Price',
                'QTY',
                'TOTAL',
                'JAN-Q',
                'JAN',
                'FEB-Q',
                'FEB',
                'MAR-Q',
                'MAR',
                'APR-Q',
                'APR',
                'MAY-Q',
                'MAY',
                'JUN-Q',
                'JUN',
                'JUL-Q',
                'JUL',
                'AUG-Q',
                'AUG',
                'SEP-Q',
                'SEP',
                'OCT-Q',
                'OCT',
                'NOV-Q',
                'NOV',
                'DEC-Q',
                'DEC',
            ],
        ],
        body: tableBody.map((row) => row.data),
        theme: 'grid',
        styles: {
            font: 'CenturyGothic',
            fontStyle: 'normal',
            fontSize: 4.5,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            halign: 'center',
            cellPadding: 0.5,
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'normal',
        },
        columnStyles: {
            0: { cellWidth: 17 },
            1: { cellWidth: 7 },
            2: { cellWidth: 'auto', halign: 'left' },
            3: { cellWidth: 10 },
        },
        didParseCell: (data) => {
            // Hide Borders for Top Header rows
            if (data.section === 'head' && data.row.index <= 4) {
                data.cell.styles.lineWidth = 0;
            }

            // Row 5 Header (Bold Column names)
            if (data.section === 'head' && data.row.index === 5) {
                data.cell.styles.fontSize = 5;
                data.cell.styles.fontStyle = 'bold';
                data.cell.styles.fillColor = [222, 234, 246];
            }

            if (data.section === 'body') {
                const rowMeta = tableBody[data.row.index];

                // Highlight Quantity Columns (Green)
                const greenCols = [
                    5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29,
                ];
                if (greenCols.includes(data.column.index)) {
                    data.cell.styles.fillColor = [146, 208, 80];
                }

                // Metadata Styling (Bold Categorization)
                if (rowMeta?.isCategory) {
                    data.cell.styles.fillColor = [208, 206, 206];
                    data.cell.styles.fontStyle = 'bold';
                }
                if (rowMeta?.isAccount) {
                    data.cell.styles.fillColor = [251, 228, 213];
                    data.cell.styles.fontStyle = 'bold';
                }
                if (rowMeta?.isTotal) {
                    data.cell.styles.fillColor = [254, 242, 203];
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        },
    });

    // 4. Final Output and Print
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
