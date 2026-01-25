import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ChartOfAccount } from '@/pages/chart-of-accounts/table/columns';
import ChartOfAccountsTable from '@/pages/chart-of-accounts/table/page';

type ChartOfAccountsPageProps = {
    chartOfAccounts: ChartOfAccount[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chart of Accounts',
        href: '/chart-of-accounts',
    },
];

export default function ChartOfAccountsPage({
    chartOfAccounts,
}: ChartOfAccountsPageProps) {
    // console.log(chartOfAccounts);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <ChartOfAccountsTable chartOfAccounts={chartOfAccounts} />
            </div>
        </AppLayout>
    );
}
