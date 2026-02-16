<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ppa;
use App\Models\Office;

class PpaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get office with ID 11
        $office = Office::find(11);

        if (!$office) {
            $this->command->error(
                'No Office found. Please seed offices first.',
            );
            return;
        }

        // Define the PPA structure
        $ppaStructure = [
            // Manpower Services - Program
            [
                'title' => 'Manpower Services',
                'type' => 'Program',
                'children' => []
            ],
            
            // Operational Activities - Program
            [
                'title' => 'Operational Activities',
                'type' => 'Program',
                'children' => [
                    ['title' => 'Development, Deployment, and Maintenance of Information Systems', 'type' => 'Project'],
                    ['title' => 'Data Management and Repository', 'type' => 'Project'],
                    ['title' => 'PGLU Infrastructure and Connectivity Management', 'type' => 'Project'],
                    ['title' => 'ICT Memberships, Trainings and Conferences', 'type' => 'Project'],
                    ['title' => 'La Union Peace and Order Systems (LUPOS)', 'type' => 'Project'],
                    ['title' => 'Information Systems Strategic Plan (ISSP)', 'type' => 'Project']
                ]
            ],
            
            // Strategic Activities - Program
            [
                'title' => 'Strategic Activities',
                'type' => 'Program',
                'children' => [
                    ['title' => 'LU Ordinance No. 423-2023 SP Resolution 194-2022', 'type' => 'Project'],
                    ['title' => 'La Union ICT Council (LUICTC) LU Ordinance No. 443-2024', 'type' => 'Project']
                ]
            ],
            
            // Capacity Building Programs - Program
            [
                'title' => 'Capacity Building Programs',
                'type' => 'Program',
                'children' => [
                    ['title' => 'Capacity Development Program for ICTU Personnel and Attendance to ICT Commits, Conferences, and Awarding Ceremony', 'type' => 'Project'],
                    ['title' => 'Conduct of Benchmarking and Best ICT Sharing', 'type' => 'Project']
                ]
            ],
            
            // Administrative Support Services - Program
            [
                'title' => 'Administrative Support Services',
                'type' => 'Program',
                'children' => [
                    ['title' => 'Office Administration', 'type' => 'Project'],
                    ['title' => 'Human Resource Management Services', 'type' => 'Project'],
                    ['title' => 'Records Management', 'type' => 'Project'],
                    ['title' => 'Management of All Financial Documents', 'type' => 'Project'],
                    ['title' => 'General Administrative Services', 'type' => 'Project']
                ]
            ]
        ];

        // Create the PPA structure
        $programCounter = 1;
        foreach ($ppaStructure as $programData) {
            // Create Program
            $program = Ppa::create([
                'office_id' => $office->id,
                'parent_id' => null,
                'title' => $programData['title'],
                'type' => $programData['type'],
                'code_suffix' => str_pad($programCounter, 3, '0', STR_PAD_LEFT),
                'is_active' => true,
            ]);

            // Create Projects for this Program
            $projectCounter = 1;
            foreach ($programData['children'] as $projectData) {
                $project = Ppa::create([
                    'office_id' => $office->id,
                    'parent_id' => $program->id,
                    'title' => $projectData['title'],
                    'type' => $projectData['type'],
                    'code_suffix' => str_pad($projectCounter, 3, '0', STR_PAD_LEFT),
                    'is_active' => true,
                ]);

                // Create specific Activities for "Development, Deployment, and Maintenance of Information Systems" project
                if ($projectData['title'] === 'Development, Deployment, and Maintenance of Information Systems') {
                    $specificActivities = [
                        'Maintenance and Upgrade for Existing PGLU Information Systems',
                        'Subscription of Secure Sockets Layers (SSL) Technology (GlobalSign)',
                        'Subscription of Email Services (Google Workspace)',
                        'Subscription of Provincial Text Blast (Smart InfoCast)',
                        'Development and Deployment of PGLU Information Systems',
                        'Business Process Automation',
                        'Subscription of Plug-ins and Templates',
                        'Subscription of Application Software (PowerBuilder CloudPro)',
                        'Subscription of Productivity and Collaboration Tools',
                        'Conduct of Consultation Meetings',
                        'IS Manuals Creation',
                        'End-User Training'
                    ];
                    
                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                            'is_active' => true,
                        ]);
                    }
                } else {
                    // Create mock Activities for other Projects
                    for ($k = 1; $k <= 2; $k++) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => "Mock Activity $k for " . substr($projectData['title'], 0, 30) . "...",
                            'type' => 'Activity',
                            'code_suffix' => str_pad($k, 3, '0', STR_PAD_LEFT),
                            'is_active' => true,
                        ]);
                    }
                }
                $projectCounter++;
            }
            $programCounter++;
        }
    }
}
