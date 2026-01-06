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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();

            // The COA Code (e.g., 5-02-03-010)
            $table->string('code', 20)->unique();

            // The Description (e.g., Office Supplies Expenses)
            $table->string('name');

            // Normal Balance (Debit/Credit) - from the COA text
            $table->enum('normal_balance', ['DEBIT', 'CREDIT']);

            // Link to Budget Bucket (Nullable for Income/Assets)
            $table
                ->foreignId('expense_class_id')
                ->nullable()
                ->constrained('expense_classes');

            // To categorize Income (Tax, Non-Tax, IRA) or Expense Hierarchy
            // You can use a parent_id for hierarchy or a type string
            $table->string('account_type')->default('EXPENSE'); // ASSET, LIABILITY, EQUITY, INCOME, EXPENSE

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
