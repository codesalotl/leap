<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AipCollection;
use Carbon\Carbon;

class AipCollectionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AipCollection::truncate();

        $timestamp = Carbon::now();

        AipCollection::insert([
            [
                'year' => 2020,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'year' => 2021,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'year' => 2022,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],

            [
                'year' => 2023,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
            [
                'year' => 2024,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ],
        ]);
    }
}
