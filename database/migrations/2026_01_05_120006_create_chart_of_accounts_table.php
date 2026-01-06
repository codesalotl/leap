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
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();

            // The UACS Code (Indexed for search speed)
            $table->string('uacs_code', 20)->unique();

            // The Account Name
            $table->string('account_title');

            // Foreign Keys
            $table
                ->foreignId('account_group_id')
                ->constrained('account_groups')
                ->onDelete('restrict'); // Prevent deleting a group if accounts exist

            $table
                ->foreignId('allotment_class_id')
                ->constrained('allotment_classes')
                ->onDelete('restrict');

            // Hierarchy Logic (Self-referencing for Headers vs Items)
            $table->string('parent_code', 20)->nullable()->index();

            // Logic Flags
            $table->boolean('is_posting')->default(true); // FALSE = Folder/Header, TRUE = Selectable Item
            $table->boolean('is_active')->default(true); // For soft deletes

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chart_of_accounts');
    }
};
