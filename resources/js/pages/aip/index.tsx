import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import FormDialog from '@/pages/aip/form-dialog';
import { type BreadcrumbItem } from '@/types';
import type { FiscalYear, FiscalYearStatus, App } from '@/types/global';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import columns from './table/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Annual Investment Programs',
        // href: index().url,
        href: '#',
    },
];

interface AipProps {
    fiscalYears: FiscalYear[];
    app: App[];
}

export default function AipPage({ fiscalYears, app }: AipProps) {
    console.log({ fiscalYears, app });

    const [openFormDialog, setOpenFormDialog] = useState(false);

    function onUpdateStatus(data: FiscalYear, status: FiscalYearStatus) {
        router.patch(
            `/aip/${data.id}/status`,
            { status: status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Status updated successfully');
                },
                onError: (errors) => {
                    console.error('Failed to update status', errors);
                },
            },
        );
    }

    function handleOpenAipSummary(data: FiscalYear) {
        router.get(`/aip/${data.id}/summary`);
    }

    function handleOpenFormDialog() {
        setOpenFormDialog(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <DataTable
                    columns={columns}
                    data={fiscalYears}
                    withSearch={true}
                    onUpdateStatus={onUpdateStatus}
                    onOpen={handleOpenAipSummary}
                >
                    <Button onClick={handleOpenFormDialog}>
                        Initialize AIP
                    </Button>
                </DataTable>
            </div>

            <FormDialog open={openFormDialog} setOpen={setOpenFormDialog} />
        </AppLayout>
    );
}
