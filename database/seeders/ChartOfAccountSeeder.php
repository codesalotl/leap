<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChartOfAccount;
use App\Models\AccountGroup;
use App\Models\AllotmentClass;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ChartOfAccountSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks to allow bulk seeding/truncating if necessary
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Define levels to process sequentially
        $levels = [1, 2, 3, 4, 5];

        foreach ($levels as $level) {
            $this->seedLevel($level);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    private function seedLevel(int $level): void
    {
        $accounts = $this->getAccountData($level);
        $now = Carbon::now();
        $batchData = [];

        // OPTIMIZATION: Cache parent IDs to avoid querying DB for every row
        // We create a map of [ 'UACS_CODE' => 'ID' ] for the *previous* level
        $parentMap = [];
        if ($level > 1) {
            $parentMap = DB::table('chart_of_accounts')
                ->where('level', $level - 1)
                ->pluck('id', 'uacs_code')
                ->toArray();
        }

        foreach ($accounts as $account) {
            // FIX: Ensure we handle potential empty rows from copy-paste errors
            if (empty($account) || count($account) < 4) {
                continue;
            }

            // FIX: Unpack 4 items (Code, Title, Level, IsPosting)
            [$code, $title, $dataLevel, $isPosting] = $account;

            // FIX: Guard against null codes
            if (empty($code)) {
                continue;
            }

            // Determine Parent ID using the Memory Map
            $parentId = null;
            if ($level > 1) {
                $parentCode = $this->generateParentCode((string) $code, $level);
                $parentId = $parentMap[$parentCode] ?? null;
            }

            $batchData[] = [
                'uacs_code' => (string) $code,
                'account_title' => $title,
                'parent_id' => $parentId,
                'account_group' => $this->resolveGroup((string) $code),
                'budget_class' => $this->resolveBudgetClass((string) $code),
                'normal_balance' => $this->resolveNormalBalance((string) $code),
                'level' => $level,
                'is_posting' => $isPosting,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Chunk insert to prevent placeholder overload
        foreach (array_chunk($batchData, 500) as $chunk) {
            DB::table('chart_of_accounts')->upsert(
                $chunk,
                ['uacs_code'], // Unique Key
                [
                    'account_title',
                    'parent_id',
                    'budget_class',
                    'is_posting',
                    'updated_at',
                ], // Update these if exists
            );
        }
    }

    // --- Logic Resolvers ---

    private function resolveGroup(string $code): string
    {
        // Ensure code is string and has length
        if (empty($code)) {
            return 'Asset';
        }

        return match ($code[0]) {
            '1' => 'Asset',
            '2' => 'Liability',
            '3' => 'Equity',
            '4' => 'Income', // Updated from Revenue based on GAM
            '5' => 'Expense',
            default => 'Asset',
        };
    }

    private function resolveNormalBalance(string $code): string
    {
        if (empty($code)) {
            return 'Debit';
        }

        return match ($code[0]) {
            '1', '5' => 'Debit',
            '2', '3', '4' => 'Credit',
            default => 'Debit',
        };
    }

    private function resolveBudgetClass(string $code): string
    {
        if (str_starts_with($code, '501')) {
            return 'PS';
        }
        if (str_starts_with($code, '502')) {
            return 'MOOE';
        }
        if (str_starts_with($code, '503')) {
            return 'FE';
        }
        // Capital Outlay covers 106 (PPE), 107 (Bio), 108 (Intangible) generally
        if (preg_match('/^10[678]/', $code)) {
            return 'CO';
        }

        return 'Non-Budget';
    }

    private function generateParentCode(string $code, int $level): ?string
    {
        if (strlen($code) < 10) {
            return null;
        }

        // UACS Hierarchy Logic
        return match ($level) {
            2 => substr($code, 0, 1) . '000000000', // Group -> Major
            3 => substr($code, 0, 3) . '0000000', // Major -> Sub-Major
            4 => substr($code, 0, 5) . '00000', // Sub-Major -> GL
            5 => substr($code, 0, 8) . '00', // GL -> SL
            default => null,
        };
    }

    /**
     * Data Source
     * Format: [Code, Title, Level, IsPosting]
     */
    private function getAccountData(int $level): array
    {
        $allData = [
            // ====================================================================
            // LEVEL 1: ACCOUNT GROUPS
            // ====================================================================
            ['1000000000', 'Assets', 1, false],
            ['2000000000', 'Liabilities', 1, false],
            ['3000000000', 'Equity', 1, false],
            ['4000000000', 'Income', 1, false], // GAM uses Income/Revenue
            ['5000000000', 'Expenses', 1, false],

            // ====================================================================
            // ASSETS (1)
            // ====================================================================

            // --- Cash and Cash Equivalents ---
            ['1010000000', 'Cash and Cash Equivalents', 2, false],

            ['1010100000', 'Cash on Hand', 3, false],
            ['1010101000', 'Cash-Collecting Officers', 4, true],
            ['1010102000', 'Petty Cash', 4, true],

            ['1010200000', 'Cash in Bank-Local Currency', 3, false],
            [
                '1010201000',
                'Cash in Bank-Local Currency, Bangko Sentral ng Pilipinas',
                4,
                true,
            ],
            // Parent L4 for specific banks
            [
                '1010202000',
                'Cash in Bank-Local Currency, Current Account',
                4,
                false,
            ],
            ['1010202001', 'CIB-LC, Current Account-Allied Bank', 5, true],
            [
                '1010202005',
                'CIB-LC, Current Account-Banco de Oro (BDO)',
                5,
                true,
            ],
            [
                '1010202010',
                'CIB-LC, Current Account-Bank of the Philippine Islands (BPI)',
                5,
                true,
            ],
            ['1010202014', 'CIB-LC, Current Account-Citibank', 5, true],
            [
                '1010202016',
                'CIB-LC, Current Account-Development Bank of the Philippines (DBP)',
                5,
                true,
            ],
            [
                '1010202024',
                'CIB-LC, Current Account-Land Bank of the Philippines (LBP)',
                5,
                true,
            ],
            ['1010202026', 'CIB-LC, Current Account-Metrobank', 5, true],
            [
                '1010202029',
                'CIB-LC, Current Account-Philippine National Bank (PNB)',
                5,
                true,
            ],
            [
                '1010202032',
                'CIB-LC, Current Account-Philippine Veterans Bank (PVB)',
                5,
                true,
            ],
            [
                '1010202039',
                'CIB-LC, Current Account-United Coconut Planters Bank (UCPB)',
                5,
                true,
            ],
            [
                '1010203000',
                'Cash in Bank-Local Currency, Savings Account',
                4,
                true,
            ],
            [
                '1010204000',
                'Cash in Bank-Local Currency, Time Deposits',
                4,
                true,
            ],

            ['1010300000', 'Cash in Bank-Foreign Currency', 3, false],
            [
                '1010301000',
                'Cash in Bank-Foreign Currency, Bangko Sentral ng Pilipinas',
                4,
                true,
            ],
            [
                '1010302000',
                'Cash in Bank-Foreign Currency, Current Account',
                4,
                true,
            ],
            [
                '1010303000',
                'Cash in Bank-Foreign Currency, Savings Account',
                4,
                true,
            ],
            [
                '1010304000',
                'Cash in Bank-Foreign Currency, Time Deposits',
                4,
                true,
            ],

            ['1010400000', 'Treasury/Agency Cash Accounts', 3, false],
            ['1010401000', 'Cash-Treasury/Agency Deposit, Regular', 4, true],
            [
                '1010402000',
                'Cash-Treasury/Agency Deposit, Special Account',
                4,
                true,
            ],
            ['1010403000', 'Cash-Treasury/Agency Deposit, Trust', 4, true],
            [
                '1010404000',
                'Cash-Modified Disbursement System (MDS), Regular',
                4,
                true,
            ],
            [
                '1010405000',
                'Cash-Modified Disbursement System (MDS), Special Account',
                4,
                true,
            ],
            [
                '1010406000',
                'Cash-Modified Disbursement System (MDS), Trust',
                4,
                true,
            ],
            ['1010407000', 'Cash-Tax Remittance Advice', 4, true],
            ['1010408000', 'Cash-Constructive Income Remittance', 4, true],

            ['1010500000', 'Cash Equivalents', 3, false],
            ['1010501000', 'Treasury Bills', 4, true],

            // --- Investments ---
            ['1020000000', 'Investments', 2, false],
            [
                '1020100000',
                'Financial Assets at Fair Value Through Surplus or Deficit',
                3,
                false,
            ],
            ['1020101000', 'Financial Assets Held for Trading', 4, true],
            [
                '1020102000',
                'Financial Assets Designated at Fair Value Through Surplus or Deficit',
                4,
                true,
            ],
            [
                '1020103000',
                'Derivative Financial Assets Held for Trading',
                4,
                true,
            ],
            ['1020200000', 'Financial Assets-Held to Maturity', 3, false],
            ['1020201000', 'Investments in Treasury Bills-Local', 4, true],
            ['1020202000', 'Investments in Treasury Bills-Foreign', 4, true],
            ['1020203000', 'Investments in Treasury Bonds-Local', 4, true],
            ['1020204000', 'Investments in Treasury Bonds-Foreign', 4, true],
            ['1020400000', 'Investments in GOCCs', 3, false],
            ['1020401000', 'Investments in GOCCs', 4, true],
            ['1020500000', 'Investments in Joint Venture', 3, false],
            ['1020501000', 'Investments in Joint Venture', 4, true],

            // --- Receivables ---
            ['1030000000', 'Receivables', 2, false],
            ['1030100000', 'Loans and Receivable Accounts', 3, false],
            ['1030101000', 'Accounts Receivable', 4, true],
            [
                '1030101100',
                'Allowance for Impairment-Accounts Receivable',
                4,
                true,
            ],
            ['1030102000', 'Notes Receivable', 4, true],
            ['1030103000', 'Loans Receivable-GOCCs', 4, true],
            ['1030104000', 'Loans Receivable-LGUs', 4, true],
            ['1030105000', 'Interests Receivable', 4, true],
            ['1030200000', 'Lease Receivable', 3, false],
            ['1030201000', 'Operating Lease Receivable', 4, true],
            ['1030300000', 'Inter-Agency Receivables', 3, false],
            ['1030301000', 'Due from National Government Agencies', 4, true],
            [
                '1030302000',
                'Due from Government-Owned or Controlled Corporations',
                4,
                true,
            ],
            ['1030303000', 'Due from Local Government Units', 4, true],
            ['1030400000', 'Intra-Agency Receivables', 3, false],
            ['1030401000', 'Due from Central Office', 4, true],
            ['1030402000', 'Due from Bureaus', 4, true],
            ['1030403000', 'Due from Regional Offices', 4, true],
            ['1030404000', 'Due from Operating Units', 4, true],
            ['1030405000', 'Due from Other Funds', 4, true],
            ['1030500000', 'Other Receivables', 3, false],
            ['1030501000', 'Receivables-Disallowances/Charges', 4, true],
            ['1030502000', 'Due from Officers and Employees', 4, true],
            ['1030503000', 'Due from NGOs/POs', 4, true],
            ['1030599000', 'Other Receivables', 4, true],

            // --- Inventories ---
            ['1040000000', 'Inventories', 2, false],
            ['1040100000', 'Inventory Held for Sale', 3, false],
            ['1040101000', 'Merchandise Inventory', 4, true],
            ['1040200000', 'Inventory Held for Distribution', 3, false],
            ['1040201000', 'Food Supplies for Distribution', 4, true],
            ['1040202000', 'Welfare Goods for Distribution', 4, true],
            ['1040203000', 'Drugs and Medicines for Distribution', 4, true],
            [
                '1040207000',
                'Textbooks and Instructional Materials for Distribution',
                4,
                true,
            ],
            ['1040209000', 'Property and Equipment for Distribution', 4, true],
            ['1040400000', 'Inventory Held for Consumption', 3, false],
            ['1040401000', 'Office Supplies Inventory', 4, true],
            [
                '1040402000',
                'Accountable Forms, Plates and Stickers Inventory',
                4,
                true,
            ],
            ['1040403000', 'Non-Accountable Forms Inventory', 4, true],
            ['1040405000', 'Food Supplies Inventory', 4, true],
            ['1040406000', 'Drugs and Medicines Inventory', 4, true],
            [
                '1040407000',
                'Medical, Dental and Laboratory Supplies Inventory',
                4,
                true,
            ],
            ['1040408000', 'Fuel, Oil and Lubricants Inventory', 4, true],
            [
                '1040409000',
                'Agricultural and Marine Supplies Inventory',
                4,
                true,
            ],
            [
                '1040410000',
                'Textbooks and Instructional Materials Inventory',
                4,
                true,
            ],
            ['1040413000', 'Construction Materials Inventory', 4, true],
            ['1040499000', 'Other Supplies and Materials Inventory', 4, true],
            ['1040500000', 'Semi-Expendable Machinery and Equipment', 3, false],
            ['1040502000', 'Semi-Expendable Office Equipment', 4, true],
            ['1040503000', 'Semi-Expendable ICT Equipment', 4, true],
            ['1040507000', 'Semi-Expendable Communications Equipment', 4, true],
            ['1040510000', 'Semi-Expendable Medical Equipment', 4, true],
            [
                '1040519000',
                'Semi-Expendable Other Machinery and Equipment',
                4,
                true,
            ],
            [
                '1040600000',
                'Semi-Expendable Furniture, Fixtures and Books',
                3,
                false,
            ],
            ['1040601000', 'Semi-Expendable Furniture and Fixtures', 4, true],
            ['1040602000', 'Semi-Expendable Books', 4, true],

            // --- Property, Plant and Equipment (PPE) ---
            ['1060000000', 'Property, Plant and Equipment', 2, false],
            ['1060100000', 'Land', 3, false],
            ['1060101000', 'Land', 4, true],
            ['1060200000', 'Land Improvements', 3, false],
            [
                '1060201000',
                'Land Improvements, Aquaculture Structures',
                4,
                true,
            ],
            ['1060299000', 'Other Land Improvements', 4, true],
            ['1060300000', 'Infrastructure Assets', 3, false],
            ['1060301000', 'Road Networks', 4, true],
            ['1060302000', 'Flood Control Systems', 4, true],
            ['1060303000', 'Sewer Systems', 4, true],
            ['1060304000', 'Water Supply Systems', 4, true],
            ['1060305000', 'Power Supply Systems', 4, true],
            ['1060400000', 'Buildings and Other Structures', 3, false],
            ['1060401000', 'Buildings', 4, true],
            ['1060402000', 'School Buildings', 4, true],
            ['1060403000', 'Hospitals and Health Centers', 4, true],
            ['1060406000', 'Hostels and Dormitories', 4, true],
            ['1060499000', 'Other Structures', 4, true],
            ['1060500000', 'Machinery and Equipment', 3, false],
            ['1060501000', 'Machinery', 4, true],
            ['1060502000', 'Office Equipment', 4, true],
            [
                '1060503000',
                'Information and Communications Technology Equipment',
                4,
                true,
            ],
            ['1060507000', 'Communication Equipment', 4, true],
            ['1060508000', 'Construction and Heavy Equipment', 4, true],
            ['1060509000', 'Disaster Response and Rescue Equipment', 4, true],
            ['1060510000', 'Military, Police and Security Equipment', 4, true],
            ['1060511000', 'Medical Equipment', 4, true],
            ['1060514000', 'Technical and Scientific Equipment', 4, true],
            ['1060599000', 'Other Machinery and Equipment', 4, true],
            ['1060600000', 'Transportation Equipment', 3, false],
            ['1060601000', 'Motor Vehicles', 4, true],
            ['1060699000', 'Other Transportation Equipment', 4, true],
            ['1060700000', 'Furniture, Fixtures and Books', 3, false],
            ['1060701000', 'Furniture and Fixtures', 4, true],
            ['1060702000', 'Books', 4, true],
            ['1069900000', 'Construction in Progress', 3, false],
            [
                '1069901000',
                'Construction in Progress-Land Improvements',
                4,
                true,
            ],
            [
                '1069902000',
                'Construction in Progress-Infrastructure Assets',
                4,
                true,
            ],
            [
                '1069903000',
                'Construction in Progress-Buildings and Other Structures',
                4,
                true,
            ],

            // --- Intangible Assets ---
            ['1080000000', 'Intangible Assets', 2, false],
            ['1080100000', 'Intangible Assets', 3, false],
            ['1080102000', 'Computer Software', 4, true],

            // --- Other Assets ---
            ['1990000000', 'Other Assets', 2, false],
            ['1990100000', 'Advances', 3, false],
            ['1990101000', 'Advances for Operating Expenses', 4, true],
            ['1990102000', 'Advances for Payroll', 4, true],
            ['1990103000', 'Advances to Special Disbursing Officer', 4, true],
            ['1990104000', 'Advances to Officers and Employees', 4, true],
            ['1990200000', 'Prepayments', 3, false],
            ['1990201000', 'Advances to Contractors', 4, true],
            ['1990202000', 'Prepaid Rent', 4, true],
            ['1990205000', 'Prepaid Insurance', 4, true],
            ['1990299000', 'Other Prepayments', 4, true],
            ['1990300000', 'Deposits', 3, false],
            ['1990302000', 'Guaranty Deposits', 4, true],

            // ====================================================================
            // LIABILITIES (2)
            // ====================================================================
            ['2010000000', 'Financial Liabilities', 2, false],
            ['2010100000', 'Payables', 3, false],
            ['2010101000', 'Accounts Payable', 4, true],
            ['2010102000', 'Due to Officers and Employees', 4, true],
            ['2010104000', 'Notes Payable', 4, true],
            ['2010105000', 'Interest Payable', 4, true],
            ['2010200000', 'Bills/Bonds/Loans Payable', 3, false],
            ['2010204000', 'Loans Payable-Domestic', 4, true],
            ['2010205000', 'Loans Payable-Foreign', 4, true],
            ['2010300000', 'Tax Refunds Payable', 3, false],
            ['2010301000', 'Tax Refunds Payable', 4, true],

            ['2020000000', 'Inter-Agency Payables', 2, false],
            ['2020100000', 'Inter-Agency Payables', 3, false],
            ['2020101000', 'Due to BIR', 4, true],
            ['2020102000', 'Due to GSIS', 4, true],
            ['2020103000', 'Due to Pag-IBIG', 4, true],
            ['2020104000', 'Due to PhilHealth', 4, true],
            ['2020105000', 'Due to NGAs', 4, true],
            ['2020106000', 'Due to GOCCs', 4, true],
            ['2020107000', 'Due to LGUs', 4, true],

            ['2030000000', 'Intra-Agency Payables', 2, false],
            ['2030100000', 'Intra-Agency Payables', 3, false],
            ['2030101000', 'Due to Central Office', 4, true],
            ['2030102000', 'Due to Bureaus', 4, true],
            ['2030103000', 'Due to Regional Offices', 4, true],
            ['2030104000', 'Due to Operating Units', 4, true],
            ['2030105000', 'Due to Other Funds', 4, true],

            ['2040000000', 'Trust Liabilities', 2, false],
            ['2040100000', 'Trust Liabilities', 3, false],
            ['2040101000', 'Trust Liabilities', 4, true],
            [
                '2040102000',
                'Trust Liabilities-Disaster Risk Reduction and Management Fund',
                4,
                true,
            ],
            ['2040103000', 'Bail Bonds Payable', 4, true],
            ['2040104000', 'Guaranty/Security Deposits Payable', 4, true],
            ['2040105000', 'Customers\' Deposits Payable', 4, true],

            ['2990000000', 'Other Payables', 2, false],
            ['2999900000', 'Other Payables', 3, false],
            ['2999999000', 'Other Payables', 4, true],

            // ====================================================================
            // EQUITY (3)
            // ====================================================================
            ['3010000000', 'Government Equity', 2, false],
            ['3010100000', 'Government Equity', 3, false],
            ['3010101000', 'Accumulated Surplus/(Deficit)', 4, true],
            ['3030000000', 'Intermediate Accounts', 2, false],
            ['3030100000', 'Intermediate Accounts', 3, false],
            ['3030101000', 'Revenue and Expense Summary', 4, true],

            // ====================================================================
            // REVENUE/INCOME (4)
            // ====================================================================
            ['4010000000', 'Tax Revenue', 2, false],
            ['4010100000', 'Tax Revenue-Individual and Corporation', 3, false],
            ['4010101000', 'Income Tax', 4, true],
            ['4010300000', 'Tax Revenue-Goods and Services', 3, false],
            ['4010301000', 'Import Duties', 4, true],
            ['4010302000', 'Excise Tax', 4, true],
            ['4010303000', 'Business Tax', 4, true],

            ['4020000000', 'Service and Business Income', 2, false],
            ['4020100000', 'Service Income', 3, false],
            ['4020101000', 'Permit Fees', 4, true],
            ['4020102000', 'Registration Fees', 4, true],
            [
                '4020103000',
                'Registration Plates, Tags and Stickers Fees',
                4,
                true,
            ],
            ['4020104000', 'Clearance and Certification Fees', 4, true],
            ['4020105000', 'Franchising Fees', 4, true],
            ['4020106000', 'Licensing Fees', 4, true],
            ['4020110000', 'Inspection Fees', 4, true],
            ['4020112000', 'Passport and Visa Fees', 4, true],
            ['4020113000', 'Processing Fees', 4, true],
            ['4020200000', 'Business Income', 3, false],
            ['4020201000', 'School Fees', 4, true],
            ['4020203000', 'Examination Fees', 4, true],
            ['4020204000', 'Seminar/Training Fees', 4, true],
            ['4020205000', 'Rent/Lease Income', 4, true],
            ['4020216000', 'Sales Revenue', 4, true],
            ['4020217000', 'Hospital Fees', 4, true],
            ['4020221000', 'Interest Income', 4, true],
            ['4020223000', 'Fines and Penalties-Business Income', 4, true],

            ['4030000000', 'Assistance and Subsidy', 2, false],
            ['4030100000', 'Assistance and Subsidy', 3, false],
            ['4030101000', 'Subsidy from National Government', 4, true],
            [
                '4030102000',
                'Subsidy from Other National Government Agencies',
                4,
                true,
            ],
            ['4030103000', 'Assistance from Local Government Units', 4, true],
            ['4030106000', 'Subsidy from Central Office', 4, true],

            ['4040000000', 'Shares, Grants and Donations', 2, false],
            ['4040200000', 'Grants and Donations', 3, false],
            ['4040201000', 'Income from Grants and Donations in Cash', 4, true],
            ['4040202000', 'Income from Grants and Donations in Kind', 4, true],

            ['4060000000', 'Other Non-Operating Income', 2, false],
            ['4060900000', 'Miscellaneous Income', 3, false],
            ['4060999000', 'Miscellaneous Income', 4, true],

            // ====================================================================
            // EXPENSES (5)
            // ====================================================================
            ['5010000000', 'Personnel Services', 2, false],
            ['5010100000', 'Salaries and Wages', 3, false],
            ['5010101000', 'Salaries and Wages-Regular', 4, true],
            ['5010102000', 'Salaries and Wages-Casual/Contractual', 4, true],
            ['5010200000', 'Other Compensation', 3, false],
            [
                '5010201000',
                'Personal Economic Relief Allowance (PERA)',
                4,
                true,
            ],
            ['5010202000', 'Representation Allowance (RA)', 4, true],
            ['5010203000', 'Transportation Allowance (TA)', 4, true],
            ['5010204000', 'Clothing/Uniform Allowance', 4, true],
            ['5010205000', 'Subsistence Allowance', 4, true],
            ['5010206000', 'Laundry Allowance', 4, true],
            ['5010207000', 'Quarters Allowance', 4, true],
            ['5010208000', 'Productivity Incentive Allowance', 4, true],
            ['5010210000', 'Honoraria', 4, true],
            ['5010211000', 'Hazard Pay', 4, true],
            ['5010212000', 'Longevity Pay', 4, true],
            ['5010213000', 'Overtime and Night Pay', 4, true],
            ['5010214000', 'Year End Bonus', 4, true],
            ['5010215000', 'Cash Gift', 4, true],
            ['5010299000', 'Other Bonuses and Allowances', 4, true],
            ['5010300000', 'Personnel Benefit Contributions', 3, false],
            ['5010301000', 'Retirement and Life Insurance Premiums', 4, true],
            ['5010302000', 'Pag-IBIG Contributions', 4, true],
            ['5010303000', 'PhilHealth Contributions', 4, true],
            [
                '5010304000',
                'Employees Compensation Insurance Premiums',
                4,
                true,
            ],
            ['5010400000', 'Other Personnel Benefits', 3, false],
            ['5010401000', 'Pension Benefits', 4, true],
            ['5010403000', 'Terminal Leave Benefits', 4, true],
            ['5010499000', 'Other Personnel Benefits', 4, true],

            [
                '5020000000',
                'Maintenance and Other Operating Expenses',
                2,
                false,
            ],
            ['5020100000', 'Traveling Expenses', 3, false],
            ['5020101000', 'Traveling Expenses-Local', 4, true],
            ['5020102000', 'Traveling Expenses-Foreign', 4, true],
            ['5020200000', 'Training and Scholarship Expenses', 3, false],
            ['5020201000', 'Training Expenses', 4, true],
            ['5020202000', 'Scholarship Grants/Expenses', 4, true],
            ['5020300000', 'Supplies and Materials Expenses', 3, false],
            ['5020301000', 'Office Supplies Expenses', 4, true],
            ['5020302000', 'Accountable Forms Expenses', 4, true],
            ['5020305000', 'Food Supplies Expenses', 4, true],
            ['5020306000', 'Welfare Goods Expenses', 4, true],
            ['5020307000', 'Drugs and Medicines Expenses', 4, true],
            [
                '5020308000',
                'Medical, Dental and Laboratory Supplies Expenses',
                4,
                true,
            ],
            ['5020309000', 'Fuel, Oil and Lubricants Expenses', 4, true],
            [
                '5020310000',
                'Agricultural and Marine Supplies Expenses',
                4,
                true,
            ],
            [
                '5020311000',
                'Textbooks and Instructional Materials Expenses',
                4,
                true,
            ],
            [
                '5020312000',
                'Military, Police and Traffic Supplies Expenses',
                4,
                true,
            ],
            ['5020313000', 'Chemical and Filtering Supplies Expenses', 4, true],
            [
                '5020321000',
                'Semi-Expendable Machinery and Equipment Expenses',
                4,
                true,
            ],
            [
                '5020322000',
                'Semi-Expendable Furniture, Fixtures and Books Expenses',
                4,
                true,
            ],
            ['5020399000', 'Other Supplies and Materials Expenses', 4, true],
            ['5020400000', 'Utility Expenses', 3, false],
            ['5020401000', 'Water Expenses', 4, true],
            ['5020402000', 'Electricity Expenses', 4, true],
            ['5020500000', 'Communication Expenses', 3, false],
            ['5020501000', 'Postage and Courier Expenses', 4, true],
            ['5020502000', 'Telephone Expenses', 4, true],
            ['5020503000', 'Internet Subscription Expenses', 4, true],
            [
                '5020504000',
                'Cable, Satellite, Telegraph and Radio Expenses',
                4,
                true,
            ],
            ['5020600000', 'Awards/Rewards, Prizes and Indemnities', 3, false],
            ['5020601000', 'Awards/Rewards Expenses', 4, true],
            ['5020602000', 'Prizes', 4, true],
            ['5020603000', 'Indemnities', 4, true],
            [
                '5020700000',
                'Survey, Research, Exploration and Development Expenses',
                3,
                false,
            ],
            ['5020701000', 'Survey Expenses', 4, true],
            [
                '5020702000',
                'Research, Exploration and Development Expenses',
                4,
                true,
            ],
            [
                '5021000000',
                'Confidential, Intelligence and Extraordinary Expenses',
                3,
                false,
            ],
            ['5021001000', 'Confidential Expenses', 4, true],
            ['5021002000', 'Intelligence Expenses', 4, true],
            ['5021003000', 'Extraordinary and Miscellaneous Expenses', 4, true],
            ['5021100000', 'Professional Services', 3, false],
            ['5021101000', 'Legal Services', 4, true],
            ['5021102000', 'Auditing Services', 4, true],
            ['5021103000', 'Consultancy Services', 4, true],
            ['5021199000', 'Other Professional Services', 4, true],
            ['5021200000', 'General Services', 3, false],
            ['5021201000', 'Environment/Sanitary Services', 4, true],
            ['5021202000', 'Janitorial Services', 4, true],
            ['5021203000', 'Security Services', 4, true],
            ['5021299000', 'Other General Services', 4, true],
            ['5021300000', 'Repairs and Maintenance', 3, false],
            [
                '5021302000',
                'Repairs and Maintenance-Land Improvements',
                4,
                true,
            ],
            [
                '5021303000',
                'Repairs and Maintenance-Infrastructure Assets',
                4,
                true,
            ],
            [
                '5021304000',
                'Repairs and Maintenance-Buildings and Other Structures',
                4,
                true,
            ],
            [
                '5021305000',
                'Repairs and Maintenance-Machinery and Equipment',
                4,
                true,
            ],
            [
                '5021306000',
                'Repairs and Maintenance-Transportation Equipment',
                4,
                true,
            ],
            [
                '5021307000',
                'Repairs and Maintenance-Furniture and Fixtures',
                4,
                true,
            ],
            ['5021400000', 'Financial Assistance/Subsidy', 3, false],
            ['5021401000', 'Subsidy to NGAs', 4, true],
            ['5021402000', 'Financial Assistance to NGAs', 4, true],
            [
                '5021403000',
                'Financial Assistance to Local Government Units',
                4,
                true,
            ],
            ['5021405000', 'Financial Assistance to NGOs/POs', 4, true],
            [
                '5021407000',
                'Subsidy to Regional Offices/Staff Bureaus',
                4,
                true,
            ],
            ['5021408000', 'Subsidy to Operating Units', 4, true],
            ['5021499000', 'Subsidies-Others', 4, true],
            [
                '5021500000',
                'Taxes, Insurance Premiums and Other Fees',
                3,
                false,
            ],
            ['5021501000', 'Taxes, Duties and Licenses', 4, true],
            ['5021502000', 'Fidelity Bond Premiums', 4, true],
            ['5021503000', 'Insurance Expenses', 4, true],
            ['5021600000', 'Labor and Wages', 3, false],
            ['5021601000', 'Labor and Wages', 4, true],
            [
                '5029900000',
                'Other Maintenance and Operating Expenses',
                3,
                false,
            ],
            ['5029901000', 'Advertising Expenses', 4, true],
            ['5029902000', 'Printing and Publication Expenses', 4, true],
            ['5029903000', 'Representation Expenses', 4, true],
            ['5029904000', 'Transportation and Delivery Expenses', 4, true],
            ['5029905000', 'Rent/Lease Expenses', 4, true],
            [
                '5029906000',
                'Membership Dues and Contributions to Organizations',
                4,
                true,
            ],
            ['5029907000', 'Subscription Expenses', 4, true],
            ['5029908000', 'Donations', 4, true],
            ['5029999000', 'Other Maintenance and Operating Expenses', 4, true],

            ['5030000000', 'Financial Expenses', 2, false],
            ['5030100000', 'Financial Expenses', 3, false],
            ['5030101000', 'Management Supervision/Trusteeship Fees', 4, true],
            ['5030102000', 'Interest Expenses', 4, true],
            ['5030103000', 'Guarantee Fees', 4, true],
            ['5030104000', 'Bank Charges', 4, true],
            ['5030105000', 'Commitment Fees', 4, true],
            ['5030199000', 'Other Financial Charges', 4, true],

            ['5050000000', 'Non-Cash Expenses', 2, false],
            ['5050100000', 'Depreciation', 3, false],
            ['5050102000', 'Depreciation-Land Improvements', 4, true],
            ['5050103000', 'Depreciation-Infrastructure Assets', 4, true],
            [
                '5050104000',
                'Depreciation-Buildings and Other Structures',
                4,
                true,
            ],
            ['5050105000', 'Depreciation-Machinery and Equipment', 4, true],
            ['5050106000', 'Depreciation-Transportation Equipment', 4, true],
            [
                '5050107000',
                'Depreciation-Furniture, Fixtures and Books',
                4,
                true,
            ],
            ['5050200000', 'Amortization', 3, false],
            ['5050201000', 'Amortization-Intangible Assets', 4, true],
            ['5050300000', 'Impairment Loss', 3, false],
            ['5050302000', 'Impairment Loss-Loans and Receivables', 4, true],
            ['5050306000', 'Impairment Loss-Other Receivables', 4, true],
            ['5050307000', 'Impairment Loss-Inventories', 4, true],
            [
                '5050309000',
                'Impairment Loss-Property, Plant and Equipment',
                4,
                true,
            ],
            ['5050400000', 'Losses', 3, false],
            ['5050401000', 'Loss on Foreign Exchange (FOREX)', 4, true],
            ['5050408000', 'Loss on Sale of Assets', 4, true],
        ];

        // Filter the data to return only the requested level
        return array_filter($allData, fn($item) => $item[2] === $level);
    }
}
