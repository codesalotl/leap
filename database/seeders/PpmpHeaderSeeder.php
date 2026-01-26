<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PpmpHeader;
use App\Models\AipEntry;
use App\Models\Office;
use App\Models\User;

class PpmpHeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some sample data
        $aipEntry = AipEntry::first();
        $office = Office::first();
        $user = User::first();

        if (!$aipEntry || !$office || !$user) {
            $this->command->warn('Missing required data for PPMP Header seeder. Please run AIP, Office, and User seeders first.');
            return;
        }

        // Create sample PPMP Headers
        PpmpHeader::create([
            'aip_entry_id' => $aipEntry->id,
            'office_id' => $office->id,
            'procurement_type' => 'Goods',
            'procurement_method' => 'Shopping',
            'implementation_schedule' => '2025-03-15',
            'source_of_funds' => 'MOOE - Office Supplies',
            'approved_budget' => 50000.00,
            'status' => 'Draft',
            'created_by' => $user->id,
        ]);

        PpmpHeader::create([
            'aip_entry_id' => $aipEntry->id,
            'office_id' => $office->id,
            'procurement_type' => 'Services',
            'procurement_method' => 'Direct Purchase',
            'implementation_schedule' => '2025-04-20',
            'source_of_funds' => 'MOOE - Maintenance',
            'approved_budget' => 150000.00,
            'status' => 'Submitted',
            'created_by' => $user->id,
        ]);

        PpmpHeader::create([
            'aip_entry_id' => $aipEntry->id,
            'office_id' => $office->id,
            'procurement_type' => 'Civil Works',
            'procurement_method' => 'Public Bidding',
            'implementation_schedule' => '2025-06-01',
            'source_of_funds' => 'CO - Infrastructure',
            'approved_budget' => 2500000.00,
            'status' => 'Approved',
            'created_by' => $user->id,
        ]);
    }
}
