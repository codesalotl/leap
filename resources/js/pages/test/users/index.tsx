import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { User, Ppa } from '@/types/global';

import { DataTable } from '@/components/data-table';

import columns from './data-table/columns';
import twoColumns from './data-table-two/columns';
import threeColumns from './data-table-three/columns';
import AipSummaryCols from './aip-summary-cols/columns';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Test Table', href: '#' }];

interface UsersIndexProps {
    users: User[];
    ppas: Ppa[];
    aipEntries: Ppa[];
}

export interface Employee {
    id: number;
    name: string;
    role: string;
    department: string;
    email: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    years_tenure: number;
}

const dataTwo: Employee[] = [
    {
        id: 1,
        name: 'Alice Johnson',
        role: 'Software Engineer',
        department: 'Engineering',
        email: 'alice.j@company.com',
        status: 'Active',
        years_tenure: 4,
    },
    {
        id: 2,
        name: 'Marcus Chen',
        role: 'Product Designer',
        department: 'Design',
        email: 'm.chen@company.com',
        status: 'On Leave',
        years_tenure: 2,
    },
    {
        id: 3,
        name: 'Sarah Smith',
        role: 'Operations Manager',
        department: 'Management',
        email: 's.smith@company.com',
        status: 'Active',
        years_tenure: 7,
    },
    {
        id: 4,
        name: 'Leo Rodriguez',
        role: 'Data Analyst',
        department: 'Engineering',
        email: 'l.rod@company.com',
        status: 'Inactive',
        years_tenure: 1,
    },
];

export default function UsersIndex({
    users,
    ppas,
    aipEntries,
}: UsersIndexProps) {
    console.log({ users, ppas });

    // const flattenAipEntries = (aipEntries: Ppa[], depth = 0) => {
    //     const rows: any[] = [];

    //     aipEntries.forEach((aipEntry) => {
    //         const sources = aipEntry.ppa_funding_sources || [];
    //         const rowCount = Math.max(sources.length, 1);

    //         if (sources.length === 0) {
    //             rows.push({
    //                 ...aipEntry,
    //                 current_fs: null,
    //                 isFirstInGroup: true,
    //                 groupSize: 1,
    //                 depth,
    //             });
    //         } else {
    //             sources.forEach((fs, index) => {
    //                 rows.push({
    //                     ...aipEntry,
    //                     current_fs: fs,
    //                     isFirstInGroup: index === 0,
    //                     groupSize: rowCount,
    //                     depth,
    //                 });
    //             });
    //         }

    //         if (aipEntry.children && aipEntry.children.length > 0) {
    //             rows.push(...flattenAipEntries(aipEntry.children, depth + 1));
    //         }
    //     });

    //     return rows;
    // };

    // const flattenAipEntries = (ppas: Ppa[], depth = 0): any[] => {
    //     const rows: any[] = [];

    //     ppas.forEach((ppa) => {
    //         // 1. Separate children to avoid inflating the size of every row
    //         const { children, ...ppaData } = ppa;
    //         const sources = ppa.ppa_funding_sources || [];

    //         // 2. Determine how many rows the PARENT itself takes up
    //         const ppaRowCount = Math.max(sources.length, 1);

    //         // 3. Add the Parent rows (one for each funding source)
    //         if (sources.length === 0) {
    //             rows.push({
    //                 ...ppaData,
    //                 current_fs: null,
    //                 isFirstInGroup: true,
    //                 isLastInGroup: true, // It's the only row
    //                 groupSize: 1,
    //                 depth,
    //             });
    //         } else {
    //             sources.forEach((fs, index) => {
    //                 rows.push({
    //                     ...ppaData,
    //                     current_fs: fs,
    //                     isFirstInGroup: index === 0,
    //                     isLastInGroup: index === sources.length - 1, // Useful for styling
    //                     groupSize: ppaRowCount,
    //                     depth,
    //                 });
    //             });
    //         }

    //         // 4. Add Children immediately AFTER the last duplicate of the parent
    //         // This naturally places them "under" the parent hierarchy
    //         if (children && children.length > 0) {
    //             rows.push(...flattenAipEntries(children, depth + 1));
    //         }
    //     });

    //     return rows;
    // };

    const expandPpaByFundingSource = (ppas: Ppa[], depth = 0): any[] => {
        return ppas.flatMap((ppa) => {
            // 1. Recursively process children, incrementing depth for the next level
            const expandedChildren = ppa.children
                ? expandPpaByFundingSource(ppa.children, depth + 1)
                : [];

            const sources = ppa.ppa_funding_sources || [];

            // 2. If no funding sources, return the PPA once with its children
            if (sources.length === 0) {
                return [
                    {
                        ...ppa,
                        current_fs: null,
                        children: expandedChildren,
                        isFirstInGroup: true,
                        isLastInGroup: true,
                        groupSize: 1,
                        depth, // <--- Added depth
                    },
                ];
            }

            // 3. Duplicate PPA for each funding source
            return sources.map((fs, index) => {
                const isLast = index === sources.length - 1;

                return {
                    ...ppa,
                    current_fs: fs,
                    // Only the last duplicate retains the children array
                    children: isLast ? expandedChildren : [],
                    isFirstInGroup: index === 0,
                    isLastInGroup: isLast,
                    groupSize: sources.length,
                    depth, // <--- Added depth
                };
            });
        });
    };

    console.log(aipEntries);
    // console.log(flattenAipEntries(aipEntries));
    console.log(expandPpaByFundingSource(aipEntries));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-4">
                <DataTable columns={columns} data={users} withSearch={true}>
                    <div>e</div>
                </DataTable>

                <DataTable
                    columns={twoColumns}
                    data={dataTwo}
                    withSearch={true}
                />

                <DataTable
                    columns={threeColumns}
                    data={ppas}
                    withSearch={true}
                />

                <DataTable
                    columns={AipSummaryCols}
                    // data={flattenAipEntries(aipEntries)}
                    data={expandPpaByFundingSource(aipEntries)}
                    withSearch={true}
                    withRowSpan={true}
                />
            </div>
        </AppLayout>
    );
}
