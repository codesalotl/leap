<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PpmpPriceList;

class PpmpPriceListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            // Office Supplies
            ['item_code' => 'OFF-001', 'item_description' => 'Ballpen (Blue)', 'unit' => 'pcs', 'unit_price' => 15.00, 'expense_class' => 'MOOE', 'account_code' => '501001', 'procurement_type' => 'Goods', 'standard_specifications' => 'Standard blue ballpoint pen'],
            ['item_code' => 'OFF-002', 'item_description' => 'A4 Bond Paper (Ream)', 'unit' => 'ream', 'unit_price' => 250.00, 'expense_class' => 'MOOE', 'account_code' => '501001', 'procurement_type' => 'Goods', 'standard_specifications' => '80gsm, A4 size, 500 sheets per ream'],
            ['item_code' => 'OFF-003', 'item_description' => 'Folder (Plastic)', 'unit' => 'pcs', 'unit_price' => 25.00, 'expense_class' => 'MOOE', 'account_code' => '501001', 'procurement_type' => 'Goods', 'standard_specifications' => 'Clear plastic folder with fastener'],
            
            // Travel Expenses
            ['item_code' => 'TRV-001', 'item_description' => 'Transportation Allowance', 'unit' => 'day', 'unit_price' => 500.00, 'expense_class' => 'MOOE', 'account_code' => '502001', 'procurement_type' => 'Services', 'standard_specifications' => 'Daily transportation allowance for official business'],
            ['item_code' => 'TRV-002', 'item_description' => 'Meal Allowance', 'unit' => 'day', 'unit_price' => 800.00, 'expense_class' => 'MOOE', 'account_code' => '502001', 'procurement_type' => 'Services', 'standard_specifications' => 'Daily meal allowance for official travel'],
            
            // Maintenance
            ['item_code' => 'MNT-001', 'item_description' => 'Computer Cleaning Service', 'unit' => 'unit', 'unit_price' => 500.00, 'expense_class' => 'MOOE', 'account_code' => '503001', 'procurement_type' => 'Services', 'standard_specifications' => 'Professional cleaning service for computer units'],
            ['item_code' => 'MNT-002', 'item_description' => 'Printer Ink (Black)', 'unit' => 'cartridge', 'unit_price' => 1200.00, 'expense_class' => 'MOOE', 'account_code' => '503001', 'procurement_type' => 'Goods', 'standard_specifications' => 'Black ink cartridge for office printers'],
            
            // Training
            ['item_code' => 'TRN-001', 'item_description' => 'Training Materials', 'unit' => 'set', 'unit_price' => 350.00, 'expense_class' => 'MOOE', 'account_code' => '504001', 'procurement_type' => 'Goods', 'standard_specifications' => 'Complete training materials kit'],
            ['item_code' => 'TRN-002', 'item_description' => 'Venue Rental', 'unit' => 'day', 'unit_price' => 3000.00, 'expense_class' => 'MOOE', 'account_code' => '504001', 'procurement_type' => 'Services', 'standard_specifications' => 'Training venue rental per day'],
        ];

        foreach ($items as $item) {
            PpmpPriceList::create($item);
        }
    }
}
