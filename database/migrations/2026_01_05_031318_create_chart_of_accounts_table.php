<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();

            // The 8-digit code (e.g., "5-02-03-010")
            // Stored as string to keep leading zeros and structure
            $table->string('code')->unique();

            // The Account Title (e.g., "Office Supplies Expenses")
            $table->string('title');

            // 1=Assets, 2=Liabilities, 3=Equity, 4=Income, 5=Expenses
            $table->tinyInteger('account_group');

            // Derived from the Circular's hierarchy
            $table->string('major_account_group'); // e.g., "02" (MOOE)
            $table->string('sub_major_account_group'); // e.g., "03" (Supplies)
            $table->string('general_ledger_account'); // e.g., "010"

            // Essential for Budgeting (LBP Forms), derived via logic
            // Values: 'PS', 'MOOE', 'FE', 'CO', 'INCOME', 'NON-CASH'
            $table->string('allotment_class')->nullable()->index();

            // From Annex B (Debit/Credit) - Important for validation later
            $table->string('normal_balance')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chart_of_accounts');
    }
};
