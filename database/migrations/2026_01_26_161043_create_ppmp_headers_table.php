<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ppmp_headers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aip_entry_id')->constrained()->onDelete('cascade');
            $table->foreignId('office_id')->constrained()->onDelete('cascade');
            $table->enum('procurement_type', ['Goods', 'Services', 'Civil Works', 'Consulting']);
            $table->enum('procurement_method', ['Public Bidding', 'Direct Purchase', 'Shopping', 'Limited Source Bidding', 'Negotiated Procurement']);
            $table->date('implementation_schedule')->nullable();
            $table->string('source_of_funds')->nullable();
            $table->decimal('approved_budget', 15, 2);
            $table->enum('status', ['Draft', 'Submitted', 'Approved', 'Rejected'])->default('Draft');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            $table->index(['aip_entry_id']);
            $table->index(['office_id']);
            $table->index(['status']);
            $table->index(['procurement_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppmp_headers');
    }
};
