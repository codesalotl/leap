<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Aip;
use App\Models\Ppa;
use App\Models\AipEntry;
use Carbon\Carbon;

class AipEntrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Get the AIP (The Binder) we want to populate (e.g., AIP 2025)
        // Ensure you run AipSeeder first!
        $aip = Aip::first();

        // 2. Get the Master List of PPAs
        // Ensure you run PpaSeeder first!
        $ppas = Ppa::all();

        // Safety check
        if (!$aip || $ppas->isEmpty()) {
            $this->command->error(
                'Error: No AIP or PPAs found. Please seed those tables first.',
            );
            return;
        }

        $year = $aip->year; // Assuming your 'aips' table has a 'year' column

        foreach ($ppas as $index => $ppa) {
            // Logic: Generate different types of costs based on the PPA Sector/Type
            // This makes the data look realistic for your Table 4 demo.

            $ps = 0;
            $mooe = 0;
            $co = 0;

            // Scenario A: Administrative Project (Mostly Salaries & MOOE)
            if ($index % 3 == 0) {
                $ps = rand(500000, 2000000);
                $mooe = rand(100000, 300000);
            }
            // Scenario B: Infrastructure Project (Mostly Capital Outlay)
            elseif ($index % 3 == 1) {
                $co = rand(1000000, 5000000);
            }
            // Scenario C: Training/Event (MOOE only)
            else {
                $mooe = rand(50000, 150000);
            }

            AipEntry::create([
                'aip_id' => $aip->id,
                'ppa_id' => $ppa->id, // Links to your Master List

                // Set dates within the budget year
                'start_date' => Carbon::createFromDate($year, 1, 1), // Jan 1
                'end_date' => Carbon::createFromDate($year, 12, 31), // Dec 31

                'expected_output' =>
                    'Successfully implemented ' .
                    $ppa->description .
                    ' with 100% utilization rate.',

                // Financial Targets
                'ps_amount' => $ps,
                'mooe_amount' => $mooe,
                'fe_amount' => 0, // Financial expenses are rare for standard offices
                'co_amount' => $co,

                // CCET (Climate Change) - Set some to 0, some to values
                'ccet_adaptation' => rand(1, 10) > 8 ? rand(10000, 50000) : 0,
                'ccet_mitigation' => 0,
            ]);
        }
    }
}
