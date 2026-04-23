<?php

namespace Database\Seeders;

use App\Models\ChartOfAccountPpmpCategory;
use Illuminate\Database\Seeder;

class ChartOfAccountPpmpCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pivotData = [
            // MOOE - Traveling Expenses
            ['ppmp_category_id' => 25, 'chart_of_account_id' => 28],
            ['ppmp_category_id' => 26, 'chart_of_account_id' => 29],
            ['ppmp_category_id' => 27, 'chart_of_account_id' => 30],
            ['ppmp_category_id' => 28, 'chart_of_account_id' => 31],

            // Computer Supplies
            ['ppmp_category_id' => 6, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 7, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 8, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 9, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 10, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 11, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 12, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 13, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 20, 'chart_of_account_id' => 32],
            ['ppmp_category_id' => 22, 'chart_of_account_id' => 32],

            // Accountable Forms
            ['ppmp_category_id' => 1, 'chart_of_account_id' => 33],

            // Non-Accountable Forms
            ['ppmp_category_id' => 29, 'chart_of_account_id' => 34],

            // Animal/Zoological Supplies
            ['ppmp_category_id' => 30, 'chart_of_account_id' => 35],

            // Food Supplies
            ['ppmp_category_id' => 31, 'chart_of_account_id' => 36],

            // Welfare Goods
            ['ppmp_category_id' => 32, 'chart_of_account_id' => 37],

            // Drugs and Medicines
            ['ppmp_category_id' => 33, 'chart_of_account_id' => 38],

            // Medical, Dental and Laboratory Supplies
            ['ppmp_category_id' => 34, 'chart_of_account_id' => 39],

            // Fuel, Oil, and Lubricants
            ['ppmp_category_id' => 17, 'chart_of_account_id' => 40],

            // Agricultural and Marine Supplies
            ['ppmp_category_id' => 35, 'chart_of_account_id' => 41],

            // Textbooks and Instructional Materials
            ['ppmp_category_id' => 36, 'chart_of_account_id' => 42],

            // Military, Police and Traffic Supplies
            ['ppmp_category_id' => 37, 'chart_of_account_id' => 43],

            // Chemical and Filtering Supplies
            ['ppmp_category_id' => 38, 'chart_of_account_id' => 44],

            // Semi-Expendable Machinery and Equipment
            ['ppmp_category_id' => 39, 'chart_of_account_id' => 45],

            // Semi-Expendable Furniture, Fixtures and Book
            ['ppmp_category_id' => 40, 'chart_of_account_id' => 46],

            // Other Supplies and Materials
            ['ppmp_category_id' => 4, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 5, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 14, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 15, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 16, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 18, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 19, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 21, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 41, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 42, 'chart_of_account_id' => 47],
            ['ppmp_category_id' => 43, 'chart_of_account_id' => 47],

            // Water
            ['ppmp_category_id' => 44, 'chart_of_account_id' => 48],

            // Electricity
            ['ppmp_category_id' => 45, 'chart_of_account_id' => 49],

            // Postage and Courier Services
            ['ppmp_category_id' => 23, 'chart_of_account_id' => 50],

            // Telephone
            ['ppmp_category_id' => 46, 'chart_of_account_id' => 51],

            // Internet Subscription
            ['ppmp_category_id' => 47, 'chart_of_account_id' => 52],

            // Cable, Satellite, Telegraph and Radio
            ['ppmp_category_id' => 48, 'chart_of_account_id' => 53],

            // Awards and Rewards
            ['ppmp_category_id' => 49, 'chart_of_account_id' => 54],

            // Prizes
            ['ppmp_category_id' => 50, 'chart_of_account_id' => 55],

            // Survey
            ['ppmp_category_id' => 51, 'chart_of_account_id' => 56],

            // Research, Exploration and Development
            ['ppmp_category_id' => 52, 'chart_of_account_id' => 57],

            // Demolition and Relocation
            ['ppmp_category_id' => 53, 'chart_of_account_id' => 58],

            // Desilting and Dredging
            ['ppmp_category_id' => 54, 'chart_of_account_id' => 59],

            // Generation, Transmission and Distribution
            ['ppmp_category_id' => 55, 'chart_of_account_id' => 60],

            // Confidential Expenses
            ['ppmp_category_id' => 56, 'chart_of_account_id' => 61],

            // Intelligence Expenses
            ['ppmp_category_id' => 57, 'chart_of_account_id' => 62],

            // Extraordinary and Miscellaneous Expenses
            ['ppmp_category_id' => 58, 'chart_of_account_id' => 63],

            // Legal Services
            ['ppmp_category_id' => 59, 'chart_of_account_id' => 64],

            // Auditing Services
            ['ppmp_category_id' => 60, 'chart_of_account_id' => 65],

            // Consultancy Services
            ['ppmp_category_id' => 61, 'chart_of_account_id' => 66],

            // Other Professional Services
            ['ppmp_category_id' => 62, 'chart_of_account_id' => 67],

            // Environment/Sanitary Services
            ['ppmp_category_id' => 63, 'chart_of_account_id' => 68],

            // Janitorial Services
            ['ppmp_category_id' => 64, 'chart_of_account_id' => 69],

            // Security Services
            ['ppmp_category_id' => 65, 'chart_of_account_id' => 70],

            // Other General Services
            ['ppmp_category_id' => 66, 'chart_of_account_id' => 71],

            // Repair and Maintenance - Investment Property
            ['ppmp_category_id' => 67, 'chart_of_account_id' => 72],

            // Repair and Maintenance - Land Improvements
            ['ppmp_category_id' => 68, 'chart_of_account_id' => 73],

            // Repair and Maintenance - Infrastructure Assets
            ['ppmp_category_id' => 69, 'chart_of_account_id' => 74],

            // Repair and Maintenance - Buildings and Other Structures
            ['ppmp_category_id' => 70, 'chart_of_account_id' => 75],

            // Repair and Maintenance - Machinery and Equipment
            ['ppmp_category_id' => 71, 'chart_of_account_id' => 76],

            // Repair and Maintenance - Transportation Equipment
            ['ppmp_category_id' => 72, 'chart_of_account_id' => 77],

            // Repair and Maintenance - Furniture and Fixtures
            ['ppmp_category_id' => 73, 'chart_of_account_id' => 78],

            // Repair and Maintenance - Leased Assets
            ['ppmp_category_id' => 74, 'chart_of_account_id' => 79],

            // Repair and Maintenance - Leased Assets Improvements
            ['ppmp_category_id' => 75, 'chart_of_account_id' => 80],

            // Repair and Maintenance - Other Property, Plant and Equipment
            ['ppmp_category_id' => 76, 'chart_of_account_id' => 81],

            // Subsidy to National Government Agencies
            ['ppmp_category_id' => 77, 'chart_of_account_id' => 82],

            // Subsidy to Other Local Government Units
            ['ppmp_category_id' => 78, 'chart_of_account_id' => 83],

            // Subsidy to Other Funds
            ['ppmp_category_id' => 79, 'chart_of_account_id' => 84],

            // Subsidy to General Fund Proper/Special Accounts
            ['ppmp_category_id' => 80, 'chart_of_account_id' => 85],

            // Subsidy to Local Economic Enterprises/Public Utilities
            ['ppmp_category_id' => 81, 'chart_of_account_id' => 86],

            // Subsidy-Others
            ['ppmp_category_id' => 82, 'chart_of_account_id' => 87],

            // Transfers of Unspent Current Year DRRM Funds to the Trust Funds
            ['ppmp_category_id' => 83, 'chart_of_account_id' => 88],

            // Transfers for Project Equity Share/LGU Counterpart
            ['ppmp_category_id' => 84, 'chart_of_account_id' => 89],

            // Taxes, Duties and Licenses
            ['ppmp_category_id' => 85, 'chart_of_account_id' => 90],

            // Fidelity Bond Premiums
            ['ppmp_category_id' => 86, 'chart_of_account_id' => 91],

            // Insurance Expenses
            ['ppmp_category_id' => 87, 'chart_of_account_id' => 92],

            // Advertising Expenses
            ['ppmp_category_id' => 2, 'chart_of_account_id' => 93],

            // Printing and Publication Expenses
            ['ppmp_category_id' => 24, 'chart_of_account_id' => 94],

            // Representation Expenses
            ['ppmp_category_id' => 3, 'chart_of_account_id' => 95],
            ['ppmp_category_id' => 88, 'chart_of_account_id' => 95],
            ['ppmp_category_id' => 89, 'chart_of_account_id' => 95],

            // Transportation and Delivery Expenses
            ['ppmp_category_id' => 90, 'chart_of_account_id' => 96],

            // Rent Expenses
            ['ppmp_category_id' => 91, 'chart_of_account_id' => 97],

            // Membership Dues and Contributions to Organizations
            ['ppmp_category_id' => 92, 'chart_of_account_id' => 98],

            // Subscription Expenses
            ['ppmp_category_id' => 93, 'chart_of_account_id' => 99],

            // Donations
            ['ppmp_category_id' => 94, 'chart_of_account_id' => 100],

            // Other Maintenance and Operating Expenses
            ['ppmp_category_id' => 95, 'chart_of_account_id' => 101],

            // Capital Outlay - Land
            ['ppmp_category_id' => 96, 'chart_of_account_id' => 102],
            ['ppmp_category_id' => 97, 'chart_of_account_id' => 103],
            ['ppmp_category_id' => 98, 'chart_of_account_id' => 104],
            ['ppmp_category_id' => 99, 'chart_of_account_id' => 105],
            ['ppmp_category_id' => 100, 'chart_of_account_id' => 106],
            ['ppmp_category_id' => 101, 'chart_of_account_id' => 107],
            ['ppmp_category_id' => 102, 'chart_of_account_id' => 108],
            ['ppmp_category_id' => 103, 'chart_of_account_id' => 109],
            ['ppmp_category_id' => 104, 'chart_of_account_id' => 110],
            ['ppmp_category_id' => 105, 'chart_of_account_id' => 111],
            ['ppmp_category_id' => 106, 'chart_of_account_id' => 112],
            ['ppmp_category_id' => 107, 'chart_of_account_id' => 113],
            ['ppmp_category_id' => 108, 'chart_of_account_id' => 114],
            ['ppmp_category_id' => 109, 'chart_of_account_id' => 115],
            ['ppmp_category_id' => 110, 'chart_of_account_id' => 116],
            ['ppmp_category_id' => 111, 'chart_of_account_id' => 117],
            ['ppmp_category_id' => 112, 'chart_of_account_id' => 118],
            ['ppmp_category_id' => 113, 'chart_of_account_id' => 119],
            ['ppmp_category_id' => 114, 'chart_of_account_id' => 120],
            ['ppmp_category_id' => 115, 'chart_of_account_id' => 121],
            ['ppmp_category_id' => 116, 'chart_of_account_id' => 122],
            ['ppmp_category_id' => 117, 'chart_of_account_id' => 123],
            ['ppmp_category_id' => 118, 'chart_of_account_id' => 124],
            ['ppmp_category_id' => 119, 'chart_of_account_id' => 125],
            ['ppmp_category_id' => 120, 'chart_of_account_id' => 126],
            ['ppmp_category_id' => 121, 'chart_of_account_id' => 127],
            ['ppmp_category_id' => 122, 'chart_of_account_id' => 128],
            ['ppmp_category_id' => 123, 'chart_of_account_id' => 129],
            ['ppmp_category_id' => 124, 'chart_of_account_id' => 130],
            ['ppmp_category_id' => 125, 'chart_of_account_id' => 131],
            ['ppmp_category_id' => 126, 'chart_of_account_id' => 132],
            ['ppmp_category_id' => 127, 'chart_of_account_id' => 133],
            ['ppmp_category_id' => 128, 'chart_of_account_id' => 134],
            ['ppmp_category_id' => 129, 'chart_of_account_id' => 135],
            ['ppmp_category_id' => 130, 'chart_of_account_id' => 136],
            ['ppmp_category_id' => 131, 'chart_of_account_id' => 137],
            ['ppmp_category_id' => 132, 'chart_of_account_id' => 138],
            ['ppmp_category_id' => 133, 'chart_of_account_id' => 139],
            ['ppmp_category_id' => 134, 'chart_of_account_id' => 140],
            ['ppmp_category_id' => 135, 'chart_of_account_id' => 141],
            ['ppmp_category_id' => 136, 'chart_of_account_id' => 142],
            ['ppmp_category_id' => 137, 'chart_of_account_id' => 143],
            ['ppmp_category_id' => 138, 'chart_of_account_id' => 144],
            ['ppmp_category_id' => 139, 'chart_of_account_id' => 145],
            ['ppmp_category_id' => 140, 'chart_of_account_id' => 146],
            ['ppmp_category_id' => 141, 'chart_of_account_id' => 147],
            ['ppmp_category_id' => 142, 'chart_of_account_id' => 148],
            ['ppmp_category_id' => 143, 'chart_of_account_id' => 149],
            ['ppmp_category_id' => 144, 'chart_of_account_id' => 150],
            ['ppmp_category_id' => 145, 'chart_of_account_id' => 151],
        ];

        foreach ($pivotData as $data) {
            ChartOfAccountPpmpCategory::updateOrCreate(
                [
                    'ppmp_category_id' => $data['ppmp_category_id'],
                    'chart_of_account_id' => $data['chart_of_account_id'],
                ],
                $data,
            );
        }
    }
}
