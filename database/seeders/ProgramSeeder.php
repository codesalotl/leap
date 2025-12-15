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
            ['name' => 'IT Infrastructure Development'],
            ['name' => 'Community Outreach and Health'],
            ['name' => 'Environmental Protection Initiatives'],
            ['name' => 'Education and Literacy Program'],
            ['name' => 'Local Economic Stimulus'],
        ]);
    }
}
