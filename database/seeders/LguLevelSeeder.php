<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LguLevel;

class LguLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LguLevel::truncate();

        $levels = [
            ['code' => '1', 'level' => 'Province'],
            ['code' => '2', 'level' => 'City'],
            ['code' => '3', 'level' => 'Municipality'],
        ];

        foreach ($levels as $level) {
            LguLevel::create($level);
        }
    }
}
