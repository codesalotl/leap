import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FiscalYearDialog from '@/pages/aip/fiscal-year-dialog';
import { columns } from '@/pages/aip/fiscal-year-table/columns';
import { FiscalYearDataTable } from '@/pages/aip/fiscal-year-table/data-table';
import { index } from '@/routes/aip';
import { FiscalYear } from '@/pages/types/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Annual Investment Programs',
        href: index().url,
    },
];

interface AipProps {
    fiscalYears: FiscalYear[];
}

export default function AipPage({ fiscalYears }: AipProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <FiscalYearDataTable
                    columns={columns}
                    data={fiscalYears}
                    searchKey="year"
                >
                    <FiscalYearDialog />
                </FiscalYearDataTable>
            </div>
        </AppLayout>
    );
}
