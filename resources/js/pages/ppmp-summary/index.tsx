import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/data-table';
// import columns from './table/columns';
import { getPriceListColumns } from './table/columns';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'PPMP Summary', href: '#' }];

interface PpmpSummaryPageProps {
    priceLists: any[];
    fiscalYear: any;
}

export default function PpmpSummaryPage({
    priceLists,
    fiscalYear: _fiscalYear,
}: PpmpSummaryPageProps) {
    console.log(priceLists);

    const columns = useMemo(
        () => getPriceListColumns(priceLists),
        [priceLists],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <DataTable
                    columns={columns}
                    data={priceLists}
                    withSearch={true}
                />
            </div>
        </AppLayout>
    );
}
