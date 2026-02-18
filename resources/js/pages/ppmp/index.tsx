import { useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FileDown, Sheet } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import DataTable from '@/pages/ppmp/ppmp-table/data-table';
import PpmpFormDialog from '@/pages/ppmp/ppmp-form-dialog';

import { type BreadcrumbItem } from '@/types';
import {
    FiscalYear,
    Ppmp,
    ChartOfAccount,
    AipEntry,
    PpmpCategory,
} from '@/pages/types/types';
import exportToExcel from '@/pages/ppmp/utils/export';

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
    ppmpCategories,
}: PpmpPageProps) {
    console.log(ppmpItems);
    const [open, setOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        {
            title: `AIP Summary FY ${fiscalYear.year}`,
            href: `/aip/${fiscalYear.id}/summary`,
        },
        { title: `PPMP Management`, href: `#` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full flex-1 px-4 py-4">
                <div className="mb-4 flex items-center justify-between">
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
                                    <DropdownMenuItem
                                        onClick={() =>
                                            exportToExcel({
                                                ppmpItems,
                                                ppmpCategories,
                                                chartOfAccounts,
                                            })
                                        }
                                    >
                                        <Sheet /> Excel
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem>PDF</DropdownMenuItem> */}
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
