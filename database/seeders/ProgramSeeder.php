<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Project;
use App\Models\Activity;
use Pest\Mutate\Mutators\Logical\FalseToTrue;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Activity::truncate();
        Project::truncate();
        Program::truncate();

        $programs = [
            [
                'aip_ref_code' => '1000-1-10-001-006',
                'name' => 'Manpower Services',
                'is_active' => true,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-015',
                'name' => 'Community Outreach and Health',
                'is_active' => false,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-014',
                'name' => 'Environmental Protection Initiatives',
                'is_active' => false,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-007',
                'name' => 'Operational Activities',
                'is_active' => true,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-008',
                'name' => 'Strategic Actvities',
                'is_active' => true,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-013',
                'name' => 'Disaster Risk Reduction and Management',
                'is_active' => false,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-012',
                'name' => 'Public Safety and Traffic Management',
                'is_active' => false,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-009',
                'name' => 'Operational Activities',
                'is_active' => true,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-011',
                'name' => 'Capacity Building Programs',
                'is_active' => false,
            ],
            [
                'aip_ref_code' => '1000-1-10-001-010',
                'name' => 'Operational Activities',
                'is_active' => false,
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}
