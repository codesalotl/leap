<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FiscalYear;

class FiscalYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fiscalYears = [
            ['year' => 2023, 'status' => 'Closed'],
            ['year' => 2024, 'status' => 'Closed'],
            ['year' => 2025, 'status' => 'Open'],
        ];

        foreach ($fiscalYears as $fiscalYear) {
            // FiscalYear::create($fiscalYear);
            FiscalYear::updateOrCreate(
                ['year' => $fiscalYear['year']],
                ['status' => $fiscalYear['status']],
            );
        }
    }
}
