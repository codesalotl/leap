import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FiscalYearFormDialog from '@/pages/aip/fiscal-year-form-dialog';
import { columns } from '@/pages/aip/fiscal-year-table/columns';
import { FiscalYearDataTable } from '@/pages/aip/fiscal-year-table/data-table';
import { FiscalYear } from '@/pages/types/types';
// import { index } from '@/routes/aip';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Annual Investment Programs',
        // href: index().url,
        href: '#',
    },
];

interface AipProps {
    fiscalYears: FiscalYear[];
}

export default function AipPage({ fiscalYears }: AipProps) {
    // console.log(fiscalYears);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-4">
                <FiscalYearDataTable
                    columns={columns}
                    data={fiscalYears}
                    searchKey="year"
                >
                    <FiscalYearFormDialog />
                </FiscalYearDataTable>
            </div>
        </AppLayout>
    );
}
