<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'System Administrator',
                'email' => 'admin@lgu.gov.ph',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ],
            [
                'name' => 'Hon. Local Chief Executive',
                'email' => 'mayor@lgu.gov.ph',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ],
            [
                'name' => 'Planning Officer',
                'email' => 'planning@lgu.gov.ph',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ],
            // ... add the rest of your users here
        ];

        foreach ($users as $userData) {
            // updateOrCreate ensures no duplicates based on email
            User::updateOrCreate(
                ['email' => $userData['email']], // Search criteria
                $userData, // Data to update or insert
            );
        }
    }
}
