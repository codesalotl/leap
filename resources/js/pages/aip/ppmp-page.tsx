import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import DataTable from '@/pages/aip/ppmp-table/data-table';
import { FiscalYear, Ppmp } from '@/pages/types/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PpmpPageProps {
    fiscalYear: FiscalYear;
    ppmpItems: Ppmp[];
}

export default function PpmpPage({ fiscalYear, ppmpItems }: PpmpPageProps) {
    // console.log(fiscalYear);
    console.log(ppmpItems);

    const [open, setOpen] = useState(false);
    const [selectedPpmp, setSelectedPpmp] = useState<Ppmp | null>(null);

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
                <DataTable ppmpItems={ppmpItems} setOpen={(ppmp) => {
                    setSelectedPpmp(ppmp);
                    setOpen(true);
                }} onDelete={(ppmp) => {
                    if (confirm(`Are you sure you want to delete "${ppmp.ppmp_price_list?.description}"? This action cannot be undone.`)) {
                        alert('Delete functionality coming soon!');
                    }
                }} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit PPMP Item</DialogTitle>
                        <DialogDescription>
                            {selectedPpmp?.ppmp_price_list?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="text-sm text-muted-foreground">
                            Item: {selectedPpmp?.ppmp_price_list?.item_number}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Unit: {selectedPpmp?.ppmp_price_list?.unit_of_measurement}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                setSelectedPpmp(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            alert('Edit functionality coming soon!');
                        }}>
                            Update
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
