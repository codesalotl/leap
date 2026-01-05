<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChartOfAccount;

class ChartOfAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            // --- INCOME (Group 4) ---
            [
                'code' => '4-01-02-040',
                'title' => 'Real Property Tax - Basic',
                'group' => 4,
                'class' => 'INCOME',
                'balance' => 'Credit',
            ],
            [
                'code' => '4-01-01-050',
                'title' => 'Community Tax',
                'group' => 4,
                'class' => 'INCOME',
                'balance' => 'Credit',
            ],
            [
                'code' => '4-01-06-010',
                'title' => 'Share from Internal Revenue Collections (IRA)',
                'group' => 4,
                'class' => 'INCOME',
                'balance' => 'Credit',
            ],
            [
                'code' => '4-02-01-010',
                'title' => 'Permit Fees',
                'group' => 4,
                'class' => 'INCOME',
                'balance' => 'Credit',
            ],

            // --- EXPENSES: PERSONAL SERVICES (Group 5-01) ---
            [
                'code' => '5-01-01-010',
                'title' => 'Salaries and Wages - Regular',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-01-020',
                'title' => 'Salaries and Wages - Casual/Contractual',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-02-010',
                'title' => 'Personal Economic Relief Allowance (PERA)',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-02-020',
                'title' => 'Representation Allowance (RA)',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-02-030',
                'title' => 'Transportation Allowance (TA)',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-02-040',
                'title' => 'Clothing/Uniform Allowance',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-02-140',
                'title' => 'Year End Bonus',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-02-150',
                'title' => 'Cash Gift',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-03-010',
                'title' => 'Retirement and Life Insurance Premiums',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-03-030',
                'title' => 'PhilHealth Contributions',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-01-03-020',
                'title' => 'Pag-IBIG Contributions',
                'group' => 5,
                'class' => 'PS',
                'balance' => 'Debit',
            ],

            // --- EXPENSES: MOOE (Group 5-02) ---
            [
                'code' => '5-02-01-010',
                'title' => 'Traveling Expenses - Local',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-02-010',
                'title' => 'Training Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-03-010',
                'title' => 'Office Supplies Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-03-090',
                'title' => 'Fuel, Oil and Lubricants Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-04-010',
                'title' => 'Water Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-04-020',
                'title' => 'Electricity Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-05-020',
                'title' => 'Telephone Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-05-030',
                'title' => 'Internet Subscription Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-10-010',
                'title' => 'Confidential Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-13-040',
                'title' =>
                    'Repairs and Maintenance - Buildings and Other Structures',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],
            [
                'code' => '5-02-99-030',
                'title' => 'Representation Expenses',
                'group' => 5,
                'class' => 'MOOE',
                'balance' => 'Debit',
            ],

            // --- CAPITAL OUTLAY (Group 1-07 / PPE) ---
            // Note: In Budgeting, departments request to buy these.
            // In Accounting, they become Assets.
            [
                'code' => '1-07-04-010',
                'title' => 'Buildings',
                'group' => 1,
                'class' => 'CO',
                'balance' => 'Debit',
            ],
            [
                'code' => '1-07-05-020',
                'title' => 'Office Equipment',
                'group' => 1,
                'class' => 'CO',
                'balance' => 'Debit',
            ],
            [
                'code' => '1-07-05-030',
                'title' => 'Information and Communication Technology Equipment',
                'group' => 1,
                'class' => 'CO',
                'balance' => 'Debit',
            ],
            [
                'code' => '1-07-06-010',
                'title' => 'Motor Vehicles',
                'group' => 1,
                'class' => 'CO',
                'balance' => 'Debit',
            ],
            [
                'code' => '1-07-07-010',
                'title' => 'Furniture and Fixtures',
                'group' => 1,
                'class' => 'CO',
                'balance' => 'Debit',
            ],
            [
                'code' => '1-07-03-010',
                'title' => 'Road Networks',
                'group' => 1,
                'class' => 'CO',
                'balance' => 'Debit',
            ],
        ];

        foreach ($accounts as $acc) {
            // Logic to extract hierarchy
            $parts = explode('-', $acc['code']); // Splits "5-02-03-010"

            ChartOfAccount::create([
                'code' => $acc['code'],
                'title' => $acc['title'],
                'account_group' => $acc['group'],
                'major_account_group' => $parts[1] ?? '00',
                'sub_major_account_group' => $parts[2] ?? '00',
                'general_ledger_account' => $parts[3] ?? '000',
                'allotment_class' => $acc['class'],
                'normal_balance' => $acc['balance'],
            ]);
        }
    }
}
