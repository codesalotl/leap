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
                                    <DropdownMenuItem>Excel</DropdownMenuItem>
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
