<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Account;
use App\Models\ExpenseClass;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Fetch IDs for mapping using Eloquent
        // We use where('code', ...)->first()?->id to avoid errors if the class is missing
        $ps = ExpenseClass::where('code', 'PS')->first()?->id;
        $mooe = ExpenseClass::where('code', 'MOOE')->first()?->id;
        $fe = ExpenseClass::where('code', 'FE')->first()?->id;
        $co = ExpenseClass::where('code', 'CO')->first()?->id;

        $accounts = [
            // INCOME
            [
                'code' => '4-01-01-050',
                'name' => 'Community Tax',
                'normal_balance' => 'CREDIT',
                'account_type' => 'INCOME',
                'expense_class_id' => null,
            ],
            [
                'code' => '4-01-02-040',
                'name' => 'Real Property Tax - Basic',
                'normal_balance' => 'CREDIT',
                'account_type' => 'INCOME',
                'expense_class_id' => null,
            ],
            [
                'code' => '4-01-03-030',
                'name' => 'Business Tax',
                'normal_balance' => 'CREDIT',
                'account_type' => 'INCOME',
                'expense_class_id' => null,
            ],
            [
                'code' => '4-01-06-010',
                'name' => 'Share from Internal Revenue Collections (IRA)',
                'normal_balance' => 'CREDIT',
                'account_type' => 'INCOME',
                'expense_class_id' => null,
            ],

            // PERSONAL SERVICES
            [
                'code' => '5-01-01-010',
                'name' => 'Salaries and Wages - Regular',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $ps,
            ],
            [
                'code' => '5-01-01-020',
                'name' => 'Salaries and Wages - Casual/Contractual',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $ps,
            ],
            [
                'code' => '5-01-02-010',
                'name' => 'Personnel Economic Relief Allowance (PERA)',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $ps,
            ],
            [
                'code' => '5-01-02-140',
                'name' => 'Year End Bonus',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $ps,
            ],

            // MOOE
            [
                'code' => '5-02-01-010',
                'name' => 'Traveling Expenses - Local',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $mooe,
            ],
            [
                'code' => '5-02-03-010',
                'name' => 'Office Supplies Expenses',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $mooe,
            ],
            [
                'code' => '5-02-04-020',
                'name' => 'Electricity Expenses',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $mooe,
            ],

            // FINANCIAL EXPENSES
            [
                'code' => '5-03-01-040',
                'name' => 'Bank Charges',
                'normal_balance' => 'DEBIT',
                'account_type' => 'EXPENSE',
                'expense_class_id' => $fe,
            ],

            // CAPITAL OUTLAY (Assets)
            [
                'code' => '1-07-04-010',
                'name' => 'Buildings',
                'normal_balance' => 'DEBIT',
                'account_type' => 'ASSET',
                'expense_class_id' => $co,
            ],
            [
                'code' => '1-07-05-030',
                'name' => 'Information and Communication Technology Equipment',
                'normal_balance' => 'DEBIT',
                'account_type' => 'ASSET',
                'expense_class_id' => $co,
            ],
        ];

        foreach ($accounts as $account) {
            Account::updateOrCreate(
                ['code' => $account['code']], // Unique key
                $account, // Data to sync
            );
        }
    }
}
