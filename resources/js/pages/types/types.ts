export interface ChartOfAccount {
    id: number;
    account_number: string;
    account_title: string;
    account_type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    expense_class: 'PS' | 'MOOE' | 'FE' | 'CO';
    account_series: string | null;
    parent_id: number | null;
    level: number;
    is_postable: boolean;
    is_active: boolean;
    normal_balance: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}
