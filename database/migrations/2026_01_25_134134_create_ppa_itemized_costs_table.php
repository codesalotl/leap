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
        Schema::create('ppa_itemized_costs', function (Blueprint $table) {
            $table->id();

            // Link to the Parent PPA in your AIP
            $table->foreignId('aip_entry_id')->constrained('aip_entries')->onDelete('cascade');

            // Link to the Chart of Accounts
            $table->string('account_code');
            $table
                ->foreign('account_code')
                ->references('account_code')
                ->on('chart_of_accounts');

            // Specific description (e.g., "Fuel for Ambulance" or "Bond paper for Secretariat")
            $table->string('item_description')->nullable();

            // Costing Basis (Optional but highly recommended for BOM compliance)
            $table->decimal('quantity', 15, 2)->default(1);
            $table->decimal('unit_cost', 15, 2)->default(0);

            // The calculated total for this specific line item
            $table->decimal('amount', 15, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppa_itemized_costs');
    }
};
