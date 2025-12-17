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
        Schema::create('aip', function (Blueprint $table) {
            $table->id();
            $table->string('aipRefCode')->nullable();
            $table->string('ppaDescription')->nullable();
            $table->string('implementingOfficeDepartmentLocation')->nullable();
            $table->string('startingDate')->nullable();
            $table->string('completionDate')->nullable();
            $table->string('expectedOutputs')->nullable();
            $table->string('fundingSource')->nullable();
            $table->decimal('ps')->nullable();
            $table->decimal('mooe')->nullable();
            $table->decimal('fe')->nullable();
            $table->decimal('co')->nullable();
            $table->decimal('total')->nullable();
            $table->string('ccAdaptation')->nullable();
            $table->string('ccMitigation')->nullable();
            $table->string('ccTypologyCode')->nullable();
            $table
                ->foreignId('aip_collection_id')
                // ->after('id') // Optional: places it after the ID column
                ->nullable() // Keep it nullable if existing rows don't have a collection yet
                ->constrained('aip_collections');
            // ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aip');
    }
};
