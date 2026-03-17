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
import { Plus, FileDown, Sheet, FileText, Printer } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/pages/ppmp/ppmp-table/data-table';
import PpmpFormDialog from '@/pages/ppmp/ppmp-form-dialog';
import PpmpTablePageProps from './ppmp-table/page';
import DeleteDialog from './delete-dialog';

import { type BreadcrumbItem } from '@/types';
import type {
    FiscalYear,
    Ppmp,
    ChartOfAccount,
    AipEntry,
    PpmpCategory,
    FundingSource,
} from '@/pages/types/types';
import {
    exportToExcel,
    exportToPDF,
    exportToPrint,
} from '@/pages/ppmp/utils/export';

interface PpmpPageProps {
    fiscalYear: FiscalYear;
    aipEntry: AipEntry;
    ppmpItems: Ppmp[];
    chartOfAccounts: ChartOfAccount[];
    ppmpCategories: PpmpCategory[];
    fundingSources: FundingSource[];
}

export default function PpmpPage({
    fiscalYear,
    aipEntry,
    ppmpItems,
    chartOfAccounts,
    ppmpCategories,
    fundingSources,
}: PpmpPageProps) {
    // console.log(ppmpItems);
    console.log(fundingSources);

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedSource, setSelectedSource] = useState<Ppmp | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Annual Investment Programs', href: '/aip' },
        {
            title: `AIP Summary FY ${fiscalYear.year}`,
            href: `/aip/${fiscalYear.id}/summary`,
        },
        { title: `PPMP Management`, href: `#` },
    ];

    function handleDelete(source: Ppmp) {
        setSelectedSource(source);
        setOpenDelete(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full flex-1 px-4 py-4">
                <PpmpTablePageProps
                    data={ppmpItems}
                    // onEdit={handleEdit}
                    onDelete={handleDelete}
                >
                    <div className="flex items-center justify-between">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="dark">
                                        Show All
                                    </SelectItem>
                                    <SelectItem value="light">
                                        Funding Source
                                    </SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

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
                                                exportToPrint({
                                                    ppmpItems,
                                                    ppmpCategories,
                                                    chartOfAccounts,
                                                })
                                            }
                                        >
                                            <Printer /> Print
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() =>
                                                exportToPDF({
                                                    ppmpItems,
                                                    ppmpCategories,
                                                    chartOfAccounts,
                                                })
                                            }
                                        >
                                            <FileText /> To PDF
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() =>
                                                exportToExcel({
                                                    ppmpItems,
                                                    ppmpCategories,
                                                    chartOfAccounts,
                                                })
                                            }
                                        >
                                            <Sheet /> To Excel
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button onClick={() => setOpen(true)}>
                                <Plus /> Add Item
                            </Button>
                        </div>
                    </div>

                    {/* <ScrollArea className="h-[calc(100vh-8rem)] rounded-md border">
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
                </ScrollArea> */}
                </PpmpTablePageProps>
            </div>

            <PpmpFormDialog
                open={open}
                onOpenChange={setOpen}
                chartOfAccounts={chartOfAccounts}
                ppmpCategories={ppmpCategories}
                ppmpPriceList={[]}
                selectedEntry={aipEntry}
                ppmpItems={ppmpItems}
                fundingSources={fundingSources}
            />

            <DeleteDialog
                open={openDelete}
                setOpen={setOpenDelete}
                initialData={selectedSource}
            />
        </AppLayout>
    );
}
