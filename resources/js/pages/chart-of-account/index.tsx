import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { ChartOfAccount } from '@/pages/types/types';
import ChartOfAccountTablePage from '@/pages/chart-of-account/table/page';
import { Button } from '@/components/ui/button';
import FormDialog from '@/pages/chart-of-account/form-dialog';
import DeleteDialog from '@/pages/chart-of-account/delete-dialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Chart of Accounts', href: '#' }];

interface ChartOfAccountPageProps {
    chartOfAccounts: ChartOfAccount[];
}

export default function ChartOfAccountPage({
    chartOfAccounts,
}: ChartOfAccountPageProps) {
    console.log(chartOfAccounts);

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(
        null,
    );

    function handleAdd() {
        setSelectedAccount(null);
        setOpen(true);
    }

    function handleEdit(account: ChartOfAccount) {
        console.log(account);

        const newAccount = {
            ...account,
            is_postable: account.is_postable ? true : false,
            is_active: account.is_active ? true : false,
        };

        setSelectedAccount(newAccount);
        setOpen(true);
    }

    function handleDelete(account: ChartOfAccount) {
        setSelectedAccount(account);
        setOpenDelete(true);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <ChartOfAccountTablePage
                    data={chartOfAccounts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                >
                    <div className="flex justify-end">
                        <Button onClick={handleAdd}>Add Chart of Account</Button>
                    </div>
                </ChartOfAccountTablePage>
            </div>

            <FormDialog
                open={open}
                setOpen={setOpen}
                initialData={selectedAccount}
            />

            <DeleteDialog
                open={openDelete}
                setOpen={setOpenDelete}
                initialData={selectedAccount}
            />
        </AppLayout>
    );
}
