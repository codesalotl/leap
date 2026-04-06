import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { User, Ppa } from '@/types/global';
import { DataTable } from '@/components/data-table';
import columns from './table/columns';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '#' }];

interface UsersIndexProps {
    users: User[];
    ppas: Ppa[];
}

export default function UsersIndex({ users, ppas }: UsersIndexProps) {
    // console.log({ users, ppas });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <DataTable columns={columns} data={users} withSearch={true}>
                    <div>e</div>
                </DataTable>
            </div>
        </AppLayout>
    );
}
