<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpaItemizedCost extends Model
{
    /** @use HasFactory<\Database\Factories\PpaItemizedCostFactory> */
    use HasFactory;

    protected $fillable = [
        'aip_entry_id',
        'account_code',
        'item_description',
        'quantity',
        'unit_cost',
        'amount',
    ];

    // Add this to handle Decimals correctly in PHP
    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_cost' => 'decimal:2',
        'amount' => 'decimal:2',
    ];

    public function aipEntry()
    {
        return $this->belongsTo(AipEntry::class, 'aip_entry_id');
    }

    public function chartOfAccount()
    {
        return $this->belongsTo(
            ChartOfAccount::class,
            'account_code',
            'account_code',
        );
    }

    protected static function booted()
    {
        // STEP 1: Calculate own amount BEFORE saving to DB
        static::saving(function ($item) {
            $item->amount = $item->quantity * $item->unit_cost;
        });

        // STEP 2: Tell parent to refresh totals AFTER saving to DB
        static::saved(function ($item) {
            $item->aipEntry->calculateTotals();
        });

        static::deleted(function ($item) {
            $item->aipEntry->calculateTotals();
        });
    }
}
