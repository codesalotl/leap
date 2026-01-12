<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OfficeType;

class OfficeTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OfficeType::truncate();

        $officeTypes = [
            ['code' => '01', 'type' => 'Mandatory'],
            ['code' => '02', 'type' => 'Optional'],
            ['code' => '03', 'type' => 'Others'],
        ];

        foreach ($officeTypes as $officeType) {
            // OfficeType::create($officeType);
            OfficeType::updateOrCreate($officeType);
        }
    }
}
