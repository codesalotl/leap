import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import FormDialog from './form-dialog';
import DeleteDialog from './delete-dialog';
import OfficeTablePage from './table/page';
import type { Office, Sector, LguLevel, OfficeType } from '@/pages/types/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Offices', href: '#' }];

interface OfficesPageProps {
    offices: Office[];
    sectors: Sector[];
    lguLevels: LguLevel[];
    officeTypes: OfficeType[];
}

export default function OfficesPage({
    offices,
    sectors,
    lguLevels,
    officeTypes,
}: OfficesPageProps) {
    console.log(offices);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedOfficeForDelete, setSelectedOfficeForDelete] = useState<Office | null>(null);

    console.log(selectedOffice);

    const handleCreate = () => {
        setSelectedOffice(null);
        setIsDialogOpen(true);
    };

    function handleEdit(value: Office) {
        setSelectedOffice(value);
        setIsDialogOpen(true);
    }

    function handleDelete(office: Office) {
        setSelectedOfficeForDelete(office);
        setIsDeleteDialogOpen(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pt-4 pb-4">
                <OfficeTablePage
                    data={offices}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                >
                    <Button onClick={handleCreate}>Add Office</Button>
                </OfficeTablePage>

                <FormDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    initialData={selectedOffice}
                    sectors={sectors}
                    lguLevels={lguLevels}
                    officeTypes={officeTypes}
                />

                <DeleteDialog
                    open={isDeleteDialogOpen}
                    setOpen={setIsDeleteDialogOpen}
                    initialData={selectedOfficeForDelete}
                />
            </div>
        </AppLayout>
    );
}
