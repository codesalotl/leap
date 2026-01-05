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

            // 1. Foreign Key to Sector (Annex C)
            // You still need this link for LBP Form 7 consolidation
            $table->foreignId('sector_id')->constrained('sectors');

            // 2. The Three Components of Annex D
            // Store these as Integers for easy math/logic, format as strings in the UI
            $table->tinyInteger('lgu_level_id'); // 1, 2, or 3
            $table->tinyInteger('office_type_id'); // 1 (Mandatory), 2 (Optional), 3 (Other)
            $table->integer('office_number'); // e.g., 1 (Governor), 5 (Treasurer)

            // 3. Metadata
            $table->string('title'); // "Office of the Provincial Treasurer"
            // $table->string('acronym'); // "PTO"

            // 4. Virtual/Generated Column (Optional but recommended)
            // Allows you to search "1-01-005" instantly
            $table
                ->string('full_code')
                ->virtualAs(
                    'CONCAT(lgu_level_id, "-0", office_type_id, "-", LPAD(office_number, 3, "0"))',
                );

            $table->timestamps();
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
