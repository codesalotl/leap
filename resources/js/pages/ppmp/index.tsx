import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

// Components
import { columns, PpmpPriceList } from './ppmp-price-list-table/columns';
import { PpmpDataTable } from './ppmp-price-list-table/data-table';
import PpmpPriceListFormDialog from './form-dialog';
import DeleteDialog from './delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'PPMP Price List', href: '/ppmp-price-list' },
];

type ChartOfAccount = {
    id: number;
    account_number: string;
    account_title: string;
    account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    account_series: string;
    parent_id: number;
    level: number;
    is_postable: boolean;
    is_active: boolean;
    normal_balance: 'DEBIT' | 'CREDIT';
    description: string;
    created_at: string;
    updated_at: string;
};

type PpmpPriceListPageProps = {
    priceList: PpmpPriceList[];
    chartOfAccounts: ChartOfAccount[];
};

export default function PpmpPriceListPage({
    priceList,
    chartOfAccounts,
}: PpmpPriceListPageProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editingItem, setEditingItem] = useState<PpmpPriceList | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<PpmpPriceList | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreate = () => {
        setEditingItem(null);
        setMode('create');
        setOpen(true);
    };

    const handleEdit = (item: PpmpPriceList) => {
        setEditingItem(item);
        setMode('edit');
        setOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        router.delete(`/ppmp-price-list/${itemToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        PPMP Price List
                    </h2>
                    <Button onClick={handleCreate}>
                        Create Price List Item
                    </Button>
                </div>

                <PpmpDataTable
                    columns={columns}
                    data={priceList}
                    meta={{
                        onEdit: handleEdit,
                        onDelete: (item: PpmpPriceList) => {
                            setItemToDelete(item);
                            setDeleteDialogOpen(true);
                        },
                    }}
                />

                <PpmpPriceListFormDialog
                    open={open}
                    onOpenChange={setOpen}
                    chartOfAccounts={chartOfAccounts}
                    editingItem={editingItem}
                    mode={mode}
                />

                <DeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    item={itemToDelete}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
