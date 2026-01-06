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
        Schema::create('offices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sector_id')->nullable()->constrained('sectors');
            $table
                ->foreignId('lgu_level_id')
                ->constrained('lgu_levels')
                ->cascadeOnDelete();
            $table
                ->foreignId('office_type_id')
                ->constrained('office_types')
                ->cascadeOnDelete();
            $table->string('code', 3);
            $table->string('name');
            $table->boolean('is_lee')->default(false);
            $table->timestamps();

            $table->unique(['lgu_level_id', 'office_type_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};
