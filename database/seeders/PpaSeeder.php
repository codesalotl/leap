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
                'children' => [],
            ],

            // Operational Activities - Program
            [
                'title' => 'Operational Activities',
                'type' => 'Program',
                'children' => [
                    [
                        'title' =>
                            'Development, Deployment, and Maintenance of Information Systems',
                        'type' => 'Project',
                    ],
                    [
                        'title' => 'Data Management and Repository',
                        'type' => 'Project',
                    ],
                    [
                        'title' =>
                            'PGLU Infrastructure and Connectivity Management',
                        'type' => 'Project',
                    ],
                    [
                        'title' => 'ICT Memberships, Trainings and Conferences',
                        'type' => 'Project',
                    ],
                    [
                        'title' => 'La Union Peace and Order Systems (LUPOS)',
                        'type' => 'Project',
                    ],
                    [
                        'title' => 'Information Systems Strategic Plan (ISSP)',
                        'type' => 'Project',
                    ],
                ],
            ],

            // Strategic Activities - Program
            [
                'title' => 'Strategic Activities',
                'type' => 'Program',
                'children' => [
                    [
                        'title' =>
                            'AgriDigitization (Agri-Marketplace) LU Ordinance No. 423-2023 SP Resolution 194-2022',
                        'type' => 'Project',
                    ],
                    [
                        'title' =>
                            'La Union ICT Council (LUICTC) LU Ordinance No. 443-2024',
                        'type' => 'Project',
                    ],
                ],
            ],

            // Capacity Building Programs - Program
            [
                'title' => 'Capacity Building Programs',
                'type' => 'Program',
                'children' => [
                    [
                        'title' =>
                            'Capacity Development Program for ICTU Personnel and Attendance to ICT Commits, Conferences, and Awarding Ceremony',
                        'type' => 'Project',
                    ],
                    [
                        'title' =>
                            'Conduct of Benchmarking and Best ICT Sharing',
                        'type' => 'Project',
                    ],
                ],
            ],

            // Administrative Support Services - Program
            [
                'title' => 'Administrative Support Services',
                'type' => 'Program',
                'children' => [
                    ['title' => 'Office Administration', 'type' => 'Project'],
                    [
                        'title' => 'Human Resource Management Services',
                        'type' => 'Project',
                    ],
                    ['title' => 'Records Management', 'type' => 'Project'],
                    [
                        'title' => 'Management of All Financial Documents',
                        'type' => 'Project',
                    ],
                    [
                        'title' => 'General Administrative Services',
                        'type' => 'Project',
                    ],
                ],
            ],
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
                    'code_suffix' => str_pad(
                        $projectCounter,
                        3,
                        '0',
                        STR_PAD_LEFT,
                    ),
                    'is_active' => true,
                ]);

                // Create specific Activities for "Development, Deployment, and Maintenance of Information Systems" project
                if (
                    $projectData['title'] ===
                    'Development, Deployment, and Maintenance of Information Systems'
                ) {
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
                        'End-User Training',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "Data Management and Repository" project
                } elseif (
                    $projectData['title'] === 'Data Management and Repository'
                ) {
                    $specificActivities = [
                        'Maintenance of Data Management and Repository',
                        'Provision of Consultancy Services for Data Privacy Act of 2012',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "PGLU Infrastructure and Connectivity Management" project
                } elseif (
                    $projectData['title'] ===
                    'PGLU Infrastructure and Connectivity Management'
                ) {
                    $specificActivities = [
                        'Maintenance of PGLU Server and Network Connectivity Resources',
                        'Subscription to Interest Service Provider (ISP)',
                        'Maintenance for Hardware and Software Resource',
                        'Subscription of Web Conference Tool (Zoom Web Conferencing)',
                        'Maintenance for PBX Communication Equipment',
                        'La Union Peace and Order System (Maintenance for La Union Wireless Province-Wide Mish High Speed Local Network Backbone Phase 1 - Radios/Relays)',
                        'PGLU ICT Resources Management',
                        'PGLU Cloud and Network Security',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "ICT Memberships, Trainings and Conferences" project
                } elseif (
                    $projectData['title'] ===
                    'ICT Memberships, Trainings and Conferences'
                ) {
                    $specificActivities = [
                        'Capacity Training for PGLU IT Focal Person',
                        'Capacity Training for PGLU Heads and Administrative Officers for Data Privacy Act of 2012',
                        'Capacity Training for PGLU Employees for Online Applications',
                        'Capacity Training for ICT Skills Development for LGUs',
                        'Conduct of National ICT Month Celebration (Proclamation Number 1521, Series of 2008)',
                        'Annual Membership for World Smart Sustainable Cities Organization',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "La Union Peace and Order Systems (LUPOS)" project
                } elseif (
                    $projectData['title'] ===
                    'La Union Peace and Order Systems (LUPOS)'
                ) {
                    $specificActivities = [
                        'LBP Loan Amortizations (Establishment of the Province-wide Mesh High Speed Local Network Backbone) @6.00% p.a.',
                        'LBP Loan Amortizations (Implementation of the La Union Peace, Order, and Public Safety System-Phase II) @6.25% p.a.',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "Information Systems Strategic Plan (ISSP)" project
                } elseif (
                    $projectData['title'] ===
                    'Information Systems Strategic Plan (ISSP)'
                ) {
                    $specificActivities = [
                        'Creation and Meeting of Steering Committee and Technical Working Group',
                        'Writeshop/Formulation of ISSP 2025 to 2028',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "Office Administration" project
                } elseif ($projectData['title'] === 'Office Administration') {
                    $specificActivities = [
                        'Preparation and Assessment of Work Program and Budget and other Office Reports/Plans',
                        'Conduct of Monthly Staff and WIG Meeting cum Staff Development Session',
                        'Sustainability of ISO Implementation',
                        'Review of Communications',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "Human Resource Management Services" project
                } elseif (
                    $projectData['title'] ===
                    'Human Resource Management Services'
                ) {
                    $specificActivities = [
                        'SPMS Preparation',
                        'Preparation/Updating of Individual Development Plan (IDP)',
                        'Preparation of Statement of Assets, Liabilities, and Net Worth (SALN)',
                        'Preparation of Personnel Discipline Report',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "Records Management" project
                } elseif ($projectData['title'] === 'Records Management') {
                    $specificActivities = [
                        'Updating and Management of All Records',
                        'Management of all Incoming and Outgoing Communications',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                    // Create specific Activities for "General Administrative Services" project
                } elseif (
                    $projectData['title'] === 'General Administrative Services'
                ) {
                    $specificActivities = [
                        'Janitorial Services',
                        'Transport Service',
                        'ICT and Office Equipment',
                        'Preparation of Supplies and ICT Equipment Inventory Report',
                        'Subscription to Telecommunication Postpaid Plans',
                        'Provision of Menstruation Day Privilege Governor\'s Executive Order (EO) 25, S. 2022',
                    ];

                    foreach ($specificActivities as $index => $activityTitle) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' => $activityTitle,
                            'type' => 'Activity',
                            'code_suffix' => str_pad(
                                $index + 1,
                                3,
                                '0',
                                STR_PAD_LEFT,
                            ),
                            'is_active' => true,
                        ]);
                    }
                } else {
                    // Create mock Activities for other Projects
                    for ($k = 1; $k <= 2; $k++) {
                        Ppa::create([
                            'office_id' => $office->id,
                            'parent_id' => $project->id,
                            'title' =>
                                "Mock Activity $k for " .
                                substr($projectData['title'], 0, 30) .
                                '...',
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
