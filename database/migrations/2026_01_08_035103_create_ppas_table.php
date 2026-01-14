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
            $table->foreignId('office_id')->constrained('offices');

            // Self-referencing parent
            $table
                ->foreignId('parent_id')
                ->nullable()
                ->constrained('ppas') // Matches table name
                ->onDelete('cascade');

            $table->string('title');

            // Use an enum or string for strict types
            $table->enum('type', ['Program', 'Project', 'Activity']);

            // The suffix (e.g., 001).
            // We should probably ensure code_suffix is unique per office + parent_id
            $table->string('code_suffix', 4)->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Prevent duplicate suffixes for the same office/parent
            $table->unique(
                ['office_id', 'parent_id', 'code_suffix', 'type'],
                'ppa_unique_index',
            );
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
