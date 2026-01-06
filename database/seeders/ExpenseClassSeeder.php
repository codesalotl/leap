<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExpenseClass;

class ExpenseClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['code' => 'PS', 'name' => 'Personal Services'],
            [
                'code' => 'MOOE',
                'name' => 'Maintenance & Other Operating Expenses',
            ],
            ['code' => 'FE', 'name' => 'Financial Expenses'],
            ['code' => 'CO', 'name' => 'Capital Outlay'],
        ];

        foreach ($classes as $class) {
            ExpenseClass::create($class);
        }
    }
}
