<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Aip;

class AipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $years = [
            ['year' => 2023, 'status' => 'Closed'],
            ['year' => 2024, 'status' => 'Closed'],
            ['year' => 2025, 'status' => 'Open'],
        ];

        foreach ($years as $year) {
            Aip::create($year);
        }
    }
}
