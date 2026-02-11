<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PpmpPriceList;
use App\Models\ChartOfAccount;
use App\Models\PpmpCategory;

class PpmpPriceListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get only MOOE postable chart of accounts
        $mooeAccounts = ChartOfAccount::where('expense_class', 'MOOE')
            ->where('is_postable', true)
            ->get();

        // Get all categories
        $categories = PpmpCategory::all();
        $categoryMap = $this->createCategoryMap($categories);

        $this->command->info('Found MOOE accounts: ' . $mooeAccounts->count());
        $this->command->info('Found categories: ' . $categories->count());

        $items = [];
        $itemNumber = 1;

        // MAINTENANCE AND OTHER OPERATING EXPENSES (MOOE) Items
        if ($mooeAccounts->isNotEmpty()) {
            // Get all MOOE accounts
            $accounts = [
                '5-02-01-010' => 'Traveling Expenses - Local',
                '5-02-01-020' => 'Traveling Expenses - Foreign',
                '5-02-02-010' => 'Training Expenses',
                '5-02-02-020' => 'Scholarship Grants/Expenses',
                '5-02-03-010' => 'Office Supplies Expenses',
                '5-02-03-020' => 'Accountable Forms Expenses',
                '5-02-03-030' => 'Non-Accountable Forms Expenses',
                '5-02-03-040' => 'Animal/Zoological Supplies Expenses',
                '5-02-03-050' => 'Food Supplies Expenses',
                '5-02-03-060' => 'Welfare Goods Expenses',
                '5-02-03-070' => 'Drugs and Medicines Expenses',
                '5-02-03-080' =>
                    'Medical, Dental and Laboratory Supplies Expenses',
                '5-02-03-090' => 'Fuel, Oil and Lubricants Expenses',
                '5-02-03-100' => 'Agricultural and Marine Supplies Expenses',
                '5-02-03-110' =>
                    'Textbooks and Instructional Materials Expenses',
                '5-02-03-120' =>
                    'Military, Police and Traffic Supplies Expenses',
                '5-02-03-130' => 'Chemical and Filtering Supplies Expenses',
                '5-02-03-210' =>
                    'Semi-Expendable Machinery and Equipment Expenses',
                '5-02-03-220' =>
                    'Semi-Expendable Furniture, Fixtures and Books Expenses',
                '5-02-03-990' => 'Other Supplies and Materials Expenses',
                '5-02-04-010' => 'Water Expenses',
                '5-02-04-020' => 'Electricity Expenses',
                '5-02-05-010' => 'Postage and Courier Services',
                '5-02-05-020' => 'Telephone Expenses',
                '5-02-05-030' => 'Internet Subscription Expenses',
                '5-02-05-040' =>
                    'Cable, Satellite, Telegraph and Radio Expenses',
                '5-02-06-010' => 'Awards and Rewards Expenses',
                '5-02-06-020' => 'Prizes',
                '5-02-07-010' => 'Survey Expenses',
                '5-02-07-020' =>
                    'Research, Exploration and Development Expense',
                '5-02-08-010' => 'Demolition and Relocation Expenses',
                '5-02-08-020' => 'Desilting and Dredging Expenses',
                '5-02-09-010' =>
                    'Generation, Transmission and Distribution Expenses',
                '5-02-10-010' => 'Confidential Expenses',
                '5-02-10-020' => 'Intelligence Expenses',
                '5-02-10-030' => 'Extraordinary and Miscellaneous Expenses',
                '5-02-11-010' => 'Legal Services',
                '5-02-11-020' => 'Auditing Services',
                '5-02-11-030' => 'Consultancy Services',
                '5-02-11-990' => 'Other Professional Services',
                '5-02-12-010' => 'Environmental/Sanitary Services',
                '5-02-12-020' => 'Janitorial Services',
                '5-02-12-030' => 'Security Services',
                '5-02-12-990' => 'Other General Services',
                '5-02-13-010' => 'Repair and Maintenance - Investment Property',
                '5-02-13-020' => 'Repair and Maintenance - Land Improvements',
                '5-02-13-030' =>
                    'Repair and Maintenance - Infrastructure Asset',
                '5-02-13-040' =>
                    'Repair and Maintenance - Buildings and Other Structures',
                '5-02-13-050' =>
                    'Repair and Maintenance - Machinery and Equipment',
                '5-02-13-060' =>
                    'Repair and Maintenance - Transportation Equipment',
                '5-02-13-070' =>
                    'Repair and Maintenance - Furniture and Fixtures',
                '5-02-13-080' => 'Repair and Maintenance - Leased Assets',
                '5-02-13-090' =>
                    'Repair and Maintenance - Leased Assets Improvements',
                '5-02-13-990' =>
                    'Repair and Maintenance - Other Property, Plant & Equipment',
                '5-02-14-020' => 'Subsidy to Other Local Government Units',
                '5-02-14-030' => 'Subsidy to Other Funds',
                '5-02-14-060' => 'Subsidy to Other Funds',
                '5-02-14-070' =>
                    'Subsidy to General Fund Proper/Special accounts',
                '5-02-14-080' =>
                    'Subsidy to Local Economic Enterprise / Public Utilities',
                '5-02-14-990' => 'Subsidy - Others',
                '5-02-15-010' =>
                    'Transfers of Unspent Current Year DRRM funds to Trust Fund',
                '5-02-15-020' =>
                    'Transfers for Project Equity Share / LGU Counterpart',
                '5-02-16-010' => 'Taxes, Duties and Licenses',
                '5-02-16-020' => 'Fidelity Bond Premiums',
                '5-02-16-030' => 'Insurance Expenses',
                '5-02-99-010' => 'Advertising Expenses',
                '5-02-99-020' => 'Printing and Publication Expenses',
                '5-02-99-030' =>
                    'Representation Expenses (ex. meals and snacks)',
                '5-02-99-040' => 'Transportation and Delivery Expenses',
                '5-02-99-050' => 'Rent Expense',
                '5-02-99-060' => 'Membership Dues & Cont. To Organization',
                '5-02-99-070' => 'Subscription Expenses',
                '5-02-99-080' => 'Donations',
                '5-02-99-990' => 'Other Maintenance and Operating Expenses',
            ];

            foreach ($accounts as $accountNumber => $accountTitle) {
                $account =
                    $mooeAccounts
                        ->where('account_number', $accountNumber)
                        ->first() ?? $mooeAccounts->first();

                // Generate 2 items for each account
                $categoryId = $this->getCategoryIdForAccount($accountTitle, $categoryMap, $categories);
                $items[] = $this->createItem(
                    $itemNumber++,
                    $accountTitle,
                    $account->id,
                    $categoryId,
                    1,
                );
                $items[] = $this->createItem(
                    $itemNumber++,
                    $accountTitle,
                    $account->id,
                    $categoryId,
                    2,
                );
            }
        }

        foreach ($items as $item) {
            PpmpPriceList::create($item);
        }

        $this->command->info(
            'Created ' .
                count($items) .
                ' PPMP price list items for MOOE accounts',
        );
    }

    private function createItem(
        $itemNumber,
        $accountTitle,
        $chartOfAccountId,
        $ppmpCategoryId,
        $variant,
    ) {
        $descriptions = $this->getItemDescriptions($accountTitle);
        $description =
            $descriptions[$variant - 1] ??
            $accountTitle . ' - Item ' . $variant;

        $unitAndPrice = $this->getUnitAndPrice($accountTitle, $variant);

        return [
            'item_number' => $itemNumber,
            'description' => $description,
            'unit_of_measurement' => $unitAndPrice['unit'],
            'price' => $unitAndPrice['price'],
            'ppmp_category_id' => $ppmpCategoryId,
            'chart_of_account_id' => $chartOfAccountId,
        ];
    }

    private function getItemDescriptions($accountTitle)
    {
        $descriptions = [
            'Traveling Expenses - Local' => [
                'Transportation Allowance - Local Travel',
                'Meal Allowance - Local Business',
            ],
            'Traveling Expenses - Foreign' => [
                'Airfare - Regional',
                'Hotel Accommodation - Foreign',
            ],
            'Training Expenses' => [
                'Training Materials',
                'Venue Rental - Training',
            ],
            'Scholarship Grants/Expenses' => [
                'Scholarship Grant - College',
                'Book Allowance - Scholar',
            ],
            'Office Supplies Expenses' => [
                'Ballpen (Blue)',
                'A4 Bond Paper (Ream)',
            ],
            'Accountable Forms Expenses' => [
                'Official Receipts Book',
                'Invoice Forms',
            ],
            'Non-Accountable Forms Expenses' => [
                'Inter-office Memorandum',
                'Certificate Forms',
            ],
            'Animal/Zoological Supplies Expenses' => [
                'Animal Feed - General',
                'Veterinary Supplies',
            ],
            'Food Supplies Expenses' => ['Rice Supply', 'Canned Goods'],
            'Welfare Goods Expenses' => ['Relief Goods Package', 'Medical Kit'],
            'Drugs and Medicines Expenses' => [
                'Paracetamol Tablets',
                'Antibiotic Ointment',
            ],
            'Medical, Dental and Laboratory Supplies Expenses' => [
                'Gloves - Latex',
                'Syringes - Disposable',
            ],
            'Fuel, Oil and Lubricants Expenses' => [
                'Diesel Fuel',
                'Engine Oil',
            ],
            'Agricultural and Marine Supplies Expenses' => [
                'Fertilizer - Urea',
                'Fishing Net',
            ],
            'Textbooks and Instructional Materials Expenses' => [
                'Textbook - Mathematics',
                'Workbook - Science',
            ],
            'Military, Police and Traffic Supplies Expenses' => [
                'Police Uniform',
                'Traffic Cone',
            ],
            'Chemical and Filtering Supplies Expenses' => [
                'Chlorine - Water Treatment',
                'Water Filter Cartridge',
            ],
            'Semi-Expendable Machinery and Equipment Expenses' => [
                'Small Generator Set',
                'Water Pump',
            ],
            'Semi-Expendable Furniture, Fixtures and Books Expenses' => [
                'Office Chair - Basic',
                'Bookshelf',
            ],
            'Other Supplies and Materials Expenses' => [
                'Cleaning Materials',
                'General Office Supplies',
            ],
            'Water Expenses' => [
                'Water Consumption - Office',
                'Water Tank Cleaning',
            ],
            'Electricity Expenses' => [
                'Electricity Consumption',
                'Electrical Maintenance',
            ],
            'Postage and Courier Services' => [
                'Postal Stamps',
                'Courier Services - Local',
            ],
            'Telephone Expenses' => [
                'Landline Monthly Subscription',
                'Long Distance Calls',
            ],
            'Internet Subscription Expenses' => [
                'Internet Subscription - Business',
                'Internet Router Replacement',
            ],
            'Cable, Satellite, Telegraph and Radio Expenses' => [
                'Cable TV Subscription',
                'Radio Communication Service',
            ],
            'Awards and Rewards Expenses' => [
                'Employee of the Month Award',
                'Performance Bonus',
            ],
            'Prizes' => ['Raffle Prize - Major', 'Contest Prize - Minor'],
            'Survey Expenses' => [
                'Survey Forms Printing',
                'Survey Data Analysis',
            ],
            'Research, Exploration and Development Expense' => [
                'Research Materials',
                'Field Work Expenses',
            ],
            'Demolition and Relocation Expenses' => [
                'Demolition Service',
                'Relocation Assistance',
            ],
            'Desilting and Dredging Expenses' => [
                'Desilting Service',
                'Dredging Service',
            ],
            'Generation, Transmission and Distribution Expenses' => [
                'Power Generation Cost',
                'Power Distribution Maintenance',
            ],
            'Confidential Expenses' => [
                'Confidential Fund - General',
                'Special Operations Fund',
            ],
            'Intelligence Expenses' => [
                'Intelligence Gathering',
                'Security Equipment',
            ],
            'Extraordinary and Miscellaneous Expenses' => [
                'Emergency Response Fund',
                'Disaster Relief Fund',
            ],
            'Legal Services' => ['Legal Consultation', 'Document Notarization'],
            'Auditing Services' => [
                'External Audit Service',
                'Internal Audit Review',
            ],
            'Consultancy Services' => [
                'Management Consultancy',
                'Technical Consultancy',
            ],
            'Other Professional Services' => [
                'Professional Fees',
                'Specialized Services',
            ],
            'Environmental/Sanitary Services' => [
                'Waste Management Service',
                'Pest Control Service',
            ],
            'Janitorial Services' => [
                'Office Cleaning Service',
                'Waste Disposal Service',
            ],
            'Security Services' => [
                'Security Guard Service',
                'CCTV Maintenance',
            ],
            'Other General Services' => [
                'General Maintenance',
                'Facility Management',
            ],
            'Repair and Maintenance - Investment Property' => [
                'Property Repair - Minor',
                'Property Maintenance',
            ],
            'Repair and Maintenance - Land Improvements' => [
                'Landscaping Service',
                'Grounds Maintenance',
            ],
            'Repair and Maintenance - Infrastructure Asset' => [
                'Infrastructure Repair',
                'Asset Maintenance',
            ],
            'Repair and Maintenance - Buildings and Other Structures' => [
                'Building Repair - Minor',
                'Painting Service',
            ],
            'Repair and Maintenance - Machinery and Equipment' => [
                'Computer Cleaning Service',
                'Printer Maintenance',
            ],
            'Repair and Maintenance - Transportation Equipment' => [
                'Vehicle Maintenance',
                'Fuel System Service',
            ],
            'Repair and Maintenance - Furniture and Fixtures' => [
                'Furniture Repair',
                'Fixture Replacement',
            ],
            'Repair and Maintenance - Leased Assets' => [
                'Leased Equipment Maintenance',
                'Leasehold Improvements',
            ],
            'Repair and Maintenance - Leased Assets Improvements' => [
                'Leased Asset Upgrade',
                'Improvement Works',
            ],
            'Repair and Maintenance - Other Property, Plant & Equipment' => [
                'Equipment Calibration',
                'Tool Maintenance',
            ],
            'Subsidy to Other Local Government Units' => [
                'LGU Subsidy - Education',
                'LGU Subsidy - Health',
            ],
            'Subsidy to Other Funds' => [
                'Special Fund Transfer',
                'Trust Fund Contribution',
            ],
            'Subsidy to General Fund Proper/Special accounts' => [
                'General Fund Support',
                'Special Account Transfer',
            ],
            'Subsidy to Local Economic Enterprise / Public Utilities' => [
                'Utility Subsidy',
                'Enterprise Support',
            ],
            'Subsidy - Others' => [
                'Miscellaneous Subsidy',
                'Special Assistance',
            ],
            'Transfers of Unspent Current Year DRRM funds to Trust Fund' => [
                'DRRM Fund Transfer',
                'Trust Fund Allocation',
            ],
            'Transfers for Project Equity Share / LGU Counterpart' => [
                'Project Equity Share',
                'LGU Counterpart Fund',
            ],
            'Taxes, Duties and Licenses' => [
                'Business Permit Fee',
                'Property Tax',
            ],
            'Fidelity Bond Premiums' => [
                'Fidelity Bond Payment',
                'Insurance Premium',
            ],
            'Insurance Expenses' => [
                'Fire Insurance Premium',
                'Liability Insurance',
            ],
            'Advertising Expenses' => [
                'Newspaper Advertisement',
                'Online Advertising',
            ],
            'Printing and Publication Expenses' => [
                'Annual Report Printing',
                'Newsletter Publication',
            ],
            'Representation Expenses (ex. meals and snacks)' => [
                'Business Meeting Meals',
                'Office Snacks',
            ],
            'Transportation and Delivery Expenses' => [
                'Office Delivery Service',
                'Transportation Service',
            ],
            'Rent Expense' => ['Office Space Rental', 'Equipment Rental'],
            'Membership Dues & Cont. To Organization' => [
                'Professional Membership',
                'Association Dues',
            ],
            'Subscription Expenses' => [
                'Journal Subscription',
                'Software Subscription',
            ],
            'Donations' => ['Charitable Donation', 'Community Support'],
            'Other Maintenance and Operating Expenses' => [
                'Miscellaneous Expense',
                'Contingency Fund',
            ],
        ];

        return $descriptions[$accountTitle] ?? [
            $accountTitle . ' - Item 1',
            $accountTitle . ' - Item 2',
        ];
    }

    private function getUnitAndPrice($accountTitle, $variant)
    {
        $unitsAndPrices = [
            'Traveling Expenses - Local' => [
                ['unit' => 'day', 'price' => 500.0],
                ['unit' => 'day', 'price' => 800.0],
            ],
            'Traveling Expenses - Foreign' => [
                ['unit' => 'trip', 'price' => 15000.0],
                ['unit' => 'night', 'price' => 3500.0],
            ],
            'Training Expenses' => [
                ['unit' => 'set', 'price' => 350.0],
                ['unit' => 'day', 'price' => 3000.0],
            ],
            'Scholarship Grants/Expenses' => [
                ['unit' => 'semester', 'price' => 25000.0],
                ['unit' => 'year', 'price' => 5000.0],
            ],
            'Office Supplies Expenses' => [
                ['unit' => 'pcs', 'price' => 15.0],
                ['unit' => 'ream', 'price' => 250.0],
            ],
            'Accountable Forms Expenses' => [
                ['unit' => 'book', 'price' => 150.0],
                ['unit' => 'set', 'price' => 200.0],
            ],
            'Non-Accountable Forms Expenses' => [
                ['unit' => 'pad', 'price' => 50.0],
                ['unit' => 'set', 'price' => 100.0],
            ],
            'Animal/Zoological Supplies Expenses' => [
                ['unit' => 'sack', 'price' => 1200.0],
                ['unit' => 'bottle', 'price' => 350.0],
            ],
            'Food Supplies Expenses' => [
                ['unit' => 'sack', 'price' => 2000.0],
                ['unit' => 'case', 'price' => 800.0],
            ],
            'Welfare Goods Expenses' => [
                ['unit' => 'pack', 'price' => 500.0],
                ['unit' => 'kit', 'price' => 300.0],
            ],
            'Drugs and Medicines Expenses' => [
                ['unit' => 'box', 'price' => 150.0],
                ['unit' => 'tube', 'price' => 80.0],
            ],
            'Medical, Dental and Laboratory Supplies Expenses' => [
                ['unit' => 'box', 'price' => 250.0],
                ['unit' => 'piece', 'price' => 15.0],
            ],
            'Fuel, Oil and Lubricants Expenses' => [
                ['unit' => 'liter', 'price' => 65.0],
                ['unit' => 'liter', 'price' => 180.0],
            ],
            'Agricultural and Marine Supplies Expenses' => [
                ['unit' => 'bag', 'price' => 1500.0],
                ['unit' => 'piece', 'price' => 2500.0],
            ],
            'Textbooks and Instructional Materials Expenses' => [
                ['unit' => 'piece', 'price' => 450.0],
                ['unit' => 'piece', 'price' => 180.0],
            ],
            'Military, Police and Traffic Supplies Expenses' => [
                ['unit' => 'set', 'price' => 3500.0],
                ['unit' => 'piece', 'price' => 800.0],
            ],
            'Chemical and Filtering Supplies Expenses' => [
                ['unit' => 'gallon', 'price' => 250.0],
                ['unit' => 'piece', 'price' => 1200.0],
            ],
            'Semi-Expendable Machinery and Equipment Expenses' => [
                ['unit' => 'unit', 'price' => 15000.0],
                ['unit' => 'unit', 'price' => 8000.0],
            ],
            'Semi-Expendable Furniture, Fixtures and Books Expenses' => [
                ['unit' => 'piece', 'price' => 2500.0],
                ['unit' => 'piece', 'price' => 1800.0],
            ],
            'Other Supplies and Materials Expenses' => [
                ['unit' => 'set', 'price' => 500.0],
                ['unit' => 'set', 'price' => 750.0],
            ],
            'Water Expenses' => [
                ['unit' => 'cubic_meter', 'price' => 35.0],
                ['unit' => 'service', 'price' => 1500.0],
            ],
            'Electricity Expenses' => [
                ['unit' => 'kwh', 'price' => 12.0],
                ['unit' => 'service', 'price' => 2000.0],
            ],
            'Postage and Courier Services' => [
                ['unit' => 'set', 'price' => 100.0],
                ['unit' => 'delivery', 'price' => 150.0],
            ],
            'Telephone Expenses' => [
                ['unit' => 'month', 'price' => 800.0],
                ['unit' => 'minute', 'price' => 5.0],
            ],
            'Internet Subscription Expenses' => [
                ['unit' => 'month', 'price' => 2999.0],
                ['unit' => 'unit', 'price' => 2500.0],
            ],
            'Cable, Satellite, Telegraph and Radio Expenses' => [
                ['unit' => 'month', 'price' => 1500.0],
                ['unit' => 'month', 'price' => 2000.0],
            ],
            'Awards and Rewards Expenses' => [
                ['unit' => 'piece', 'price' => 2000.0],
                ['unit' => 'piece', 'price' => 5000.0],
            ],
            'Prizes' => [
                ['unit' => 'piece', 'price' => 1000.0],
                ['unit' => 'piece', 'price' => 500.0],
            ],
            'Survey Expenses' => [
                ['unit' => 'set', 'price' => 2000.0],
                ['unit' => 'service', 'price' => 5000.0],
            ],
            'Research, Exploration and Development Expense' => [
                ['unit' => 'project', 'price' => 10000.0],
                ['unit' => 'day', 'price' => 1500.0],
            ],
            'Demolition and Relocation Expenses' => [
                ['unit' => 'service', 'price' => 25000.0],
                ['unit' => 'family', 'price' => 10000.0],
            ],
            'Desilting and Dredging Expenses' => [
                ['unit' => 'service', 'price' => 50000.0],
                ['unit' => 'service', 'price' => 75000.0],
            ],
            'Generation, Transmission and Distribution Expenses' => [
                ['unit' => 'month', 'price' => 15000.0],
                ['unit' => 'service', 'price' => 10000.0],
            ],
            'Confidential Expenses' => [
                ['unit' => 'month', 'price' => 5000.0],
                ['unit' => 'operation', 'price' => 10000.0],
            ],
            'Intelligence Expenses' => [
                ['unit' => 'month', 'price' => 8000.0],
                ['unit' => 'piece', 'price' => 15000.0],
            ],
            'Extraordinary and Miscellaneous Expenses' => [
                ['unit' => 'fund', 'price' => 50000.0],
                ['unit' => 'fund', 'price' => 100000.0],
            ],
            'Legal Services' => [
                ['unit' => 'hour', 'price' => 2000.0],
                ['unit' => 'document', 'price' => 500.0],
            ],
            'Auditing Services' => [
                ['unit' => 'service', 'price' => 25000.0],
                ['unit' => 'review', 'price' => 15000.0],
            ],
            'Consultancy Services' => [
                ['unit' => 'hour', 'price' => 3000.0],
                ['unit' => 'project', 'price' => 50000.0],
            ],
            'Other Professional Services' => [
                ['unit' => 'service', 'price' => 10000.0],
                ['unit' => 'service', 'price' => 15000.0],
            ],
            'Environmental/Sanitary Services' => [
                ['unit' => 'month', 'price' => 8000.0],
                ['unit' => 'service', 'price' => 5000.0],
            ],
            'Janitorial Services' => [
                ['unit' => 'month', 'price' => 5000.0],
                ['unit' => 'month', 'price' => 2000.0],
            ],
            'Security Services' => [
                ['unit' => 'month', 'price' => 12000.0],
                ['unit' => 'quarter', 'price' => 3000.0],
            ],
            'Other General Services' => [
                ['unit' => 'month', 'price' => 3000.0],
                ['unit' => 'service', 'price' => 5000.0],
            ],
            'Repair and Maintenance - Investment Property' => [
                ['unit' => 'service', 'price' => 10000.0],
                ['unit' => 'month', 'price' => 2000.0],
            ],
            'Repair and Maintenance - Land Improvements' => [
                ['unit' => 'service', 'price' => 15000.0],
                ['unit' => 'month', 'price' => 3000.0],
            ],
            'Repair and Maintenance - Infrastructure Asset' => [
                ['unit' => 'service', 'price' => 50000.0],
                ['unit' => 'month', 'price' => 8000.0],
            ],
            'Repair and Maintenance - Buildings and Other Structures' => [
                ['unit' => 'service', 'price' => 5000.0],
                ['unit' => 'sq_meter', 'price' => 150.0],
            ],
            'Repair and Maintenance - Machinery and Equipment' => [
                ['unit' => 'unit', 'price' => 500.0],
                ['unit' => 'service', 'price' => 1500.0],
            ],
            'Repair and Maintenance - Transportation Equipment' => [
                ['unit' => 'service', 'price' => 3000.0],
                ['unit' => 'service', 'price' => 5000.0],
            ],
            'Repair and Maintenance - Furniture and Fixtures' => [
                ['unit' => 'piece', 'price' => 800.0],
                ['unit' => 'service', 'price' => 1200.0],
            ],
            'Repair and Maintenance - Leased Assets' => [
                ['unit' => 'service', 'price' => 2000.0],
                ['unit' => 'month', 'price' => 500.0],
            ],
            'Repair and Maintenance - Leased Assets Improvements' => [
                ['unit' => 'project', 'price' => 15000.0],
                ['unit' => 'service', 'price' => 8000.0],
            ],
            'Repair and Maintenance - Other Property, Plant & Equipment' => [
                ['unit' => 'service', 'price' => 1000.0],
                ['unit' => 'service', 'price' => 2000.0],
            ],
            'Subsidy to Other Local Government Units' => [
                ['unit' => 'grant', 'price' => 100000.0],
                ['unit' => 'grant', 'price' => 50000.0],
            ],
            'Subsidy to Other Funds' => [
                ['unit' => 'transfer', 'price' => 200000.0],
                ['unit' => 'transfer', 'price' => 100000.0],
            ],
            'Subsidy to General Fund Proper/Special accounts' => [
                ['unit' => 'transfer', 'price' => 150000.0],
                ['unit' => 'transfer', 'price' => 75000.0],
            ],
            'Subsidy to Local Economic Enterprise / Public Utilities' => [
                ['unit' => 'subsidy', 'price' => 300000.0],
                ['unit' => 'subsidy', 'price' => 150000.0],
            ],
            'Subsidy - Others' => [
                ['unit' => 'payment', 'price' => 25000.0],
                ['unit' => 'payment', 'price' => 50000.0],
            ],
            'Transfers of Unspent Current Year DRRM funds to Trust Fund' => [
                ['unit' => 'transfer', 'price' => 500000.0],
                ['unit' => 'transfer', 'price' => 1000000.0],
            ],
            'Transfers for Project Equity Share / LGU Counterpart' => [
                ['unit' => 'share', 'price' => 750000.0],
                ['unit' => 'share', 'price' => 1500000.0],
            ],
            'Taxes, Duties and Licenses' => [
                ['unit' => 'year', 'price' => 5000.0],
                ['unit' => 'piece', 'price' => 2000.0],
            ],
            'Fidelity Bond Premiums' => [
                ['unit' => 'year', 'price' => 10000.0],
                ['unit' => 'policy', 'price' => 15000.0],
            ],
            'Insurance Expenses' => [
                ['unit' => 'year', 'price' => 25000.0],
                ['unit' => 'policy', 'price' => 35000.0],
            ],
            'Advertising Expenses' => [
                ['unit' => 'placement', 'price' => 5000.0],
                ['unit' => 'campaign', 'price' => 15000.0],
            ],
            'Printing and Publication Expenses' => [
                ['unit' => 'copy', 'price' => 50.0],
                ['unit' => 'issue', 'price' => 10000.0],
            ],
            'Representation Expenses (ex. meals and snacks)' => [
                ['unit' => 'meal', 'price' => 500.0],
                ['unit' => 'event', 'price' => 2000.0],
            ],
            'Transportation and Delivery Expenses' => [
                ['unit' => 'trip', 'price' => 300.0],
                ['unit' => 'delivery', 'price' => 500.0],
            ],
            'Rent Expense' => [
                ['unit' => 'month', 'price' => 15000.0],
                ['unit' => 'month', 'price' => 8000.0],
            ],
            'Membership Dues & Cont. To Organization' => [
                ['unit' => 'year', 'price' => 3000.0],
                ['unit' => 'year', 'price' => 5000.0],
            ],
            'Subscription Expenses' => [
                ['unit' => 'year', 'price' => 2000.0],
                ['unit' => 'month', 'price' => 500.0],
            ],
            'Donations' => [
                ['unit' => 'donation', 'price' => 10000.0],
                ['unit' => 'donation', 'price' => 25000.0],
            ],
            'Other Maintenance and Operating Expenses' => [
                ['unit' => 'item', 'price' => 1000.0],
                ['unit' => 'fund', 'price' => 5000.0],
            ],
        ];

        return $unitsAndPrices[$accountTitle][$variant - 1] ?? [
            'unit' => 'piece',
            'price' => 100.0,
        ];
    }

    /**
     * Create a mapping of category names to IDs
     */
    private function createCategoryMap($categories)
    {
        $map = [];
        foreach ($categories as $category) {
            $map[strtolower($category->name)] = $category->id;
        }
        return $map;
    }

    /**
     * Get the appropriate category ID for an account title
     */
    private function getCategoryIdForAccount($accountTitle, $categoryMap, $categories)
    {
        // Map account titles to categories based on keywords
        $accountTitleLower = strtolower($accountTitle);

        // Advertising
        if (str_contains($accountTitleLower, 'advertising')) {
            return $categoryMap['advertising'] ?? $categories->first()->id;
        }

        // Office Supplies
        if (str_contains($accountTitleLower, 'office supplies')) {
            return $categoryMap['office supplies'] ?? $categories->first()->id;
        }

        // Accountable Forms
        if (str_contains($accountTitleLower, 'accountable forms')) {
            return $categoryMap['accountable forms'] ?? $categories->first()->id;
        }

        // Computer Supplies
        if (str_contains($accountTitleLower, 'computer') || 
            str_contains($accountTitleLower, 'internet') ||
            str_contains($accountTitleLower, 'software')) {
            return $categoryMap['computer supplies'] ?? $categories->first()->id;
        }

        // Electrical Supplies/Tools/Equipment
        if (str_contains($accountTitleLower, 'electrical')) {
            if (str_contains($accountTitleLower, 'supplies')) {
                return $categoryMap['electrical supplies'] ?? $categories->first()->id;
            } elseif (str_contains($accountTitleLower, 'tools')) {
                return $categoryMap['electrical tools'] ?? $categories->first()->id;
            } elseif (str_contains($accountTitleLower, 'equipment')) {
                return $categoryMap['electrical equipment'] ?? $categories->first()->id;
            }
        }

        // Fuel, Oil, and Lubricants
        if (str_contains($accountTitleLower, 'fuel') || 
            str_contains($accountTitleLower, 'oil') ||
            str_contains($accountTitleLower, 'lubricant')) {
            return $categoryMap['fuel, oil, and lubricants'] ?? $categories->first()->id;
        }

        // Janitorial Supplies
        if (str_contains($accountTitleLower, 'janitorial') ||
            str_contains($accountTitleLower, 'cleaning')) {
            return $categoryMap['janitorial supplies'] ?? $categories->first()->id;
        }

        // Gardening Supplies & Tools
        if (str_contains($accountTitleLower, 'gardening') ||
            str_contains($accountTitleLower, 'landscaping')) {
            return $categoryMap['gardening supplies & tools'] ?? $categories->first()->id;
        }

        // Plumbing Supplies/Tools
        if (str_contains($accountTitleLower, 'plumbing')) {
            if (str_contains($accountTitleLower, 'supplies')) {
                return $categoryMap['plumbing supplies'] ?? $categories->first()->id;
            } elseif (str_contains($accountTitleLower, 'tools')) {
                return $categoryMap['plumbing tools'] ?? $categories->first()->id;
            }
        }

        // Printing & Publication
        if (str_contains($accountTitleLower, 'printing') ||
            str_contains($accountTitleLower, 'publication')) {
            return $categoryMap['printing & publication'] ?? $categories->first()->id;
        }

        // Postage & Courier Service
        if (str_contains($accountTitleLower, 'postage') ||
            str_contains($accountTitleLower, 'courier')) {
            return $categoryMap['postage & courier service'] ?? $categories->first()->id;
        }

        // Meals and Snacks
        if (str_contains($accountTitleLower, 'meals') ||
            str_contains($accountTitleLower, 'snacks') ||
            str_contains($accountTitleLower, 'food') ||
            str_contains($accountTitleLower, 'representation')) {
            return $categoryMap['meals and snacks (other offices)'] ?? $categories->first()->id;
        }

        // Trophies, Plaques & Medals
        if (str_contains($accountTitleLower, 'trophy') ||
            str_contains($accountTitleLower, 'plaque') ||
            str_contains($accountTitleLower, 'medal') ||
            str_contains($accountTitleLower, 'award') ||
            str_contains($accountTitleLower, 'prize')) {
            return $categoryMap['trophies, plaques & medals'] ?? $categories->first()->id;
        }

        // Sports Supplies
        if (str_contains($accountTitleLower, 'sports')) {
            return $categoryMap['sports supplies'] ?? $categories->first()->id;
        }

        // Tokens/Souvenirs
        if (str_contains($accountTitleLower, 'token') ||
            str_contains($accountTitleLower, 'souvenir')) {
            return $categoryMap['tokens/souvenirs'] ?? $categories->first()->id;
        }

        // General Welfare Goods
        if (str_contains($accountTitleLower, 'welfare') ||
            str_contains($accountTitleLower, 'relief')) {
            return $categoryMap['general welfare goods'] ?? $categories->first()->id;
        }

        // ICT Equipment
        if (str_contains($accountTitleLower, 'ict') ||
            str_contains($accountTitleLower, 'technology') ||
            str_contains($accountTitleLower, 'communication')) {
            return $categoryMap['ict equipment'] ?? $categories->first()->id;
        }

        // Carpentry related
        if (str_contains($accountTitleLower, 'carpentry')) {
            if (str_contains($accountTitleLower, 'tools') || str_contains($accountTitleLower, 'equipment')) {
                return $categoryMap['carpentry tools and equipment'] ?? $categories->first()->id;
            } elseif (str_contains($accountTitleLower, 'supplies')) {
                return $categoryMap['carpentry supplies'] ?? $categories->first()->id;
            }
        }

        // Beverages
        if (str_contains($accountTitleLower, 'beverage')) {
            return $categoryMap['beverages'] ?? $categories->first()->id;
        }

        return $categoryMap['office supplies'] ?? $categories->first()->id; // Default to first category or office supplies
    }
}
