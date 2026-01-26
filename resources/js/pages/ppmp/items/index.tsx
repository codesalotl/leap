import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PPMP Headers',
        href: '/ppmp-headers',
    },
    {
        title: 'PPMP Items',
        href: '/ppmp-items',
    },
];

type PpmpItem = {
    id: number;
    ppmp_header_id: number;
    ppmp_price_list_id: number;
    quantity: string;
    unit_price: string;
    total_amount: string;
    specifications: string | null;
    jan_qty: number;
    jan_amount: string;
    feb_qty: number;
    feb_amount: string;
    mar_qty: number;
    mar_amount: string;
    apr_qty: number;
    apr_amount: string;
    may_qty: number;
    may_amount: string;
    jun_qty: number;
    jun_amount: string;
    jul_qty: number;
    jul_amount: string;
    aug_qty: number;
    aug_amount: string;
    sep_qty: number;
    sep_amount: string;
    oct_qty: number;
    oct_amount: string;
    nov_qty: number;
    nov_amount: string;
    dec_qty: number;
    dec_amount: string;
    created_at: string;
    updated_at: string;
    ppmp_price_list?: {
        id: number;
        item_code: string;
        item_description: string;
        unit: string;
        expense_class: string;
        account_code: string;
        procurement_type: string;
    };
};

type PpmpHeader = {
    id: number;
    aip_entry_id: number;
    office_id: number;
    procurement_type: string;
    procurement_method: string;
    implementation_schedule: string | null;
    source_of_funds: string | null;
    approved_budget: string;
    status: string;
    created_at: string;
    updated_at: string;
    aip_entry?: {
        id: number;
        expected_output: string;
    };
    office?: {
        id: number;
        name: string;
    };
};

type PpmpItemsPageProps = {
    ppmpHeader: PpmpHeader;
    ppmpItems: PpmpItem[];
    ppmpPriceList: any[];
};

export default function PpmpItemsPage({
    ppmpHeader,
    ppmpItems,
    ppmpPriceList = [],
}: PpmpItemsPageProps) {
    const months = [
        { key: 'jan', name: 'January' },
        { key: 'feb', name: 'February' },
        { key: 'mar', name: 'March' },
        { key: 'apr', name: 'April' },
        { key: 'may', name: 'May' },
        { key: 'jun', name: 'June' },
        { key: 'jul', name: 'July' },
        { key: 'aug', name: 'August' },
        { key: 'sep', name: 'September' },
        { key: 'oct', name: 'October' },
        { key: 'nov', name: 'November' },
        { key: 'dec', name: 'December' },
    ];

    const getTotalQuantity = () => {
        return ppmpItems.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
    };

    const getTotalAmount = () => {
        return ppmpItems.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
    };

    const getMonthlyTotal = (monthKey: string) => {
        return ppmpItems.reduce((sum, item) => sum + parseFloat(item[`${monthKey}_amount` as keyof PpmpItem] as string), 0);
    };

    const getRemainingBudget = () => {
        return parseFloat(ppmpHeader.approved_budget) - getTotalAmount();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">PPMP Items</h1>
                        <p className="text-muted-foreground">
                            Manage items for PPMP #{ppmpHeader.id.toString().padStart(4, '0')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            Back to PPMP Headers
                        </Button>
                        <Button>
                            Add PPMP Item
                        </Button>
                    </div>
                </div>

                {/* PPMP Header Summary */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>PPMP Header Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Office</p>
                                <p className="font-semibold">{ppmpHeader.office?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Procurement Type</p>
                                <p className="font-semibold">{ppmpHeader.procurement_type}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Approved Budget</p>
                                <p className="font-semibold">₱{parseFloat(ppmpHeader.approved_budget).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Remaining Budget</p>
                                <p className={`font-semibold ${getRemainingBudget() < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ₱{getRemainingBudget().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Total Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{ppmpItems.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Total Quantity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{getTotalQuantity().toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Total Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">₱{getTotalAmount().toLocaleString()}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* PPMP Items Table */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>PPMP Items</CardTitle>
                        <CardDescription>
                            Line items for this procurement plan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {ppmpItems.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No items added yet</p>
                                <Button>Add First Item</Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Item Code</th>
                                            <th className="text-left p-2">Description</th>
                                            <th className="text-left p-2">Unit</th>
                                            <th className="text-right p-2">Unit Price</th>
                                            <th className="text-right p-2">Quantity</th>
                                            <th className="text-right p-2">Total Amount</th>
                                            <th className="text-center p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ppmpItems.map((item) => (
                                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2">{item.ppmp_price_list?.item_code}</td>
                                                <td className="p-2">{item.ppmp_price_list?.item_description}</td>
                                                <td className="p-2">{item.ppmp_price_list?.unit}</td>
                                                <td className="p-2 text-right">₱{parseFloat(item.unit_price).toLocaleString()}</td>
                                                <td className="p-2 text-right">{parseFloat(item.quantity).toLocaleString()}</td>
                                                <td className="p-2 text-right font-semibold">₱{parseFloat(item.total_amount).toLocaleString()}</td>
                                                <td className="p-2 text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="text-red-600">
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2">
                                            <td colSpan={4} className="p-2 font-semibold">Total</td>
                                            <td className="p-2 text-right font-semibold">{getTotalQuantity().toLocaleString()}</td>
                                            <td className="p-2 text-right font-semibold">₱{getTotalAmount().toLocaleString()}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Distribution</CardTitle>
                        <CardDescription>
                            Quantity and amount distribution across months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Month</th>
                                        {months.map((month) => (
                                            <th key={month.key} className="text-center p-2" colSpan={2}>
                                                {month.name}
                                            </th>
                                        ))}
                                        <th className="text-center p-2" colSpan={2}>Total</th>
                                    </tr>
                                    <tr className="border-b">
                                        <th className="text-left p-2"></th>
                                        {months.map((month) => (
                                            <React.Fragment key={month.key}>
                                                <th className="text-center p-2 text-sm">Qty</th>
                                                <th className="text-center p-2 text-sm">Amount</th>
                                            </React.Fragment>
                                        ))}
                                        <th className="text-center p-2 text-sm">Qty</th>
                                        <th className="text-center p-2 text-sm">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ppmpItems.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2 font-medium">{item.ppmp_price_list?.item_description}</td>
                                            {months.map((month) => (
                                                <React.Fragment key={month.key}>
                                                    <td className="p-2 text-center">{item[`${month.key}_qty` as keyof PpmpItem]}</td>
                                                    <td className="p-2 text-right">₱{parseFloat(item[`${month.key}_amount` as keyof PpmpItem] as string).toLocaleString()}</td>
                                                </React.Fragment>
                                            ))}
                                            <td className="p-2 text-center font-semibold">{parseFloat(item.quantity).toLocaleString()}</td>
                                            <td className="p-2 text-right font-semibold">₱{parseFloat(item.total_amount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="border-t-2">
                                        <td className="p-2 font-semibold">Monthly Total</td>
                                        {months.map((month) => (
                                            <React.Fragment key={month.key}>
                                                <td className="p-2 text-center font-semibold">
                                                    {ppmpItems.reduce((sum, item) => sum + item[`${month.key}_qty` as keyof PpmpItem] as number, 0)}
                                                </td>
                                                <td className="p-2 text-right font-semibold">
                                                    ₱{getMonthlyTotal(month.key).toLocaleString()}
                                                </td>
                                            </React.Fragment>
                                        ))}
                                        <td className="p-2 text-center font-semibold">{getTotalQuantity().toLocaleString()}</td>
                                        <td className="p-2 text-right font-semibold">₱{getTotalAmount().toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
