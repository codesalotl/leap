<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PpmpCategory;

class PpmpCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Accountable Forms'],
            ['name' => 'Advertising'],
            ['name' => 'Beverages'],
            ['name' => 'Carpentry Tools and Equipment'],
            ['name' => 'Carpentry Supplies'],
            ['name' => 'Computer Supplies'],
            ['name' => 'Computer Ink and Toner'],
            ['name' => 'Computer Supplies (Kyocera)'],
            ['name' => 'Computer Supplies (Canon)'],
            ['name' => 'Computer Supplies (Duplo)'],
            ['name' => 'Computer Supplies (Lexmark)'],
            ['name' => 'Computer Supplies (Sharp)'],
            ['name' => 'Computer Supplies (Neo Brand)'],
            ['name' => 'Electrical Supplies'],
            ['name' => 'Electrical Tools'],
            ['name' => 'Electrical Equipment'],
            ['name' => 'Fuel, Oil, and Lubricants'],
            ['name' => 'Janitorial Supplies'],
            ['name' => 'Gardening Supplies & Tools'],
            ['name' => 'Plumbing Supplies'],
            ['name' => 'Plumbing Tools'],
            ['name' => 'Office Supplies'],
            ['name' => 'Postage & Courier Service'],
            ['name' => 'Printing & Publication'],
            [
                'name' =>
                    'Buffet Meals and Snacks (For OPG, OVG, OSP, and ADM only)',
            ],
            ['name' => 'Meals and Snacks (Other Offices)'],
            ['name' => 'Trophies, Plaques & Medals'],
            ['name' => 'Sports Supplies'],
            ['name' => 'Tokens/Souvenirs'],
            ['name' => 'General Welfare Goods'],
            ['name' => 'ICT Equipment'],
        ];

        foreach ($categories as $category) {
            PpmpCategory::create($category);
        }
    }
}
