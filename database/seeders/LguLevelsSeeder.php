<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LguLevels;

class LguLevelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LguLevels::truncate();

        LguLevels::insert([
            ['lgu_level' => 'Province'],
            ['lgu_level' => 'City'],
            ['lgu_level' => 'Municipality'],
        ]);
    }
}
