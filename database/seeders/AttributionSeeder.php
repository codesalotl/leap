<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Attribution;

class AttributionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Attribution::truncate();

        $attributions = [
            ['code' => 'GAD', 'name' => 'Gender and Development'],
            ['code' => 'LDRRM', 'name' => 'Disaster Risk Reduction'],
            ['code' => 'CCA', 'name' => 'Climate Change Adaptation'],
            ['code' => 'CCM', 'name' => 'Climate Change Mitigation'],
            ['code' => 'LCPC', 'name' => 'Protection of Children'],
            ['code' => 'SCPWD', 'name' => 'Senior Citizens & PWDs'],
            ['code' => 'POP', 'name' => 'Peace and Order'],
            ['code' => 'AIDS', 'name' => 'HIV/AIDS'],
        ];

        foreach ($attributions as $attribution) {
            Attribution::create($attribution);
        }
    }
}
