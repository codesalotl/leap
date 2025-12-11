<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\OfficeTypes;

class OfficeTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OfficeTypes::insert([
            ['office_type' => 'Mandatory'],
            ['office_type' => 'Optional'],
            ['office_type' => 'Others'],
        ]);
    }
}
