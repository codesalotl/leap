<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AipEntry;
use App\Models\PpmpPriceList;
use App\Models\Ppmp;

class PpmpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get required data
        $aipEntry = AipEntry::first();
        $priceListItems = PpmpPriceList::limit(3)->get();

        if (!$aipEntry || $priceListItems->isEmpty()) {
            $this->command->warn('Missing required data for PPMP seeder. Please run AIP Entry and Price List seeders first.');
            return;
        }

        // Create 3 sample PPMP items
        foreach ($priceListItems as $index => $priceListItem) {
            $quantity = ($index + 1) * 10; // 10, 20, 30
            $unitPrice = $priceListItem->price;
            $totalAmount = $quantity * $unitPrice;

            // Distribute quantity across months (evenly)
            $monthlyQty = floor($quantity / 12);
            $remainingQty = $quantity % 12;
            $monthlyAmount = $monthlyQty * $unitPrice;

            $ppmpData = [
                'aip_entry_id' => $aipEntry->id,
                'ppmp_price_list_id' => $priceListItem->id,
                'quantity' => $quantity,
            ];

            // Add monthly distribution
            $months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            $totalMonthlyQty = 0;
            foreach ($months as $monthIndex => $month) {
                $qtyForMonth = $monthlyQty + ($monthIndex < $remainingQty ? 1 : 0);
                $ppmpData["{$month}_qty"] = $qtyForMonth;
                $ppmpData["{$month}_amount"] = $qtyForMonth * $unitPrice;
                $totalMonthlyQty += $qtyForMonth;
            }
            
            // Validate that monthly quantities sum to annual quantity
            if ($totalMonthlyQty != $quantity) {
                $this->command->error("Monthly quantity mismatch: Expected {$quantity}, Got {$totalMonthlyQty}");
                continue;
            }

            Ppmp::create($ppmpData);
        }

        $this->command->info('PPMP items seeded successfully!');
    }
}
