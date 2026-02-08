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
            $this->command->warn(
                'Missing required data for PPMP seeder. Please run AIP Entry and Price List seeders first.',
            );
            return;
        }

        // Create 3 sample PPMP items
        foreach ($priceListItems as $index => $priceListItem) {
            // We still need a target number to distribute, even if we don't save it
            $targetTotalQuantity = ($index + 1) * 10;
            $unitPrice = $priceListItem->price;

            // Distribute quantity across months (evenly)
            $monthlyQty = floor($targetTotalQuantity / 12);
            $remainingQty = $targetTotalQuantity % 12;

            $ppmpData = [
                'aip_entry_id' => $aipEntry->id,
                'ppmp_price_list_id' => $priceListItem->id,
                // 'quantity' removed from here
            ];

            // Add monthly distribution
            $months = [
                'jan',
                'feb',
                'mar',
                'apr',
                'may',
                'jun',
                'jul',
                'aug',
                'sep',
                'oct',
                'nov',
                'dec',
            ];

            foreach ($months as $monthIndex => $month) {
                $qtyForMonth =
                    $monthlyQty + ($monthIndex < $remainingQty ? 1 : 0);
                $ppmpData["{$month}_qty"] = $qtyForMonth;
                $ppmpData["{$month}_amount"] = $qtyForMonth * $unitPrice;
            }

            Ppmp::create($ppmpData);
        }

        $this->command->info(
            'PPMP items seeded successfully without annual quantity column!',
        );
    }
}
