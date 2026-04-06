import { createColumnHelper } from '@tanstack/react-table';
import type { User } from '@/types/global';

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => {
            return <div className="text-wrap">{info.getValue()}</div>;
        },
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => {
            return <div className="text-wrap">{info.getValue()}</div>;
        },
    }),
    columnHelper.accessor('office.name', {
        header: 'Department / Office',
        cell: (info) => {
            return <div className="text-wrap">{info.getValue()}</div>;
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
            return <div className="text-wrap">{info.getValue()}</div>;
        },
    }),
    // columnHelper.display({
    //     id: 'action',
    //     header: 'Action',
    //     cell: () => {
    //         return <div className="text-wrap">action</div>;
    //     },
    // }),
];

export default columns;
