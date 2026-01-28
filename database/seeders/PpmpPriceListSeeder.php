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
        $chartOfAccount = ChartOfAccount::first();

        $this->command->info($chartOfAccount);

        $items = [
            // Office Supplies
            [
                'item_number' => 1,
                'description' => 'Ballpen (Blue)',
                'unit_of_measurement' => 'pcs',
                'price' => 15.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],
            [
                'item_number' => 2,
                'description' => 'A4 Bond Paper (Ream)',
                'unit_of_measurement' => 'ream',
                'price' => 250.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],
            [
                'item_number' => 3,
                'description' => 'Folder (Plastic)',
                'unit_of_measurement' => 'pcs',
                'price' => 25.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],

            // Travel Expenses
            [
                'item_number' => 4,
                'description' => 'Transportation Allowance',
                'unit_of_measurement' => 'day',
                'price' => 500.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],
            [
                'item_number' => 5,
                'description' => 'Meal Allowance',
                'unit_of_measurement' => 'day',
                'price' => 800.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],

            // Maintenance
            [
                'item_number' => 6,
                'description' => 'Computer Cleaning Service',
                'unit_of_measurement' => 'unit',
                'price' => 500.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],
            [
                'item_number' => 7,
                'description' => 'Printer Ink (Black)',
                'unit_of_measurement' => 'cartridge',
                'price' => 1200.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],

            // Training
            [
                'item_number' => 8,
                'description' => 'Training Materials',
                'unit_of_measurement' => 'set',
                'price' => 350.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],
            [
                'item_number' => 9,
                'description' => 'Venue Rental',
                'unit_of_measurement' => 'day',
                'price' => 3000.0,
                'chart_of_account_id' => $chartOfAccount->id,
            ],
        ];

        foreach ($items as $item) {
            PpmpPriceList::create($item);
        }
    }
}
