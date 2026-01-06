<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChartOfAccount;
use App\Models\AccountGroup;
use App\Models\AllotmentClass;

class ChartOfAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Pre-fetch IDs using Eloquent models
        $allotmentClasses = AllotmentClass::pluck('id', 'code');
        $accountGroups = AccountGroup::pluck('id', 'uacs_digit');

        // 2. The Dataset (COA Circular 2015-009)
        // Format: [RawCode, Title]
        $accounts = [
            // --- INCOME (Class 4) ---
            ['4 01 01 020', 'Professional Tax'],
            ['4 01 01 050', 'Community Tax'],
            ['4 01 02 040', 'Real Property Tax - Basic'],
            ['4 01 02 050', 'Special Education Tax'],
            ['4 01 03 030', 'Business Tax'],
            ['4 01 06 010', 'Share from Internal Revenue Collections (IRA)'],
            ['4 02 01 010', 'Permit Fees'],
            ['4 02 01 020', 'Registration Fees'],
            ['4 02 02 050', 'Rent Income'],
            ['4 02 02 140', 'Receipts from Market Operation'],
            ['4 02 02 190', 'Garbage Fees'],

            // --- EXPENSES: PS (Class 5-01) ---
            ['5 01 01 010', 'Salaries and Wages - Regular'],
            ['5 01 01 020', 'Salaries and Wages - Casual/Contractual'],
            ['5 01 02 010', 'Personal Economic Relief Allowance (PERA)'],
            ['5 01 02 020', 'Representation Allowance (RA)'],
            ['5 01 02 030', 'Transportation Allowance (TA)'],
            ['5 01 02 040', 'Clothing/Uniform Allowance'],
            ['5 01 02 050', 'Subsistence Allowance'],
            ['5 01 02 060', 'Laundry Allowance'],
            ['5 01 02 080', 'Productivity Incentive Allowance'],
            ['5 01 02 100', 'Honoraria'],
            ['5 01 02 110', 'Hazard Pay'],
            ['5 01 02 130', 'Overtime and Night Pay'],
            ['5 01 02 140', 'Year End Bonus'],
            ['5 01 02 150', 'Cash Gift'],
            ['5 01 03 010', 'Retirement and Life Insurance Premiums'],
            ['5 01 03 020', 'Pag-IBIG Contributions'],
            ['5 01 03 030', 'PhilHealth Contributions'],
            ['5 01 03 040', 'Employees Compensation Insurance Premiums'],
            ['5 01 04 030', 'Terminal Leave Benefits'],

            // --- EXPENSES: MOOE (Class 5-02) ---
            ['5 02 01 010', 'Traveling Expenses - Local'],
            ['5 02 01 020', 'Traveling Expenses - Foreign'],
            ['5 02 02 010', 'Training Expenses'],
            ['5 02 03 010', 'Office Supplies Expenses'],
            ['5 02 03 020', 'Accountable Forms Expenses'],
            ['5 02 03 070', 'Drugs and Medicines Expenses'],
            ['5 02 03 090', 'Fuel, Oil and Lubricants Expenses'],
            ['5 02 03 990', 'Other Supplies and Materials Expenses'],
            ['5 02 04 010', 'Water Expenses'],
            ['5 02 04 020', 'Electricity Expenses'],
            ['5 02 05 020', 'Telephone Expenses'],
            ['5 02 05 030', 'Internet Subscription Expenses'],
            ['5 02 10 010', 'Confidential Expenses'],
            ['5 02 11 030', 'Consultancy Services'],
            ['5 02 12 020', 'Janitorial Services'],
            ['5 02 12 030', 'Security Services'],
            [
                '5 02 13 040',
                'Repairs and Maintenance - Buildings and Other Structures',
            ],
            [
                '5 02 13 060',
                'Repairs and Maintenance - Transportation Equipment',
            ],
            ['5 02 99 010', 'Advertising Expenses'],
            ['5 02 99 030', 'Representation Expenses'],
            ['5 02 99 050', 'Rent Expenses'],
            ['5 02 99 080', 'Donations'],

            // --- EXPENSES: Financial (Class 5-03) ---
            ['5 03 01 020', 'Interest Expenses'],
            ['5 03 01 040', 'Bank Charges'],

            // --- ASSETS as CAPITAL OUTLAY (Class 1-07) ---
            ['1 07 01 010', 'Land'],
            ['1 07 03 010', 'Road Networks'],
            ['1 07 04 010', 'Buildings'],
            ['1 07 05 020', 'Office Equipment'],
            [
                '1 07 05 030',
                'Information and Communication Technology Equipment',
            ],
            ['1 07 06 010', 'Motor Vehicles'],
            ['1 07 07 010', 'Furniture and Fixtures'],
            [
                '1 07 10 030',
                'Construction in Progress - Buildings and Other Structures',
            ],
        ];

        foreach ($accounts as $acc) {
            [$rawCode, $title] = $acc;

            // Transform format: "5 01 01 010" -> "5-01-01-010"
            $uacsWithDashes = str_replace(' ', '-', $rawCode);

            // Clean version for logic checks: "5-01-01-010" -> "50101010"
            $cleanUacs = str_replace('-', '', $uacsWithDashes);

            $groupDigit = substr($cleanUacs, 0, 1);
            $groupId = $accountGroups[$groupDigit] ?? null;

            // Determine Allotment Class
            $classId = $this->getAllotmentId(
                $cleanUacs,
                $groupDigit,
                $allotmentClasses,
            );

            if ($groupId) {
                ChartOfAccount::updateOrCreate(
                    ['uacs_code' => $uacsWithDashes], // Unique constraint
                    [
                        'account_title' => $title,
                        'account_group_id' => $groupId,
                        'allotment_class_id' => $classId,
                        'is_posting' => true,
                        'is_active' => true,
                    ],
                );
            }
        }
    }

    /**
     * Logic to map UACS code to Allotment Class ID
     */
    private function getAllotmentId(
        string $cleanUacs,
        string $groupDigit,
        $classes,
    ): ?int {
        if ($groupDigit === '4') {
            return $classes['INC'] ?? null;
        }

        if (str_starts_with($cleanUacs, '501')) {
            return $classes['PS'] ?? null;
        }

        if (str_starts_with($cleanUacs, '502')) {
            return $classes['MOOE'] ?? null;
        }

        if (str_starts_with($cleanUacs, '503')) {
            return $classes['FE'] ?? null;
        }

        if (in_array(substr($cleanUacs, 0, 3), ['106', '107', '108', '109'])) {
            return $classes['CO'] ?? null;
        }

        return $classes['N/A'] ?? null;
    }
}
