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
            $table->string('aipRefCode');
            $table->string('ppaDescription');
            $table->string('implementingOfficeDepartmentLocation');
            $table->timestamp('startingDate');
            $table->timestamp('completionDate');
            $table->string('expectedOutputs');
            $table->string('fundingSource');
            $table->decimal('ps');
            $table->decimal('mooe');
            $table->decimal('fe');
            $table->decimal('co');
            $table->decimal('total');
            $table->string('ccAdaptation');
            $table->string('ccMitigation');
            $table->string('ccTypologyCode');
            $table->timestamps();
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
