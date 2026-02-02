<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ppmp extends Model
{
    /** @use HasFactory<\Database\Factories\PpmpFactory> */
    use HasFactory;

    protected $fillable = [
        'aip_entry_id',
        'ppmp_price_list_id',
        'quantity',
        'jan_qty',
        'jan_amount',
        'feb_qty',
        'feb_amount',
        'mar_qty',
        'mar_amount',
        'apr_qty',
        'apr_amount',
        'may_qty',
        'may_amount',
        'jun_qty',
        'jun_amount',
        'jul_qty',
        'jul_amount',
        'aug_qty',
        'aug_amount',
        'sep_qty',
        'sep_amount',
        'oct_qty',
        'oct_amount',
        'nov_qty',
        'nov_amount',
        'dec_qty',
        'dec_amount',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'jan_qty' => 'decimal:2',
        'jan_amount' => 'decimal:2',
        'feb_qty' => 'decimal:2',
        'feb_amount' => 'decimal:2',
        'mar_qty' => 'decimal:2',
        'mar_amount' => 'decimal:2',
        'apr_qty' => 'decimal:2',
        'apr_amount' => 'decimal:2',
        'may_qty' => 'decimal:2',
        'may_amount' => 'decimal:2',
        'jun_qty' => 'decimal:2',
        'jun_amount' => 'decimal:2',
        'jul_qty' => 'decimal:2',
        'jul_amount' => 'decimal:2',
        'aug_qty' => 'decimal:2',
        'aug_amount' => 'decimal:2',
        'sep_qty' => 'decimal:2',
        'sep_amount' => 'decimal:2',
        'oct_qty' => 'decimal:2',
        'oct_amount' => 'decimal:2',
        'nov_qty' => 'decimal:2',
        'nov_amount' => 'decimal:2',
        'dec_qty' => 'decimal:2',
        'dec_amount' => 'decimal:2',
    ];

    protected $appends = ['total_amount', 'item_description', 'unit', 'unit_price', 'expense_account_id'];

    public function aipEntry()
    {
        return $this->belongsTo(AipEntry::class);
    }

    public function ppmpPriceList()
    {
        return $this->belongsTo(PpmpPriceList::class);
    }

    // Accessor for item description from price list
    public function getItemDescriptionAttribute()
    {
        return $this->ppmpPriceList?->description ?? 'Custom Item';
    }

    // Accessor for unit from price list
    public function getUnitAttribute()
    {
        return $this->ppmpPriceList?->unit_of_measurement ?? 'unit';
    }

    // Accessor for unit price from price list
    public function getUnitPriceAttribute()
    {
        return $this->ppmpPriceList?->price ?? 0;
    }

    // Accessor for total amount - sum of all monthly amounts
    public function getTotalAmountAttribute()
    {
        return (float) $this->jan_amount + 
               (float) $this->feb_amount + 
               (float) $this->mar_amount + 
               (float) $this->apr_amount + 
               (float) $this->may_amount + 
               (float) $this->jun_amount + 
               (float) $this->jul_amount + 
               (float) $this->aug_amount + 
               (float) $this->sep_amount + 
               (float) $this->oct_amount + 
               (float) $this->nov_amount + 
               (float) $this->dec_amount;
    }

    // Accessor for chart of account from price list
    public function getExpenseAccountIdAttribute()
    {
        return $this->ppmpPriceList?->chart_of_account_id;
    }
}
