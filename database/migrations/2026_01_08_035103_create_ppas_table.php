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
        Schema::create('ppas', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('reference_code');
            $table->string('description');
            $table->unsignedBigInteger('parent_id')->nullable();
            // Link to your existing offices table
            $table->foreignId('office_id')->nullable()->constrained('offices');
            // To track the numbering (001, 002, etc.) within its own level
            $table->integer('sequence_number')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppas');
    }
};
