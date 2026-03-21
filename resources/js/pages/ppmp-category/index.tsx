import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { PpmpCategory } from '@/types/global';
import PpmpCategoryTablePage from '@/pages/ppmp-category/table/page';
import { Button } from '@/components/ui/button';
import FormDialog from '@/pages/ppmp-category/form-dialog';
import DeleteDialog from '@/pages/ppmp-category/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'PPMP Category', href: '#' }];

interface PpmpCategoryPageProps {
    ppmpCategories: PpmpCategory[];
}

export default function PpmpCategoryPage({
    ppmpCategories,
}: PpmpCategoryPageProps) {
    console.log(ppmpCategories);

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<PpmpCategory | null>(null);

    function handleAdd() {
        setSelectedCategory(null);
        setOpen(true);
    }

    function handleEdit(category: PpmpCategory) {
        console.log(category);

        const newCategory = {
            ...category,
        };

        setSelectedCategory(newCategory);
        setOpen(true);
    }

    function handleDelete(category: PpmpCategory) {
        setSelectedCategory(category);
        setOpenDelete(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <PpmpCategoryTablePage
                    data={ppmpCategories}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                >
                    <div className="flex justify-end">
                        <Button onClick={handleAdd}>Add PPMP Category</Button>
                    </div>
                </PpmpCategoryTablePage>
            </div>

            <FormDialog
                open={open}
                setOpen={setOpen}
                initialData={selectedCategory}
            />

            <DeleteDialog
                open={openDelete}
                setOpen={setOpenDelete}
                initialData={selectedCategory}
            />
        </AppLayout>
    );
}
