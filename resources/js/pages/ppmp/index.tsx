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
    chartOfAccounts: any[];
};

export default function PpmpPriceListPage({
    priceList,
    chartOfAccounts,
}: PpmpPriceListPageProps) {
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PpmpPriceList | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    const handleEdit = (item: PpmpPriceList) => {
        setEditingItem(item);
        setMode('edit');
        setOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setMode('create');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
        setMode('create');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <Button onClick={handleCreate}>
                            Create PPMP Price List
                        </Button>
                    </div>

                    <PpmpPriceListTable data={priceList} onEdit={handleEdit} />
                </div>

                <PpmpPriceListFormDialog 
                    open={open} 
                    onOpenChange={handleClose} 
                    chartOfAccounts={chartOfAccounts}
                    editingItem={editingItem}
                    mode={mode}
                />
            </div>
        </AppLayout>
    );
}
