<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PpmpPriceList;
use App\Models\ChartOfAccount;

class PpmpPriceListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get postable chart of accounts for each expense class
        $psAccounts = ChartOfAccount::where('expense_class', 'PS')->where('is_postable', true)->get();
        $mooeAccounts = ChartOfAccount::where('expense_class', 'MOOE')->where('is_postable', true)->get();
        $feAccounts = ChartOfAccount::where('expense_class', 'FE')->where('is_postable', true)->get();
        $coAccounts = ChartOfAccount::where('expense_class', 'CO')->where('is_postable', true)->get();

        $this->command->info('Found accounts:');
        $this->command->info('PS: ' . $psAccounts->count());
        $this->command->info('MOOE: ' . $mooeAccounts->count());
        $this->command->info('FE: ' . $feAccounts->count());
        $this->command->info('CO: ' . $coAccounts->count());

        $items = [];

        // PERSONNEL SERVICES (PS) Items
        if ($psAccounts->isNotEmpty()) {
            $salaryAccount = $psAccounts->where('account_number', '5-01-01-010')->first() ?? $psAccounts->first();
            $allowanceAccount = $psAccounts->where('account_number', '5-01-02-010')->first() ?? $psAccounts->first();
            $transportAccount = $psAccounts->where('account_number', '5-01-02-030')->first() ?? $psAccounts->first();

            $items = array_merge($items, [
                // Salary related
                [
                    'item_number' => 1001,
                    'description' => 'Monthly Salary - Regular Employee',
                    'unit_of_measurement' => 'month',
                    'price' => 25000.0,
                    'chart_of_account_id' => $salaryAccount->id,
                ],
                [
                    'item_number' => 1002,
                    'description' => 'Monthly Salary - Contractual Employee',
                    'unit_of_measurement' => 'month',
                    'price' => 18000.0,
                    'chart_of_account_id' => $salaryAccount->id,
                ],
                // Allowances
                [
                    'item_number' => 1003,
                    'description' => 'Personal Economic Relief Allowance (PERA)',
                    'unit_of_measurement' => 'month',
                    'price' => 2000.0,
                    'chart_of_account_id' => $allowanceAccount->id,
                ],
                [
                    'item_number' => 1004,
                    'description' => 'Transportation Allowance',
                    'unit_of_measurement' => 'month',
                    'price' => 1500.0,
                    'chart_of_account_id' => $transportAccount->id,
                ],
            ]);
        }

        // MAINTENANCE AND OTHER OPERATING EXPENSES (MOOE) Items
        if ($mooeAccounts->isNotEmpty()) {
            $officeSuppliesAccount = $mooeAccounts->where('account_number', '5-02-03-010')->first() ?? $mooeAccounts->first();
            $travelAccount = $mooeAccounts->where('account_number', '5-02-01-010')->first() ?? $mooeAccounts->first();
            $trainingAccount = $mooeAccounts->where('account_number', '5-02-02-010')->first() ?? $mooeAccounts->first();
            $utilityAccount = $mooeAccounts->where('account_number', '5-02-04-020')->first() ?? $mooeAccounts->first();
            $internetAccount = $mooeAccounts->where('account_number', '5-02-05-030')->first() ?? $mooeAccounts->first();

            $items = array_merge($items, [
                // Office Supplies
                [
                    'item_number' => 2001,
                    'description' => 'Ballpen (Blue)',
                    'unit_of_measurement' => 'pcs',
                    'price' => 15.0,
                    'chart_of_account_id' => $officeSuppliesAccount->id,
                ],
                [
                    'item_number' => 2002,
                    'description' => 'A4 Bond Paper (Ream)',
                    'unit_of_measurement' => 'ream',
                    'price' => 250.0,
                    'chart_of_account_id' => $officeSuppliesAccount->id,
                ],
                [
                    'item_number' => 2003,
                    'description' => 'Folder (Plastic)',
                    'unit_of_measurement' => 'pcs',
                    'price' => 25.0,
                    'chart_of_account_id' => $officeSuppliesAccount->id,
                ],
                // Travel Expenses
                [
                    'item_number' => 2004,
                    'description' => 'Transportation Allowance - Local Travel',
                    'unit_of_measurement' => 'day',
                    'price' => 500.0,
                    'chart_of_account_id' => $travelAccount->id,
                ],
                [
                    'item_number' => 2005,
                    'description' => 'Meal Allowance - Official Business',
                    'unit_of_measurement' => 'day',
                    'price' => 800.0,
                    'chart_of_account_id' => $travelAccount->id,
                ],
                // Training
                [
                    'item_number' => 2006,
                    'description' => 'Training Materials',
                    'unit_of_measurement' => 'set',
                    'price' => 350.0,
                    'chart_of_account_id' => $trainingAccount->id,
                ],
                [
                    'item_number' => 2007,
                    'description' => 'Venue Rental - Training',
                    'unit_of_measurement' => 'day',
                    'price' => 3000.0,
                    'chart_of_account_id' => $trainingAccount->id,
                ],
                // Utilities
                [
                    'item_number' => 2008,
                    'description' => 'Electricity Consumption',
                    'unit_of_measurement' => 'kwh',
                    'price' => 12.0,
                    'chart_of_account_id' => $utilityAccount->id,
                ],
                [
                    'item_number' => 2009,
                    'description' => 'Internet Subscription',
                    'unit_of_measurement' => 'month',
                    'price' => 2999.0,
                    'chart_of_account_id' => $internetAccount->id,
                ],
                // Maintenance
                [
                    'item_number' => 2010,
                    'description' => 'Computer Cleaning Service',
                    'unit_of_measurement' => 'unit',
                    'price' => 500.0,
                    'chart_of_account_id' => $officeSuppliesAccount->id,
                ],
                [
                    'item_number' => 2011,
                    'description' => 'Printer Ink (Black)',
                    'unit_of_measurement' => 'cartridge',
                    'price' => 1200.0,
                    'chart_of_account_id' => $officeSuppliesAccount->id,
                ],
            ]);
        }

        // FINANCIAL EXPENSES (FE) Items
        if ($feAccounts->isNotEmpty()) {
            $interestAccount = $feAccounts->where('account_number', '5-03-01-020')->first() ?? $feAccounts->first();
            $bankChargeAccount = $feAccounts->where('account_number', '5-03-01-040')->first() ?? $feAccounts->first();

            $items = array_merge($items, [
                [
                    'item_number' => 3001,
                    'description' => 'Bank Service Charges',
                    'unit_of_measurement' => 'transaction',
                    'price' => 50.0,
                    'chart_of_account_id' => $bankChargeAccount->id,
                ],
                [
                    'item_number' => 3002,
                    'description' => 'Interest Payment - Loan',
                    'unit_of_measurement' => 'month',
                    'price' => 5000.0,
                    'chart_of_account_id' => $interestAccount->id,
                ],
                [
                    'item_number' => 3003,
                    'description' => 'Guarantee Fee',
                    'unit_of_measurement' => 'transaction',
                    'price' => 1000.0,
                    'chart_of_account_id' => $feAccounts->first()->id,
                ],
            ]);
        }

        // CAPITAL OUTLAY (CO) Items
        if ($coAccounts->isNotEmpty()) {
            $equipmentAccount = $coAccounts->where('account_number', '5-06-03-010')->first() ?? $coAccounts->first();
            $furnitureAccount = $coAccounts->where('account_number', '5-06-05-010')->first() ?? $coAccounts->first();
            $softwareAccount = $coAccounts->where('account_number', '5-06-07-010')->first() ?? $coAccounts->first();

            $items = array_merge($items, [
                // Equipment
                [
                    'item_number' => 4001,
                    'description' => 'Laptop Computer (Core i5)',
                    'unit_of_measurement' => 'unit',
                    'price' => 35000.0,
                    'chart_of_account_id' => $equipmentAccount->id,
                ],
                [
                    'item_number' => 4002,
                    'description' => 'Desktop Computer',
                    'unit_of_measurement' => 'unit',
                    'price' => 25000.0,
                    'chart_of_account_id' => $equipmentAccount->id,
                ],
                [
                    'item_number' => 4003,
                    'description' => 'Printer (Laser)',
                    'unit_of_measurement' => 'unit',
                    'price' => 15000.0,
                    'chart_of_account_id' => $equipmentAccount->id,
                ],
                // Furniture
                [
                    'item_number' => 4004,
                    'description' => 'Office Chair (Ergonomic)',
                    'unit_of_measurement' => 'unit',
                    'price' => 4500.0,
                    'chart_of_account_id' => $furnitureAccount->id,
                ],
                [
                    'item_number' => 4005,
                    'description' => 'Office Desk (Executive)',
                    'unit_of_measurement' => 'unit',
                    'price' => 8000.0,
                    'chart_of_account_id' => $furnitureAccount->id,
                ],
                // Software
                [
                    'item_number' => 4006,
                    'description' => 'Microsoft Office License',
                    'unit_of_measurement' => 'year',
                    'price' => 3500.0,
                    'chart_of_account_id' => $softwareAccount->id,
                ],
                [
                    'item_number' => 4007,
                    'description' => 'Antivirus Software License',
                    'unit_of_measurement' => 'year',
                    'price' => 1500.0,
                    'chart_of_account_id' => $softwareAccount->id,
                ],
            ]);
        }

        foreach ($items as $item) {
            PpmpPriceList::create($item);
        }

        $this->command->info('Created ' . count($items) . ' PPMP price list items');
    }
}
