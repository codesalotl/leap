import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import DataTable from '@/pages/aip/ppmp-table/data-table';
import { FiscalYear, Ppmp } from '@/pages/types/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import PpmpFormDialog from '@/pages/aip/ppmp-form-dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface PpmpPageProps {
    fiscalYear: FiscalYear;
    ppmpItems: Ppmp[];
    chartOfAccounts: unknown[];
}

export default function PpmpPage({
    fiscalYear,
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
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">PPMP Management</h1>
                    <Button onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
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
                                alert('Delete functionality coming soon!');
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
                selectedEntry={null}
                ppmpItems={ppmpItems}
            />
        </AppLayout>
    );
}
