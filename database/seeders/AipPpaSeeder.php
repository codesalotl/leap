<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AipPpa;

class AipPpaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Wipe the table clean
        AipPpa::truncate();

        // Config variables
        $sector = '1000';
        $subSector = '000';
        $lguLevel = '1';
        $officeType = '01';
        $office = '006';

        // prefix: 1000-000-1-01-006
        $prefix = "{$sector}-{$subSector}-{$lguLevel}-{$officeType}-{$office}";

        // 1. Create 5 Programs
        for ($i = 1; $i <= 5; $i++) {
            $progInc = str_pad($i, 3, '0', STR_PAD_LEFT);

            $program = AipPpa::create([
                'type' => 'Program',
                'reference_code' => "{$prefix}-{$progInc}-000-000",
                'description' => "Main Program $i",
                'parent_id' => null,
            ]);

            // 2. Create Projects for this Program (Let's give each program 1 or 2 projects)
            // Total will reach ~7 projects as requested
            $projectLimit = $i <= 2 ? 2 : 1;

            for ($j = 1; $j <= $projectLimit; $j++) {
                $projInc = str_pad($j, 3, '0', STR_PAD_LEFT);

                $project = AipPpa::create([
                    'type' => 'Project',
                    'reference_code' => "{$prefix}-{$progInc}-{$projInc}-000",
                    'description' => "Project $j under Program $i",
                    'parent_id' => $program->id,
                ]);

                // 3. Create Activities for this Project
                // We'll add 1 or 2 activities until we hit 10 total
                static $activityCount = 0;
                if ($activityCount < 10) {
                    $actLimit = $activityCount < 5 ? 2 : 1;
                    for ($k = 1; $k <= $actLimit; $k++) {
                        $activityCount++;
                        $actInc = str_pad($k, 3, '0', STR_PAD_LEFT);

                        AipPpa::create([
                            'type' => 'Activity',
                            'reference_code' => "{$prefix}-{$progInc}-{$projInc}-{$actInc}",
                            'description' => "Activity $activityCount for Project $j",
                            'parent_id' => $project->id,
                        ]);

                        if ($activityCount >= 10) {
                            break;
                        }
                    }
                }
            }
        }
    }
}
