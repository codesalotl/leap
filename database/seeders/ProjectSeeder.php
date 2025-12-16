<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Project;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pIds = Program::pluck('id')->toArray();

        Project::insert([
            ['program_id' => $pIds[0], 'name' => 'Network Upgrade Phase I'],
            ['program_id' => $pIds[0], 'name' => 'Cloud Migration Project'],
            ['program_id' => $pIds[1], 'name' => 'Mobile Clinic Rollout'],
            ['program_id' => $pIds[1], 'name' => 'Vaccination Drive'],
            ['program_id' => $pIds[2], 'name' => 'River Clean-up Campaign'],
            ['program_id' => $pIds[3], 'name' => 'Digital Learning Hub Setup'],
            ['program_id' => $pIds[4], 'name' => 'SME Business Grants'],
            [
                'program_id' => $pIds[4],
                'name' => 'Tourism Marketing Initiative',
            ],
        ]);
    }
}
