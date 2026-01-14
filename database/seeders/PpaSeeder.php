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
        // Get the first office to associate the PPAs with
        // Ensure you have at least one office in your database
        $office = Office::first();

        if (!$office) {
            $this->command->error(
                'No Office found. Please seed offices first.',
            );
            return;
        }

        // 1. Create 6 Programs
        for ($i = 1; $i <= 6; $i++) {
            $program = Ppa::create([
                'office_id' => $office->id,
                'parent_id' => null,
                'title' =>
                    'General Program ' . str_pad($i, 2, '0', STR_PAD_LEFT),
                'type' => 'Program',
                'code_suffix' => str_pad($i, 3, '0', STR_PAD_LEFT),
                'is_active' => true,
            ]);

            // 2. Create Projects for each Program
            for ($j = 1; $j <= 2; $j++) {
                $project = Ppa::create([
                    'office_id' => $office->id,
                    'parent_id' => $program->id,
                    'title' => "Infrastructure Project $j under Program $i",
                    'type' => 'Project',
                    'code_suffix' => str_pad($j, 3, '0', STR_PAD_LEFT),
                    'is_active' => true,
                ]);

                // 3. Create Activities for each Project
                for ($k = 1; $k <= 2; $k++) {
                    Ppa::create([
                        'office_id' => $office->id,
                        'parent_id' => $project->id,
                        'title' => "Standard Activity $k for Project $j",
                        'type' => 'Activity',
                        'code_suffix' => str_pad($k, 3, '0', STR_PAD_LEFT),
                        'is_active' => $k % 2 == 0, // Mix of active and inactive for testing
                    ]);
                }
            }
        }
    }
}
