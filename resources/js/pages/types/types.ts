export interface AipEntry {
    id: number;
    ppa_id: number;
    parent_ppa_id: number | null;
    aip_ref_code: string;
    ppa_desc: string;
    implementing_office_department: string;
    sched_implementation: {
        start_date: string;
        completion_date: string;
    };
    expected_outputs: string;
    funding_source: string;
    amount: {
        ps: string;
        mooe: string;
        fe: string;
        co: string;
        total: string;
    };
    cc_adaptation: string;
    cc_mitigation: string;
    cc_typology_code: string;
    children?: AipEntry[];
    created_at: string;
    updated_at: string;
}

export interface LguLevel {
    code: string;
    created_at: string;
    id: number;
    level: string;
    updated_at: string;
}

export interface OfficeType {
    code: string;
    created_at: string;
    id: number;
    type: string;
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

export interface Office {
    id: number;
    sector_id: number | null;
    lgu_level_id: number;
    office_type_id: number;
    code: string;
    name: string;
    acronym: string | null;
    is_lee: boolean;
    full_code: string;
    lgu_level?: LguLevel;
    office_type?: OfficeType;
    sector?: Sector;
    created_at: string | null;
    updated_at: string | null;
}

export interface Sector {
    id: number;
    code: string;
    sector: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface Ppa {
    id: number;
    office_id: number;
    parent_id: number | null;
    title: string;
    type: 'Program' | 'Project' | 'Activity';
    code_suffix: string;
    is_active: boolean;
    created_at: string | null;
    updated_at: string | null;
    children?: Ppa[];
    office?: Office;
}
