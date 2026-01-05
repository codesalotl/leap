<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Office;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Office::truncate();

        $offices = [
            // --- PROVINCE (Level 1) - MANDATORY (Type 1) ---
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 1,
                'sector_id' => 1,
                'title' => 'Office of the Governor',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 2,
                'sector_id' => 1,
                'title' => 'Office of the Vice-Governor',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 3,
                'sector_id' => 1,
                'title' =>
                    'Office of the Members of the Sangguniang Panlalawigan',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 4,
                'sector_id' => 1,
                'title' =>
                    'Office of the Secretary to the Sangguniang Panlalawigan',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 5,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Treasurer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 6,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Assessor',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 7,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Accountant',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 8,
                'sector_id' => 3,
                'title' => 'Office of the Provincial Engineer',
            ], // Engineering -> Economic (8000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 9,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Budget Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 10,
                'sector_id' => 1,
                'title' =>
                    'Office of the Provincial Planning and Development Coordinator',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 11,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Legal Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 12,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Administrator',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 13,
                'sector_id' => 2,
                'title' => 'Office of the Provincial Health Officer',
            ], // Health -> Social (3000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 14,
                'sector_id' => 2,
                'title' =>
                    'Office of the Provincial Social Welfare and Development Officer',
            ], // Social Welfare -> Social (3000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 15,
                'sector_id' => 1,
                'title' => 'Office of the Provincial General Services Officer',
            ],
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 16,
                'sector_id' => 3,
                'title' => 'Office of the Provincial Agriculturist',
            ], // Agriculture -> Economic (8000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'office_number' => 17,
                'sector_id' => 3,
                'title' => 'Office of the Provincial Veterinarian',
            ], // Veterinary -> Economic (8000)

            // --- PROVINCE (Level 1) - OPTIONAL (Type 2) ---
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'office_number' => 1,
                'sector_id' => 2,
                'title' => 'Office of the Provincial Population Officer',
            ], // Population -> Social (3000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'office_number' => 2,
                'sector_id' => 3,
                'title' =>
                    'Office of the Provincial Natural Resources and Environment Officer',
            ], // Environment -> Economic (8000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'office_number' => 3,
                'sector_id' => 3,
                'title' => 'Office of the Provincial Cooperative Officer',
            ], // Coop -> Economic (8000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'office_number' => 4,
                'sector_id' => 3,
                'title' => 'Office of the Provincial Architect',
            ], // Architect -> Economic (8000)
            [
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'office_number' => 5,
                'sector_id' => 1,
                'title' => 'Office of the Provincial Information Officer',
            ],

            // --- CITY (Level 2) - MANDATORY (Type 1) ---
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 1,
                'sector_id' => 1,
                'title' => 'Office of the City Mayor',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 2,
                'sector_id' => 1,
                'title' => 'Office of the City Vice-Mayor',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 3,
                'sector_id' => 1,
                'title' => 'Office of the Sangguniang Panlungsod Members',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 4,
                'sector_id' => 1,
                'title' =>
                    'Office of the Secretary to the Sangguniang Panlungsod',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 5,
                'sector_id' => 1,
                'title' => 'Office of the City Treasurer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 6,
                'sector_id' => 1,
                'title' => 'Office of the City Assessor',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 7,
                'sector_id' => 1,
                'title' => 'Office of the City Accountant',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 8,
                'sector_id' => 1,
                'title' => 'Office of the City Budget Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 9,
                'sector_id' => 1,
                'title' =>
                    'Office of the City Planning and Development Coordinator',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 10,
                'sector_id' => 3,
                'title' => 'Office of the City Engineer',
            ], // Economic
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 11,
                'sector_id' => 2,
                'title' => 'Office of the City Health Officer',
            ], // Social
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 12,
                'sector_id' => 1,
                'title' => 'Office of the City Civil Registrar',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 13,
                'sector_id' => 1,
                'title' => 'Office of the City Administrator',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 14,
                'sector_id' => 1,
                'title' => 'Office of the City Legal Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 15,
                'sector_id' => 3,
                'title' => 'Office of the City Veterinarian',
            ], // Economic
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 16,
                'sector_id' => 2,
                'title' =>
                    'Office of the City Social Welfare and Development Officer',
            ], // Social
            [
                'lgu_level_id' => 2,
                'office_type_id' => 1,
                'office_number' => 17,
                'sector_id' => 1,
                'title' => 'Office of the City General Services Officer',
            ],

            // --- CITY (Level 2) - OPTIONAL (Type 2) ---
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'office_number' => 1,
                'sector_id' => 3,
                'title' => 'Office of the City Architect',
            ], // Economic
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'office_number' => 2,
                'sector_id' => 1,
                'title' => 'Office of the City Information Officer',
            ],
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'office_number' => 3,
                'sector_id' => 3,
                'title' => 'Office of the City Agriculturist',
            ], // Economic
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'office_number' => 4,
                'sector_id' => 2,
                'title' => 'Office of the City Population Officer',
            ], // Social
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'office_number' => 5,
                'sector_id' => 3,
                'title' =>
                    'Office of the City Environment and Natural Resources Officer',
            ], // Economic
            [
                'lgu_level_id' => 2,
                'office_type_id' => 2,
                'office_number' => 6,
                'sector_id' => 3,
                'title' => 'Office of the City Cooperatives Officer',
            ], // Economic

            // --- MUNICIPALITY (Level 3) - MANDATORY (Type 1) ---
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 1,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Mayor',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 2,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Vice-Mayor',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 3,
                'sector_id' => 1,
                'title' => 'Office of the Sangguniang Bayan Members',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 4,
                'sector_id' => 1,
                'title' => 'Office of the Secretary to the Sangguniang Bayan',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 5,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Treasurer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 6,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Assessor',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 7,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Accountant',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 8,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Budget Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 9,
                'sector_id' => 1,
                'title' =>
                    'Office of the Municipal Planning and Development Coordinator',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 10,
                'sector_id' => 3,
                'title' => 'Office of the Municipal Engineer/Building Official',
            ], // Economic
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 11,
                'sector_id' => 2,
                'title' => 'Office of the Municipal Health Officer',
            ], // Social
            [
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'office_number' => 12,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Civil Registrar',
            ],

            // --- MUNICIPALITY (Level 3) - OPTIONAL (Type 2) ---
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 1,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Administrator',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 2,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Legal Officer',
            ],
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 3,
                'sector_id' => 3,
                'title' => 'Office of the Municipal Agriculturist',
            ], // Economic
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 4,
                'sector_id' => 3,
                'title' =>
                    'Office of the Municipal Environment and Natural Resources Officer',
            ], // Economic
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 5,
                'sector_id' => 2,
                'title' =>
                    'Office of the Municipal Social Welfare and Development Officer',
            ], // Social
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 6,
                'sector_id' => 3,
                'title' => 'Office of the Municipal Architect',
            ], // Economic
            [
                'lgu_level_id' => 3,
                'office_type_id' => 2,
                'office_number' => 7,
                'sector_id' => 1,
                'title' => 'Office of the Municipal Information Officer',
            ],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
