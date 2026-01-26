import { ColumnDef } from '@tanstack/react-table';

export interface PpmpPriceList {
    id: number;
    item_code: string;
    item_description: string;
    unit: string;
    /** * Represented as string to maintain precision from decimal(10,2)
     * or number if you handle conversion in the API transformer.
     */
    unit_price: string | number;
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    account_code: string;
    procurement_type: 'Goods' | 'Services' | 'Civil Works' | 'Consulting';
    standard_specifications: string | null;
    updated_at: string; // ISO Timestamp
    created_at: string; // ISO Timestamp
}

export const columns: ColumnDef<PpmpPriceList>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'item_code',
        header: 'Item Code',
    },
    {
        accessorKey: 'item_description',
        header: 'Item Description',
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
    },
    {
        accessorKey: 'unit_price',
        header: 'Unit Price',
    },
    {
        accessorKey: 'expense_class',
        header: 'Expense Class',
    },
    {
        accessorKey: 'account_code',
        header: 'Account Code',
    },
    {
        accessorKey: 'procurement_type',
        header: 'Procurement Type',
    },
    {
        accessorKey: 'standard_specifications',
        header: 'Specifications',
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Updated',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
    },
];
