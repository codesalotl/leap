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
        Schema::create('signatories', function (Blueprint $table) {
            $table->id();

            // 1. Link to the Office (Where do they work?)
            $table
                ->foreignId('office_id')
                ->constrained('offices')
                ->cascadeOnDelete();

            // 2. Link to the User (Who are they?)
            $table
                ->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // 3. The Official Title (Appears on Reports)
            // e.g., "City Budget Officer", "OIC-Municipal Treasurer"
            $table->string('designation');

            // 4. Role Flag
            // Is this the Head of Office? (Only the Head can submit the Budget)
            $table->boolean('is_head')->default(false);

            // 5. Active Status (Crucial for History)
            // When a new Mayor is elected, set the old one to false, create new row.
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // 6. Audit Trail
            // Essential for government records history.
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signatories');
    }
};
