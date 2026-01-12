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
        // Schema::disableForeignKeyConstraints();
        // Office::truncate();
        // Schema::enableForeignKeyConstraints();

        $offices = [
            // PROVINCE = 1 / MANDATORY = 1
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the Governor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the Vice-Governor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '003',
                'name' =>
                    'Office of the Members of the Sangguniang Panlalawigan',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '004',
                'name' =>
                    'Office of the Secretary to the Sangguniang Panlalawigan',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Office of the Provincial Treasurer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the Provincial Assessor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Office of the Provincial Accountant',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the Provincial Engineer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '009',
                'name' => 'Office of the Provincial Budget Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '010',
                'name' =>
                    'Office of the Provincial Planning and Development Coordinator',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '011',
                'name' => 'Office of the Provincial Legal Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '012',
                'name' => 'Office of the Provincial Administrator',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '013',
                'name' => 'Office of the Provincial Health Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '014',
                'name' =>
                    'Office of the Provincial Social Welfare and Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '015',
                'name' => 'Office of the Provincial General Services Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '016',
                'name' => 'Office of the Provincial Agriculturist',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '017',
                'name' => 'Office of the Provincial Veterinarian',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '018',
                'name' =>
                    'Office of the Provincial Disaster Risk Reduction and Management Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '019',
                'name' => 'Office of the Provincial Internal Audit Service',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '020',
                'name' =>
                    'Office of the Provincial Persons with Disability Affairs Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '021',
                'name' =>
                    'Office of the Provincial Public Employment Service Manager',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '022',
                'name' => 'Office of the Provincial Youth Development Officer',
            ],

            // PROVINCE = 1 / OPTIONAL = 2
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '001',
                'name' => 'Office of the Provincial Population Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '002',
                'name' =>
                    'Office of the Provincial Environment and Natural Resources Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'Office of the Provincial Architect',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '004',
                'name' => 'Office of the Provincial Information Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '005',
                'name' =>
                    'Office of the Provincial Agricultural and Biosystems Engineer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '006',
                'name' =>
                    'Office of the Provincial Cooperatives Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '007',
                'name' => 'Office of the Provincial Tourism Officer',
            ],

            // CITY = 2 / MANDATORY = 1
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the City Mayor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the City Vice-Mayor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '003',
                'name' => 'Office of the Sangguniang Panlungsod Members',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '004',
                'name' =>
                    'Office of the Secretary to the Sangguniang Panlungsod',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Office of the City Treasurer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the City Assessor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Office of the City Accountant',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the City Budget Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '009',
                'name' =>
                    'Office of the City Planning and Development Coordinator',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '010',
                'name' => 'Office of the City Engineer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '011',
                'name' => 'Office of the City Health Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '012',
                'name' => 'Office of the City Civil Registrar',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '013',
                'name' => 'Office of the City Administrator',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '014',
                'name' => 'Office of the City Legal Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '015',
                'name' => 'Office of the City Veterinarian',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '016',
                'name' =>
                    'Office of the City Social Welfare and Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '017',
                'name' => 'Office of the City General Services Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '018',
                'name' =>
                    'Office of the City Disaster Risk Reduction and Management Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '019',
                'name' => 'Office of the City Internal Audit Service',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '020',
                'name' =>
                    'Office of the City Persons with Disability Affairs Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '021',
                'name' =>
                    'Office of the City Public Employment Service Manager',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '022',
                'name' => 'Office of the City Youth Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'code' => '023',
                'name' => 'Office of the City Senior Citizen Affairs Head',
            ],

            // --- CITY (Level 2) - OPTIONAL (Type 2) ---
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '001',
                'name' => 'Office of the City Architect',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '002',
                'name' => 'Office of the City Information Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'Office of the City Agriculturist',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '004',
                'name' => 'Office of the City Population Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '005',
                'name' =>
                    'Office of the City Environment and Natural Resources Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '006',
                'name' =>
                    'Office of the City Agricultural and Biosystems Engineer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '007',
                'name' => 'Office of the City Cooperatives Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'code' => '008',
                'name' => 'Office of the City Tourism Officer',
            ],

            // MUNICIPALITY = 3 / MANDATORY = 1
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the Municipal Mayor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the Municipal Vice-Mayor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '003',
                'name' => 'Office of the Sangguniang Bayan Members',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '004',
                'name' => 'Office of the Secretary to the Sangguniang Bayan',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Office of the Municipal Treasurer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the Municipal Assessor',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Office of the Municipal Accountant',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the Municipal Budget Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '009',
                'name' =>
                    'Office of the Municipal Planning and Development Coordinator',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '010',
                'name' => 'Office of the Municipal Engineer/Building Official',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '011',
                'name' => 'Office of the Municipal Health Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '012',
                'name' => 'Office of the Municipal Civil Registrar',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '013',
                'name' =>
                    'Office of the Municipal Social Welfare and Development',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '014',
                'name' =>
                    'Office of the Municipal Disaster Risk Reduction and Management Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '015',
                'name' => 'Office of the Municipal Internal Audit Service',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '016',
                'name' =>
                    'Office of the Municipal Persons with Disability Affairs Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '017',
                'name' =>
                    'Office of the Municipal Public Employment Service Manager',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '018',
                'name' => 'Office of the Municipal Youth Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '019',
                'name' => 'Office of the Municipal Senior Citizen Affairs Head',
            ],

            // MUNICIPALITY = 3 / OPTIONAL = 2
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '001',
                'name' => 'Office of the Municipal Administrator',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '002',
                'name' => 'Office of the Municipal Legal Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'Office of the Municipal Agriculturist',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '004',
                'name' =>
                    'Office of the Municipal Environment and Natural Resources',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '005',
                'name' => 'Office of the Municipal Architect',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '006',
                'name' => 'Office of the Municipal Information Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '007',
                'name' => 'Office of the Municipal Population Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '008',
                'name' =>
                    'Office of the Municipal Agricultural and Biosystems Engineer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '009',
                'name' =>
                    'Office of the Municipal Cooperatives Development Officer',
            ],
            [
                'sector_id' => null,
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'code' => '010',
                'name' => 'Office of the Municipal Tourism Officer',
            ],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
