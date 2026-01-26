import PpmpPriceListTable from '@/pages/ppmp/data-table/page';
import { PpmpPriceList } from '@/pages/ppmp/data-table/columns';
import PpmpPriceListFormDialog from '@/pages/ppmp/form-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPMP Price List',
        href: '/ppmp-price-list',
    },
];

type PpmpPriceListPageProps = {
    priceList: PpmpPriceList[];
};

export default function PpmpPriceListPage({
    priceList,
}: PpmpPriceListPageProps) {
    const [open, setOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <Button onClick={() => setOpen(true)}>
                            Create PPMP Price List
                        </Button>
                    </div>

                    <PpmpPriceListTable data={priceList} />
                </div>

                <PpmpPriceListFormDialog open={open} onOpenChange={setOpen} />
            </div>
        </AppLayout>
    );
}
