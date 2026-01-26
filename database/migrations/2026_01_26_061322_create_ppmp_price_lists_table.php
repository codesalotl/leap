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
        Schema::create('ppmp_price_lists', function (Blueprint $table) {
            $table->id();
            $table->string('item_code', 50)->unique();
            $table->text('item_description');
            $table->string('unit', 20);
            $table->decimal('unit_price', 10, 2);
            $table->enum('expense_class', ['PS', 'MOOE', 'FE', 'CO']);
            $table->string('account_code', 20);
            $table->enum('procurement_type', ['Goods', 'Services', 'Civil Works', 'Consulting']);
            $table->text('standard_specifications')->nullable();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('item_code');
            $table->index('account_code');
            $table->index('expense_class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmp_price_lists');
    }
};
