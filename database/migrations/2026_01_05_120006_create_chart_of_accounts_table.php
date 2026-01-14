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
            $table->string('uacs_code', 20)->unique();
            $table->string('account_title');
            // $table->string('parent_id', 20)->nullable()->index();
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->enum('account_group', [
                'Asset',
                'Liability',
                'Equity',
                'Income',
                'Expense',
            ]);
            $table
                ->enum('budget_class', ['PS', 'MOOE', 'FE', 'CO', 'Non-Budget'])
                ->nullable()
                ->index();
            $table->enum('normal_balance', ['Debit', 'Credit']);
            $table->integer('level')->default(1);
            $table->boolean('is_posting')->default(false); // FALSE = Folder/Header, TRUE = Selectable Item
            $table->boolean('is_active')->default(true); // For soft deletes
            $table->timestamps();

            // Foreign Key Constraint
            $table
                ->foreign('parent_id')
                ->references('id')
                ->on('chart_of_accounts')
                ->onDelete('restrict'); // Prevents deleting a parent if it has children
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
