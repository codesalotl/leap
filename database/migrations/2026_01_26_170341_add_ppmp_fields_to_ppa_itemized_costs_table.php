<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ppa_itemized_costs', function (Blueprint $table) {
            $table->foreignId('ppmp_price_list_id')->nullable()->after('amount');
            $table->boolean('requires_procurement')->default(false)->after('ppmp_price_list_id');
            
            $table->index('ppmp_price_list_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppa_itemized_costs', function (Blueprint $table) {
            $table->dropIndex(['ppmp_price_list_id']);
            $table->dropColumn(['ppmp_price_list_id', 'requires_procurement']);
        });
    }
};
