<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpPriceList extends Model
{
    /** @use HasFactory<\Database\Factories\PpmpPriceListFactory> */
    use HasFactory;

    protected $fillable = [
        'item_number',
        'description',
        'unit_of_measurement',
        'price',
        'chart_of_account_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class);
    }

    public function itemizedCosts()
    {
        return $this->hasMany(PpaItemizedCost::class, 'ppmp_price_list_id');
    }

    // public function scopeByExpenseClass($query, $expenseClass)
    // {
    //     return $query->where('expense_class', $expenseClass);
    // }

    // public function scopeByAccountCode($query, $accountCode)
    // {
    //     return $query->where('account_code', $accountCode);
    // }
}
