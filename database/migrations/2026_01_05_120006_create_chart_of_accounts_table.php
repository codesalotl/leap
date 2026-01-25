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

            // The RCA Code (e.g., 5-02-03-010)
            $table->string('account_code')->unique();

            // The Account Title (e.g., Office Supplies Expenses)
            $table->string('account_title');

            // Categorization as per BOM 2023
            // PS = Personal Services
            // MOOE = Maintenance and Other Operating Expenses
            // FE = Financial Expenses
            // CO = Capital Outlay
            $table->enum('expense_class', ['PS', 'MOOE', 'FE', 'CO'])->index();

            // Optional: Helps in grouping sub-items
            $table->string('parent_code')->nullable();

            // Boolean to determine if this account can be directly selected in a PPA
            // Some accounts are "Header" accounts (not for entry)
            $table->boolean('is_postable')->default(true);

            $table->boolean('is_active')->default(true);
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
