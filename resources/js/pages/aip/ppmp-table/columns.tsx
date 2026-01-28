import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
export type Ppmp = {
    id: string;
    aip_entry_id: number;
    expense_account_id: number | null;
    ppmp_price_list_id: number | null;
    item_description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total_amount: number;
    specifications: string | null;
    jan_qty: number;
    jan_amount: number;
    feb_qty: number;
    feb_amount: number;
    mar_qty: number;
    mar_amount: number;
    apr_qty: number;
    apr_amount: number;
    may_qty: number;
    may_amount: number;
    jun_qty: number;
    jun_amount: number;
    jul_qty: number;
    jul_amount: number;
    aug_qty: number;
    aug_amount: number;
    sep_qty: number;
    sep_amount: number;
    oct_qty: number;
    oct_amount: number;
    nov_qty: number;
    nov_amount: number;
    dec_qty: number;
    dec_amount: number;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<Ppmp>[] = [
    {
        accessorKey: 'expense_account_id',
        header: 'Expense Account',
    },
    {
        accessorKey: 'ppmp_price_list_id',
        header: 'Item No.',
    },
    {
        accessorKey: 'item_description',
        header: 'Description',
    },
    {
        accessorKey: 'unit',
        header: 'Unit of Measurement',
    },
    {
        accessorKey: 'unit_price',
        header: 'PRICELIST',
    },
    {
        accessorKey: 'quantity',
        header: 'CY 2026-QTY',
    },
    {
        accessorKey: 'total_amount',
        header: 'TOTAL',
    },
    {
        accessorKey: 'jan_qty',
        header: 'JAN-QTY',
    },
    {
        accessorKey: 'jan_amount',
        header: 'JAN',
    },
    {
        accessorKey: 'feb_qty',
        header: 'FEB-QTY',
    },
    {
        accessorKey: 'feb_amount',
        header: 'FEB',
    },
    {
        accessorKey: 'mar_qty',
        header: 'MAR-QTY',
    },
    {
        accessorKey: 'mar_amount',
        header: 'MAR',
    },
    {
        accessorKey: 'apr_qty',
        header: 'APR-QTY',
    },
    {
        accessorKey: 'apr_amount',
        header: 'APR',
    },
    {
        accessorKey: 'may_qty',
        header: 'MAY-QTY',
    },
    {
        accessorKey: 'may_amount',
        header: 'MAY',
    },
    {
        accessorKey: 'jun_qty',
        header: 'JUN-QTY',
    },
    {
        accessorKey: 'jun_amount',
        header: 'JUN',
    },
    {
        accessorKey: 'jul_qty',
        header: 'JUL-QTY',
    },
    {
        accessorKey: 'jul_amount',
        header: 'JUL',
    },
    {
        accessorKey: 'aug_qty',
        header: 'AUG-QTY',
    },
    {
        accessorKey: 'aug_amount',
        header: 'AUG',
    },
    {
        accessorKey: 'sep_qty',
        header: 'SEP-QTY',
    },
    {
        accessorKey: 'sep_amount',
        header: 'SEP',
    },
    {
        accessorKey: 'oct_qty',
        header: 'OCT-QTY',
    },
    {
        accessorKey: 'oct_amount',
        header: 'OCT',
    },
    {
        accessorKey: 'nov_qty',
        header: 'NOV-QTY',
    },
    {
        accessorKey: 'nov_amount',
        header: 'NOV',
    },
    {
        accessorKey: 'dec_qty',
        header: 'DEC-QTY',
    },
    {
        accessorKey: 'dec_amount',
        header: 'DEC',
    },
];
