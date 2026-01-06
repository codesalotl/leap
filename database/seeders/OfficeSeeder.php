<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Office;
use Illuminate\Support\Facades\Schema;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to truncate safely, then re-enable
        Schema::disableForeignKeyConstraints();
        Office::truncate();
        Schema::enableForeignKeyConstraints();

        $offices = [
            // --- PROVINCE (Level 1) - MANDATORY (Type 1) ---
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the Governor',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the Vice-Governor',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '003',
                'name' =>
                    'Office of the Members of the Sangguniang Panlalawigan',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '004',
                'name' =>
                    'Office of the Secretary to the Sangguniang Panlalawigan',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Office of the Provincial Treasurer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the Provincial Assessor',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Office of the Provincial Accountant',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the Provincial Engineer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '009',
                'name' => 'Office of the Provincial Budget Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '010',
                'name' =>
                    'Office of the Provincial Planning and Development Coordinator',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '011',
                'name' => 'Office of the Provincial Legal Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '012',
                'name' => 'Office of the Provincial Administrator',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '013',
                'name' => 'Office of the Provincial Health Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '014',
                'name' =>
                    'Office of the Provincial Social Welfare and Development Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '015',
                'name' => 'Office of the Provincial General Services Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '016',
                'name' => 'Office of the Provincial Agriculturist',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '017',
                'name' => 'Office of the Provincial Veterinarian',
            ],

            // --- PROVINCE (Level 1) - OPTIONAL (Type 2) ---
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '001',
                'name' => 'Office of the Provincial Population Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '002',
                'name' =>
                    'Office of the Provincial Natural Resources and Environment Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'Office of the Provincial Cooperative Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '004',
                'name' => 'Office of the Provincial Architect',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '005',
                'name' => 'Office of the Provincial Information Officer',
            ],

            // --- CITY (Level 2) - MANDATORY (Type 1) ---
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the City Mayor',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the City Vice-Mayor',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '003',
                'name' => 'Office of the Sangguniang Panlungsod Members',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '004',
                'name' =>
                    'Office of the Secretary to the Sangguniang Panlungsod',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Office of the City Treasurer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the City Assessor',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Office of the City Accountant',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the City Budget Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '009',
                'name' =>
                    'Office of the City Planning and Development Coordinator',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '010',
                'name' => 'Office of the City Engineer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '011',
                'name' => 'Office of the City Health Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '012',
                'name' => 'Office of the City Civil Registrar',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '013',
                'name' => 'Office of the City Administrator',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '014',
                'name' => 'Office of the City Legal Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '015',
                'name' => 'Office of the City Veterinarian',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '016',
                'name' =>
                    'Office of the City Social Welfare and Development Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '017',
                'name' => 'Office of the City General Services Officer',
            ],

            // --- CITY (Level 2) - OPTIONAL (Type 2) ---
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '001',
                'name' => 'Office of the City Architect',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '002',
                'name' => 'Office of the City Information Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'Office of the City Agriculturist',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '004',
                'name' => 'Office of the City Population Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '005',
                'name' =>
                    'Office of the City Environment and Natural Resources Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '006',
                'name' => 'Office of the City Cooperatives Officer',
            ],

            // --- MUNICIPALITY (Level 3) - MANDATORY (Type 1) ---
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the Municipal Mayor',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the Municipal Vice-Mayor',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '003',
                'name' => 'Office of the Sangguniang Bayan Members',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '004',
                'name' => 'Office of the Secretary to the Sangguniang Bayan',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Office of the Municipal Treasurer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the Municipal Assessor',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Office of the Municipal Accountant',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the Municipal Budget Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '009',
                'name' =>
                    'Office of the Municipal Planning and Development Coordinator',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '010',
                'name' => 'Office of the Municipal Engineer/Building Official',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '011',
                'name' => 'Office of the Municipal Health Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '012',
                'name' => 'Office of the Municipal Civil Registrar',
            ],

            // --- MUNICIPALITY (Level 3) - OPTIONAL (Type 2) ---
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '001',
                'name' => 'Office of the Municipal Administrator',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '002',
                'name' => 'Office of the Municipal Legal Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'Office of the Municipal Agriculturist',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '004',
                'name' =>
                    'Office of the Municipal Environment and Natural Resources Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '005',
                'name' =>
                    'Office of the Municipal Social Welfare and Development Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '006',
                'name' => 'Office of the Municipal Architect',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '007',
                'name' => 'Office of the Municipal Information Officer',
            ],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
