<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Program;
use App\Models\Project;
use App\Models\Activity;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = Program::all();
        $projects = Project::all();

        $networkUpgradeId =
            $projects->firstWhere('name', 'Network Upgrade Phase I')->id ??
            null;
        $itProgramId =
            $programs->firstWhere('name', 'IT Infrastructure Development')
                ->id ?? null;

        $mobileClinicId =
            $projects->firstWhere('name', 'Mobile Clinic Rollout')->id ?? null;
        $healthProgramId =
            $programs->firstWhere('name', 'Community Outreach and Health')
                ->id ?? null;

        $cleanUpId =
            $projects->firstWhere('name', 'River Clean-up Campaign')->id ??
            null;
        $envProgramId =
            $programs->firstWhere(
                'name',
                'Environmental Protection Initiatives',
            )->id ?? null;

        $activities = [];

        if ($networkUpgradeId && $itProgramId) {
            $activities[] = [
                'program_id' => $itProgramId,
                'project_id' => $networkUpgradeId,
                'name' => 'Server Configuration',
            ];
            $activities[] = [
                'program_id' => $itProgramId,
                'project_id' => $networkUpgradeId,
                'name' => 'Fiber Optic Cable Installation',
            ];
        }

        if ($mobileClinicId && $healthProgramId) {
            $activities[] = [
                'program_id' => $healthProgramId,
                'project_id' => $mobileClinicId,
                'name' => 'Staff Training',
            ];
            $activities[] = [
                'program_id' => $healthProgramId,
                'project_id' => $mobileClinicId,
                'name' => 'Drug Supply Procurement',
            ];
        }

        if ($cleanUpId && $envProgramId) {
            $activities[] = [
                'program_id' => $envProgramId,
                'project_id' => $cleanUpId,
                'name' => 'Volunteer Mobilization',
            ];
            $activities[] = [
                'program_id' => $envProgramId,
                'project_id' => $cleanUpId,
                'name' => 'Waste Collection Day 1',
            ];
            $activities[] = [
                'program_id' => $envProgramId,
                'project_id' => $cleanUpId,
                'name' => 'Waste Disposal Documentation',
            ];
        }

        if (!empty($activities)) {
            Activity::insert($activities);
        }
    }
}
