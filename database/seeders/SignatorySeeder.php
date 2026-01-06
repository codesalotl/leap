<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Office;
use App\Models\Signatory;

class SignatorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the mapping of Users to Offices
        $mappings = [
            // 1. Local Chief Executive (Mayor)
            [
                'user_email' => 'mayor@lgu.gov.ph',
                'office_keyword' => 'Mayor', // Will search for "Office of the City Mayor" etc.
                'designation' => 'City Mayor',
                'is_head' => true,
            ],
            // 2. Planning Officer (LPDC)
            [
                'user_email' => 'planning@lgu.gov.ph',
                'office_keyword' => 'Planning', // Searches "Planning and Development"
                'designation' => 'City Planning & Devt. Coordinator',
                'is_head' => true,
            ],
            // 3. System Admin (Acting as Budget Officer for this setup)
            [
                'user_email' => 'admin@lgu.gov.ph',
                'office_keyword' => 'Budget', // Searches "Budget Officer"
                'designation' => 'City Budget Officer',
                'is_head' => true,
            ],
            // 4. Treasurer (Ensure you added this user in UserSeeder)
            [
                'user_email' => 'treasurer@lgu.gov.ph',
                'office_keyword' => 'Treasurer',
                'designation' => 'City Treasurer',
                'is_head' => true,
            ],
            // 5. Accountant (Ensure you added this user in UserSeeder)
            [
                'user_email' => 'accountant@lgu.gov.ph',
                'office_keyword' => 'Accountant',
                'designation' => 'City Accountant',
                'is_head' => true,
            ],
            // 6. Engineer (Department Head example)
            [
                'user_email' => 'engineering@lgu.gov.ph',
                'office_keyword' => 'Engineer',
                'designation' => 'City Engineer',
                'is_head' => true,
            ],
        ];

        foreach ($mappings as $map) {
            // 1. Find the User
            $user = User::where('email', $map['user_email'])->first();

            // 2. Find the Office
            // We use 'LIKE' to find the office because exact names might vary
            // (e.g. "Office of the Municipal Mayor" vs "Office of the City Mayor")
            $office = Office::where(
                'name',
                'LIKE',
                '%' . $map['office_keyword'] . '%',
            )->first();

            // Only proceed if both User and Office exist
            if ($user && $office) {
                Signatory::updateOrCreate(
                    [
                        'office_id' => $office->id,
                        'user_id' => $user->id,
                    ],
                    [
                        'designation' => $map['designation'],
                        'is_head' => $map['is_head'],
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
