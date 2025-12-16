<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Project;
use App\Models\Activity;

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

        Program::insert([
            [
                'aip-ref-code' => 'AIP-001',
                'name' => 'IT Infrastructure Development',
            ],
            [
                'aip-ref-code' => 'AIP-002',
                'name' => 'Community Outreach and Health',
            ],
            [
                'aip-ref-code' => 'AIP-003',
                'name' => 'Environmental Protection Initiatives',
            ],
            [
                'aip-ref-code' => 'AIP-004',
                'name' => 'Education and Literacy Program',
            ],
            ['aip-ref-code' => 'AIP-005', 'name' => 'Local Economic Stimulus'],
            [
                'aip-ref-code' => 'AIP-006',
                'name' => 'Disaster Risk Reduction and Management',
            ],
            [
                'aip-ref-code' => 'AIP-007',
                'name' => 'Public Safety and Traffic Management',
            ],
            [
                'aip-ref-code' => 'AIP-008',
                'name' => 'Agricultural Productivity Enhancement',
            ],
            [
                'aip-ref-code' => 'AIP-009',
                'name' => 'Water and Sanitation Project',
            ],
            [
                'aip-ref-code' => 'AIP-010',
                'name' => 'Cultural Heritage Preservation',
            ],
        ]);
    }
}
