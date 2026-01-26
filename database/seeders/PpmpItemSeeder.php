<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PpmpItem;
use App\Models\PpmpHeader;
use App\Models\PpmpPriceList;

class PpmpItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get sample data
        $ppmpHeader = PpmpHeader::first();
        $priceListItems = PpmpPriceList::limit(5)->get();

        if (!$ppmpHeader || $priceListItems->isEmpty()) {
            $this->command->warn('Missing required data for PPMP Item seeder. Please run PPMP Header and Price List seeders first.');
            return;
        }

        // Create sample PPMP Items
        foreach ($priceListItems as $index => $priceListItem) {
            $quantity = ($index + 1) * 10; // 10, 20, 30, 40, 50
            $unitPrice = $priceListItem->unit_price;
            $totalAmount = $quantity * $unitPrice;

            // Distribute quantity across months (simple example)
            $monthlyQty = floor($quantity / 12);
            $remainingQty = $quantity % 12;
            $monthlyAmount = $monthlyQty * $unitPrice;

            $itemData = [
                'ppmp_header_id' => $ppmpHeader->id,
                'ppmp_price_list_id' => $priceListItem->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_amount' => $totalAmount,
                'specifications' => $priceListItem->standard_specifications,
            ];

            // Add monthly distribution
            $months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            foreach ($months as $monthIndex => $month) {
                $itemData["{$month}_qty"] = $monthlyQty + ($monthIndex < $remainingQty ? 1 : 0);
                $itemData["{$month}_amount"] = $itemData["{$month}_qty"] * $unitPrice;
            }

            PpmpItem::create($itemData);
        }

        $this->command->info('PPMP Items seeded successfully!');
    }
}
