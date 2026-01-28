import PpmpPriceListTable from '@/pages/ppmp/data-table/page';
import { PpmpPriceList } from '@/pages/ppmp/data-table/columns';
import PpmpPriceListFormDialog from '@/pages/ppmp/form-dialog';
import DeleteDialog from '@/pages/ppmp/delete-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPMP Price List',
        href: '/ppmp-price-list',
    },
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
    const [editingItem, setEditingItem] = useState<PpmpPriceList | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<PpmpPriceList | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = (item: PpmpPriceList) => {
        setEditingItem(item);
        setMode('edit');
        setOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null); // clears editing item
        setMode('create');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
        setMode('create');
    };

    const handleDelete = (item: PpmpPriceList) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!itemToDelete) return;

        setIsDeleting(true);

        router.delete(`/ppmp-price-list/${itemToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
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

                    <PpmpPriceListTable
                        data={priceList}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <PpmpPriceListFormDialog
                    open={open}
                    onOpenChange={handleClose}
                    chartOfAccounts={chartOfAccounts}
                    editingItem={editingItem}
                    mode={mode}
                />

                <DeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={handleDeleteCancel}
                    item={itemToDelete}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                />
            </div>
        </AppLayout>
    );
}
