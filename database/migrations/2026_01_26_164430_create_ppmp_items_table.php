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
        Schema::create('ppmp_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppmp_header_id')->constrained()->onDelete('cascade');
            $table->foreignId('ppmp_price_list_id')->constrained()->onDelete('cascade');
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_amount', 15, 2);
            $table->text('specifications')->nullable();
            $table->enum('jan_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('jan_amount', 15, 2)->default(0);
            $table->enum('feb_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('feb_amount', 15, 2)->default(0);
            $table->enum('mar_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('mar_amount', 15, 2)->default(0);
            $table->enum('apr_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('apr_amount', 15, 2)->default(0);
            $table->enum('may_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('may_amount', 15, 2)->default(0);
            $table->enum('jun_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('jun_amount', 15, 2)->default(0);
            $table->enum('jul_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('jul_amount', 15, 2)->default(0);
            $table->enum('aug_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('aug_amount', 15, 2)->default(0);
            $table->enum('sep_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('sep_amount', 15, 2)->default(0);
            $table->enum('oct_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('oct_amount', 15, 2)->default(0);
            $table->enum('nov_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('nov_amount', 15, 2)->default(0);
            $table->enum('dec_qty', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])->default(0);
            $table->decimal('dec_amount', 15, 2)->default(0);
            $table->timestamps();
            
            $table->index(['ppmp_header_id']);
            $table->index(['ppmp_price_list_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmp_items');
    }
};
