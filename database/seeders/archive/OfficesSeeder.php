<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Offices;

class OfficesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Offices::truncate();

        Offices::insert([
            // LGU Level 1: Province (Mandatory Offices - Type 1)
            [
                'code' => '01',
                'office' => 'Office of the Governor',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '02',
                'office' => 'Office of the Vice-Governor',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '03',
                'office' =>
                    'Office of the Members of the Sangguniang Panlalawigan',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '04',
                'office' =>
                    'Office of the Secretary to the Sangguniang Panlalawigan',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '05',
                'office' => 'Office of the Provincial Treasurer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '06',
                'office' => 'Office of the Provincial Assessor',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '07',
                'office' => 'Office of the Provincial Accountant',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '08',
                'office' => 'Office of the Provincial Engineer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '09',
                'office' => 'Office of the Provincial Budget Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '10',
                'office' =>
                    'Office of the Provincial Planning and Development Coordinator',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '11',
                'office' => 'Office of the Provincial Legal Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '12',
                'office' => 'Office of the Provincial Administrator',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '13',
                'office' => 'Office of the Provincial Health Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '14',
                'office' =>
                    'Office of the Provincial Social Welfare and Development Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '15',
                'office' => 'Office of the Provincial General Services Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '16',
                'office' => 'Office of the Provincial Agriculturist',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            [
                'code' => '17',
                'office' => 'Office of the Provincial Veterinarian',
                'lgu_level_id' => 1,
                'office_type_id' => 1,
            ],
            // LGU Level 1: Province (Optional Offices - Type 2)
            [
                'code' => '01',
                'office' => 'Office of the Provincial Population Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 2,
            ],
            [
                'code' => '02',
                'office' =>
                    'Office of the Provincial Natural Resources and Environment Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 2,
            ],
            [
                'code' => '03',
                'office' => 'Office of the Provincial Cooperative Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 2,
            ],
            [
                'code' => '04',
                'office' => 'Office of the Provincial Architect',
                'lgu_level_id' => 1,
                'office_type_id' => 2,
            ],
            [
                'code' => '05',
                'office' => 'Office of the Provincial Information Officer',
                'lgu_level_id' => 1,
                'office_type_id' => 2,
            ],
            // LGU Level 2: Cities (Mandatory Offices - Type 1)
            [
                'code' => '01',
                'office' => 'Office of the City Mayor',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '02',
                'office' => 'Office of the City Vice-Mayor',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '03',
                'office' => 'Office of the Sangguniang Panlungsod Members',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '04',
                'office' =>
                    'Office of the Secretary to the Sangguniang Panlungsod',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '05',
                'office' => 'Office of the City Treasurer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '06',
                'office' => 'Office of the City Assessor',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '07',
                'office' => 'Office of the City Accountant',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '08',
                'office' => 'Office of the City Budget Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '09',
                'office' =>
                    'Office of the City Planning and Development Coordinator',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '10',
                'office' => 'Office of the City Engineer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '11',
                'office' => 'Office of the City Health Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '12',
                'office' => 'Office of the City Civil Registrar',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '13',
                'office' => 'Office of the City Administrator',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '14',
                'office' => 'Office of the City Legal Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '15',
                'office' => 'Office of the City Veterinarian',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '16',
                'office' =>
                    'Office of the City Social Welfare and Development Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            [
                'code' => '17',
                'office' => 'Office of the City General Services Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 1,
            ],
            // LGU Level 2: Cities (Optional Offices - Type 2)
            [
                'code' => '01',
                'office' => 'Office of the City Architect',
                'lgu_level_id' => 2,
                'office_type_id' => 2,
            ],
            [
                'code' => '02',
                'office' => 'Office of the City Information Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 2,
            ],
            [
                'code' => '03',
                'office' => 'Office of the City Agriculturist',
                'lgu_level_id' => 2,
                'office_type_id' => 2,
            ],
            [
                'code' => '04',
                'office' => 'Office of the City Population Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 2,
            ],
            [
                'code' => '05',
                'office' =>
                    'Office of the City Environment and Natural Resources Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 2,
            ],
            [
                'code' => '06',
                'office' => 'Office of the City Cooperatives Officer',
                'lgu_level_id' => 2,
                'office_type_id' => 2,
            ],
            // LGU Level 3: Municipalities (Mandatory Offices - Type 1)
            [
                'code' => '01',
                'office' => 'Office of the Municipal Mayor',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '02',
                'office' => 'Office of the Municipal Vice-Mayor',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '03',
                'office' => 'Office of the Sangguniang Bayan Members',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '04',
                'office' => 'Office of the Secretary to the Sangguniang Bayan',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '05',
                'office' => 'Office of the Municipal Treasurer',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '06',
                'office' => 'Office of the Municipal Assessor',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '07',
                'office' => 'Office of the Municipal Accountant',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '08',
                'office' => 'Office of the Municipal Budget Officer',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '09',
                'office' =>
                    'Office of the Municipal Planning and Development Coordinator',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '10',
                'office' =>
                    'Office of the Municipal Engineer/Building Official',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '11',
                'office' => 'Office of the Municipal Health Officer',
                'lgu_level_id' => 3,
                'office_type_id' => 1,
            ],
            [
                'code' => '12',
                'lgu_level_id' => 3,
                'office' => 'Office of the Municipal Civil Registrar',
                'office_type_id' => 1,
            ],
            // LGU Level 3: Municipalities (Optional Offices - Type 2)
            [
                'code' => '01',
                'office' => 'Office of the Municipal Administrator',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
            [
                'code' => '02',
                'office' => 'Office of the Municipal Legal Officer',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
            [
                'code' => '03',
                'office' => 'Office of the Municipal Agriculturist',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
            [
                'code' => '04',
                'office' =>
                    'Office of the Municipal Environment and Natural Resources Officer',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
            [
                'code' => '05',
                'office' =>
                    'Office of the Municipal Social Welfare and Development Officer',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
            [
                'code' => '06',
                'office' => 'Office of the Municipal Architect',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
            [
                'code' => '07',
                'office' => 'Office of the Municipal Information Officer',
                'lgu_level_id' => 3,
                'office_type_id' => 2,
            ],
        ]);
    }
}
