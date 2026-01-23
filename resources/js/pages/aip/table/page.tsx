import { columns, Payment } from './columns';
import { DataTable } from './data-table';

const hardcodedPayments: Payment[] = [
    {
        id: '728ed52f',
        amount: 100,
        status: 'pending',
        email: 'm@example.com',
    },
    {
        id: 'abc12345',
        amount: 250,
        status: 'success',
        email: 'user@example.com',
    },
];

// 1. Remove 'async'
// 2. Accept 'payments' as a prop
export default function DemoPage() {
    return (
        <div className="container mx-auto">
            {/* 3. Pass the 'payments' prop to the DataTable */}
            <DataTable columns={columns} data={hardcodedPayments} />
        </div>
    );
}
