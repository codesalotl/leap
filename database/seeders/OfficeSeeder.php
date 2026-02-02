<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Office;
use Illuminate\Support\Facades\Schema;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to truncate safely, then re-enable
        // Schema::disableForeignKeyConstraints();
        // Office::truncate();
        // Schema::enableForeignKeyConstraints();

        $offices = [
            // 1
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Office of the Provincial Governor',
                'acronym' => 'OPG',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'OPG - Security Services Unit',
                'acronym' => 'OPG-SSU',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '003',
                'name' => 'OPG - Internal Audit Services Unit',
                'acronym' => 'OPG-IASU',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '004',
                'name' => 'OPG - Bids and Awards Committee Support Unit',
                'acronym' => 'OPG-BACSU',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'OPG - La Union Provincial Jail',
                'acronym' => 'OPG-JAIL',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Office of the Provincial Administrator',
                'acronym' => 'OPADMIN',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '007',
                'name' =>
                    'Provincial Human Resource Mangement and Development Office',
                'acronym' => 'PHRMDO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Office of the Vice Governor',
                'acronym' => 'OVG',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '009',
                'name' => 'Office of the Sangguniang Panlalawigan',
                'acronym' => 'OSP',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '010',
                'name' => 'Provincial Information Office',
                'acronym' => 'PIO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '011',
                'name' =>
                    'Provincial Information and Communications Technology Office',
                'acronym' => 'PICTO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '012',
                'name' =>
                    'Office of the Provincial Planning and Development Coordinator',
                'acronym' => 'PPDC',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '013',
                'name' => 'Office Provincial General Services Officer',
                'acronym' => 'PGSO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '014',
                'name' => 'Provincial Legal Office',
                'acronym' => 'PLO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '015',
                'name' => 'Provincial Budget Office',
                'acronym' => 'PBO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '016',
                'name' => 'Office of the Provincial Accountant',
                'acronym' => 'OPACC',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '017',
                'name' => 'Provincial Treasurer\'s Office',
                'acronym' => 'PTO',
            ],
            [
                'sector_id' => 1,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '018',
                'name' => 'Office of the Provincial Assessor',
                'acronym' => 'OPASS',
            ],

            // 3
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'La Union Provincial Tourism Office',
                'acronym' => 'LUPTO',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Office of the Provincial Agriculturist',
                'acronym' => 'OPAG',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '003',
                'name' => 'OPG - Provincial Cooperative Development Office',
                'acronym' => 'OPG-PCDO',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '004',
                'name' => 'Office of the Provincial Veterinarian',
                'acronym' => 'OPVET',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Provincial Engineering Office',
                'acronym' => 'PEO',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '006',
                'name' =>
                    'Local Economic Enterprise and Investments Promotion Office',
                'acronym' => 'LEEIPO',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '007',
                'name' =>
                    'Provincial Government Environment and Natural Resource Office',
                'acronym' => 'PG-ENRO',
            ],
            [
                'sector_id' => 3,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '008',
                'name' =>
                    'Provincial Disaster Risk Reduction and Management Office',
                'acronym' => 'PDRRMO',
            ],

            // 2
            [
                'sector_id' => 2,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Provincial Social Welfare and Development Office',
                'acronym' => 'PSWDO',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '002',
                'name' =>
                    'Provincial Youth, Education, Sports Development Office',
                'acronym' => 'PYESDO',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '003',
                'name' => 'OPG - Public Employment Services Office',
                'acronym' => 'OPG-PESO',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '004',
                'name' => 'Provincial Health Office',
                'acronym' => 'PHO',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 1,
                'office_type_id' => 2,
                'code' => '005',
                'name' => 'OPG - Gender and Development Office',
                'acronym' => 'OPG-GAD',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '006',
                'name' => 'Naguilian District Hospital',
                'acronym' => 'NDH',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'Rosario District Hospital',
                'acronym' => 'RDH',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '008',
                'name' => 'Bacnotan District Hospital',
                'acronym' => 'BCDH',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '009',
                'name' => 'Balaoan District Hospital',
                'acronym' => 'BLDH',
            ],
            [
                'sector_id' => 2,
                'lgu_level_id' => 3,
                'office_type_id' => 1,
                'code' => '010',
                'name' => 'Caba District Hospital',
                'acronym' => 'CDH',
            ],

            // 4
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '001',
                'name' => 'Special Purpose Appropriation',
                'acronym' => 'SPA',
            ],
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '002',
                'name' => 'Special Education Fund',
                'acronym' => 'SEF',
            ],
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '003',
                'name' => '20% Development Fund',
                'acronym' => 'DF',
            ],
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '004',
                'name' => 'RA 7171 / 8240',
                'acronym' => null,
            ],
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '005',
                'name' => 'Trust Fund',
                'acronym' => 'TF',
            ],
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '006',
                'name' => '5% LDRRMF',
                'acronym' => null,
            ],
            [
                'sector_id' => 4,
                'lgu_level_id' => 1,
                'office_type_id' => 1,
                'code' => '007',
                'name' => 'GAD Fund',
                'acronym' => 'GADF',
            ],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
