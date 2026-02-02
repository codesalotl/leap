import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FiscalYearDialog from '@/pages/aip/fiscal-year-dialog';
import { columns, FiscalYear } from '@/pages/aip/fiscal-year-table/columns';
import { FiscalYearDataTable } from '@/pages/aip/fiscal-year-table/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Annual Investment Programs',
        href: '/aip',
    },
];

interface AipProp {
    fiscalYears: FiscalYear[];
}

export default function Aip({ fiscalYears }: AipProp) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-4 pb-4">
                <FiscalYearDataTable
                    columns={columns}
                    data={fiscalYears}
                    searchKey="year"
                >
                    {/* We pass the Dialog as a child to appear next to columns dropdown */}
                    <FiscalYearDialog />
                </FiscalYearDataTable>
            </div>
        </AppLayout>
    );
}
