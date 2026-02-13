export interface AipEntry {
    id: number;
    // Add other AipEntry properties as needed
    created_at: string;
    updated_at: string;
}

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
    ppmp_price_lists?: PriceList[];
}

export interface FiscalYear {
    id: number;
    year: string;
    status: string; // change later to enum
    created_at: string | null;
    updated_at: string | null;
}

export interface Ppmp {
    id: number;
    aip_entry_id: number;
    ppmp_price_list_id: number | null;
    // quantity: string;
    jan_qty: string;
    jan_amount: string;
    feb_qty: string;
    feb_amount: string;
    mar_qty: string;
    mar_amount: string;
    apr_qty: string;
    apr_amount: string;
    may_qty: string;
    may_amount: string;
    jun_qty: string;
    jun_amount: string;
    jul_qty: string;
    jul_amount: string;
    aug_qty: string;
    aug_amount: string;
    sep_qty: string;
    sep_amount: string;
    oct_qty: string;
    oct_amount: string;
    nov_qty: string;
    nov_amount: string;
    dec_qty: string;
    dec_amount: string;
    created_at: string | null;
    updated_at: string | null;
    ppmp_price_list?: PriceList;
}

export interface PriceList {
    id: number;
    item_number: number;
    description: string;
    unit_of_measurement: string;
    price: string;
    chart_of_account_id: number;
    ppmp_category_id: number;
    created_at: string | null;
    updated_at: string | null;
    category?: PpmpCategory;
}

export interface PpmpCategory {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
}
