<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sector;

class SectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sector::insert([
            ['code' => '1000', 'sector' => 'General Public Services'],
            ['code' => '3000', 'sector' => 'Social Services'],
            ['code' => '8000', 'sector' => 'Economic Services'],
            ['code' => '9000', 'sector' => 'Other Services'],
        ]);
    }
}
