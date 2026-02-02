<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ChartOfAccount;

class ChartOfAccountSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing records
        ChartOfAccount::query()->delete();

        $expenseAccounts = $this->getExpenseAccounts();

        // Create a mapping of account numbers to IDs for parent relationships
        $idMap = [];

        foreach ($expenseAccounts as $index => $account) {
            // Create the account without parent_id first
            $createdAccount = ChartOfAccount::create([
                'account_number' => $account['account_number'],
                'account_title' => $account['account_title'],
                'account_type' => 'EXPENSE',
                'expense_class' => $account['expense_class'],
                'account_series' => $account['account_series'],
                'parent_id' => null, // Will be set later
                'level' => $account['level'],
                'is_postable' => $account['is_postable'],
                'is_active' => true,
                'normal_balance' => 'DEBIT',
                'description' => $account['account_title'],
            ]);

            // Store the ID mapping
            $idMap[$account['account_number']] = $createdAccount->id;
        }

        // Now update parent relationships using the ID map
        foreach ($expenseAccounts as $account) {
            if (isset($account['parent_number']) && $account['parent_number']) {
                $parentId = $idMap[$account['parent_number']] ?? null;
                if ($parentId) {
                    ChartOfAccount::where(
                        'account_number',
                        $account['account_number'],
                    )->update(['parent_id' => $parentId]);
                }
            }
        }
    }

    private function getExpenseAccounts(): array
    {
        return [
            // PERSONNEL SERVICES (PS) - 501 Series
            [
                'account_number' => '5-01-00-000',
                'account_title' => 'Personnel Services',
                'expense_class' => null, // Header account
                'account_series' => '5-01',
                'level' => 1,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-01-01-000',
                'account_title' => 'Salaries and Wages',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-01-01-010',
                'account_title' => 'Salaries and Wages-Regular',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-01-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-01-020',
                'account_title' => 'Personal Economic Relief Allowance (PERA)',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-01-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-02-000',
                'account_title' => 'Representation Allowance (RA)',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-01-02-010',
                'account_title' => 'Transportation Allowance (TA)',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-02-020',
                'account_title' => 'Clothing/Uniform Allowance',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-02-030',
                'account_title' => 'Subsistence Allowance',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-02-040',
                'account_title' => 'Laundry Allowance',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-02-050',
                'account_title' => 'Quarters Allowance',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-03-000',
                'account_title' => 'Productivity Incentive Allowance',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-01-03-010',
                'account_title' => 'Overseas Allowance',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-03-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-01-04-000',
                'account_title' => 'Honoraria',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-01-04-010',
                'account_title' => 'Hazard Pay',
                'expense_class' => 'PS',
                'account_series' => '5-01',
                'parent_number' => '5-01-04-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-00-000',
                'account_title' => 'Longevity Pay',
                'expense_class' => null, // Header account
                'account_series' => '5-02',
                'level' => 1,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-01-000',
                'account_title' => 'Overtime and Night Pay',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-01-010',
                'account_title' => 'Cash Gift',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-01-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-01-020',
                'account_title' => 'Other Bonuses and Allowance',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-01-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-02-000',
                'account_title' => 'Retirement & Life Insurance Contributions',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-02-010',
                'account_title' => 'Pag-IBIG Contributions',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-02-020',
                'account_title' => 'PhilHealth Contributions',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-02-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-03-000',
                'account_title' => 'Employees Compensation Insurance Premiums',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-03-010',
                'account_title' => 'Provident/Welfare Fund Contributions',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-03-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-03-020',
                'account_title' => 'Pension Benefits',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-03-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-03-030',
                'account_title' => 'Retirement Gratuity',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-03-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-03-090',
                'account_title' => 'Terminal Leave Benefits',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-03-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-04-000',
                'account_title' => 'Other Personnel Benefits ',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],

            // 
            [
                'account_number' => '5-02-04-010',
                'account_title' => 'Water Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-04-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-04-020',
                'account_title' => 'Electricity Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-04-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-05-000',
                'account_title' => 'Communication Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-05-010',
                'account_title' => 'Postage and Courier Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-05-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-05-020',
                'account_title' => 'Telephone Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-05-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-05-030',
                'account_title' => 'Internet Subscription Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-05-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-11-000',
                'account_title' => 'Professional Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-11-010',
                'account_title' => 'Legal Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-11-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-11-020',
                'account_title' => 'Auditing Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-11-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-11-030',
                'account_title' => 'Consultancy Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-11-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-12-000',
                'account_title' => 'General Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-12-010',
                'account_title' => 'Environment/Sanitary Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-12-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-12-020',
                'account_title' => 'Janitorial Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-12-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-12-030',
                'account_title' => 'Security Services',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-12-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-99-000',
                'account_title' => 'Other Maintenance and Operating Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-00-000',
                'level' => 2,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-02-99-030',
                'account_title' => 'Representation Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-99-000',
                'level' => 3,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-02-99-050',
                'account_title' => 'Rent/Lease Expenses',
                'expense_class' => 'MOOE',
                'account_series' => '5-02',
                'parent_number' => '5-02-99-000',
                'level' => 3,
                'is_postable' => true,
            ],

            // FINANCIAL EXPENSES (FE) - 503 Series
            [
                'account_number' => '5-03-00-000',
                'account_title' => 'Financial Expenses',
                'expense_class' => null, // Header account
                'account_series' => '5-03',
                'level' => 1,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-03-01-010',
                'account_title' => 'Management Supervision/Trusteeship Fees',
                'expense_class' => 'FE',
                'account_series' => '5-03',
                'parent_number' => '5-03-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-03-01-020',
                'account_title' => 'Interest Expenses',
                'expense_class' => 'FE',
                'account_series' => '5-03',
                'parent_number' => '5-03-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-03-01-030',
                'account_title' => 'Guarantee Fees',
                'expense_class' => 'FE',
                'account_series' => '5-03',
                'parent_number' => '5-03-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-03-01-040',
                'account_title' => 'Bank Charges',
                'expense_class' => 'FE',
                'account_series' => '5-03',
                'parent_number' => '5-03-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-03-01-050',
                'account_title' => 'Commitment Fees',
                'expense_class' => 'FE',
                'account_series' => '5-03',
                'parent_number' => '5-03-00-000',
                'level' => 2,
                'is_postable' => true,
            ],

            // CAPITAL OUTLAY (CO) - 506 Series (Note: May be treated as assets)
            [
                'account_number' => '5-06-00-000',
                'account_title' => 'Capital Outlay',
                'expense_class' => null, // Header account
                'account_series' => '5-06',
                'level' => 1,
                'is_postable' => false,
            ],
            [
                'account_number' => '5-06-01-010',
                'account_title' => 'Land',
                'expense_class' => 'CO',
                'account_series' => '5-06',
                'parent_number' => '5-06-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-06-02-010',
                'account_title' => 'Buildings and Other Structures',
                'expense_class' => 'CO',
                'account_series' => '5-06',
                'parent_number' => '5-06-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-06-03-010',
                'account_title' => 'Machinery and Equipment',
                'expense_class' => 'CO',
                'account_series' => '5-06',
                'parent_number' => '5-06-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-06-04-010',
                'account_title' => 'Transportation Equipment',
                'expense_class' => 'CO',
                'account_series' => '5-06',
                'parent_number' => '5-06-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-06-05-010',
                'account_title' => 'Furniture and Fixtures',
                'expense_class' => 'CO',
                'account_series' => '5-06',
                'parent_number' => '5-06-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
            [
                'account_number' => '5-06-07-010',
                'account_title' => 'Computer Software',
                'expense_class' => 'CO',
                'account_series' => '5-06',
                'parent_number' => '5-06-00-000',
                'level' => 2,
                'is_postable' => true,
            ],
        ];
    }
}
