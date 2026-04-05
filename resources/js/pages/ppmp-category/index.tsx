import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { PpmpCategory } from '@/types/global';
import { Button } from '@/components/ui/button';
import FormDialog from '@/pages/ppmp-category/form-dialog';
import { DeleteDialog } from '@/components/delete-dialog';
import { router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import columns from './table/columns';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'PPMP Category', href: '#' }];

interface PpmpCategoryPageProps {
    ppmpCategories: PpmpCategory[];
}

export default function PpmpCategoryPage({
    ppmpCategories,
}: PpmpCategoryPageProps) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<PpmpCategory | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    console.log(selectedCategory);

    function handleAdd() {
        setSelectedCategory(null);
        setOpen(true);
    }

    function handleDialogOpenChange(isOpen: boolean) {
        setOpen(isOpen);
        if (!isOpen) setSelectedCategory(null);
    }

    function handleEdit(category: PpmpCategory) {
        setSelectedCategory(category);
        setOpen(true);
    }

    function handleDeleteDialogOpen(category: PpmpCategory) {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    }

    function handleDelete() {
        router.delete(`/ppmp-categories/${selectedCategory?.id}`, {
            preserveState: true,
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedCategory(null);
            },
            onFinish: () => setIsLoading(false),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={ppmpCategories}
                    withSearch={true}
                    onEdit={handleEdit}
                    onDelete={handleDeleteDialogOpen}
                >
                    <div className="flex justify-end">
                        <Button onClick={handleAdd}>Add PPMP Category</Button>
                    </div>
                </DataTable>
            </div>

            <FormDialog
                open={open}
                setOpen={handleDialogOpenChange}
                initialData={selectedCategory}
            />

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete PPMP Category?"
                description={
                    <>
                        Are you sure you want to remove{' '}
                        <span className="font-bold text-foreground">
                            "{selectedCategory?.name}"
                        </span>
                        ?
                    </>
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedCategory(null);
                }}
                isLoading={isLoading}
            />
        </AppLayout>
    );
}
