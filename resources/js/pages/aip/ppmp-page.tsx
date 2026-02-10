import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import DataTable from '@/pages/aip/ppmp-table/data-table';
import {
    FiscalYear,
    Ppmp,
    ChartOfAccount,
    AipEntry,
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface PpmpPageProps {
    fiscalYear: FiscalYear;
    aipEntry: AipEntry;
    ppmpItems: Ppmp[];
    chartOfAccounts: ChartOfAccount[];
}

export default function PpmpPage({
    fiscalYear,
    aipEntry,
    ppmpItems,
    chartOfAccounts,
}: PpmpPageProps) {
    // console.log(ppmpItems);
    console.log(chartOfAccounts);

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
        // console.log('export to excel');
        console.log(ppmpItems);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PPMP');
        const initailRowCount = worksheet.rowCount; // returns the number of the very first row
        const headerRowCount = initailRowCount + 1; // returns the number where the header row is
        const firstRowCount = headerRowCount + 1; // returns the number where the header row is
        const headerRow = worksheet.getRow(headerRowCount); // returns the header row data

        console.log(initailRowCount);

        worksheet.columns = [
            { header: 'EXPENSE ACCOUNT', key: 'expenseAccount' },
            { header: 'Item No.', key: 'itemNo' },
            { header: 'Description', key: 'description' },
            { header: 'Unit of Measure', key: 'unitOfMeasurement' },
            { header: 'PRICELIST', key: 'price' },
            { header: 'CY 2025-QTY', key: 'totalQuantity' },
            { header: 'TOTAL', key: 'totalAmount' },
            { header: 'JAN-QTY', key: 'janQuantity' },
            { header: 'JAN', key: 'janAmount' },
            { header: 'FEB-QTY', key: 'febQuantity' },
            { header: 'FEB', key: 'febAmount' },
            { header: 'MAR-QTY', key: 'marQuantity' },
            { header: 'MAR', key: 'marAmount' },
            { header: 'APR-QTY', key: 'aprQuantity' },
            { header: 'APR', key: 'aprAmount' },
            { header: 'MAY-QTY', key: 'mayQuantity' },
            { header: 'MAY', key: 'mayAmount' },
            { header: 'JUN-QTY', key: 'junQuantity' },
            { header: 'JUN', key: 'junAmount' },
            { header: 'JUL-QTY', key: 'julQuantity' },
            { header: 'JUL', key: 'julAmount' },
            { header: 'AUG-QTY', key: 'augQuantity' },
            { header: 'AUG', key: 'augAmount' },
            { header: 'SEP-QTY', key: 'sepQuantity' },
            { header: 'SEP', key: 'sepAmount' },
            { header: 'OCT-QTY', key: 'octQuantity' },
            { header: 'OCT', key: 'octAmount' },
            { header: 'NOV-QTY', key: 'novQuantity' },
            { header: 'NOV', key: 'novAmount' },
            { header: 'DEC-QTY', key: 'decQuantity' },
            { header: 'DEC', key: 'decAmount' },
        ];

        headerRow.font = {
            bold: true,
        };

        headerRow.alignment = {
            horizontal: 'center',
        };

        console.log(firstRowCount);
        let currentRow = firstRowCount;
        console.log(currentRow);
        ppmpItems.map((item) => {
            console.log(item);

            worksheet.addRow({
                expenseAccount: chartOfAccounts.find((account) => {
                    return (
                        account.id === item.ppmp_price_list?.chart_of_account_id
                    );
                })?.account_title,
                itemNo: item.ppmp_price_list?.item_number,
                description: item.ppmp_price_list?.description,
                unitOfMeasurement: item.ppmp_price_list?.unit_of_measurement,
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
                ppmpPriceList={[]}
                selectedEntry={aipEntry}
                ppmpItems={ppmpItems}
            />
        </AppLayout>
    );
}
