<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpPriceList extends Model
{
    /** @use HasFactory<\Database\Factories\PpmpPriceListFactory> */
    use HasFactory;

    protected $fillable = [
        'item_code', 'item_description', 'unit', 'unit_price',
        'expense_class', 'account_code', 'procurement_type', 'standard_specifications'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2'
    ];

    public function itemizedCosts()
    {
        return $this->hasMany(PpaItemizedCost::class, 'ppmp_price_list_id');
    }

    public function scopeByExpenseClass($query, $expenseClass)
    {
        return $query->where('expense_class', $expenseClass);
    }

    public function scopeByAccountCode($query, $accountCode)
    {
        return $query->where('account_code', $accountCode);
    }
}
