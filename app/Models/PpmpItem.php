<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'ppmp_header_id',
        'ppmp_price_list_id',
        'quantity',
        'unit_price',
        'total_amount',
        'specifications',
        'jan_qty', 'jan_amount',
        'feb_qty', 'feb_amount',
        'mar_qty', 'mar_amount',
        'apr_qty', 'apr_amount',
        'may_qty', 'may_amount',
        'jun_qty', 'jun_amount',
        'jul_qty', 'jul_amount',
        'aug_qty', 'aug_amount',
        'sep_qty', 'sep_amount',
        'oct_qty', 'oct_amount',
        'nov_qty', 'nov_amount',
        'dec_qty', 'dec_amount',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'jan_amount' => 'decimal:2',
        'feb_amount' => 'decimal:2',
        'mar_amount' => 'decimal:2',
        'apr_amount' => 'decimal:2',
        'may_amount' => 'decimal:2',
        'jun_amount' => 'decimal:2',
        'jul_amount' => 'decimal:2',
        'aug_amount' => 'decimal:2',
        'sep_amount' => 'decimal:2',
        'oct_amount' => 'decimal:2',
        'nov_amount' => 'decimal:2',
        'dec_amount' => 'decimal:2',
    ];

    public function ppmpHeader()
    {
        return $this->belongsTo(PpmpHeader::class);
    }

    public function ppmpPriceList()
    {
        return $this->belongsTo(PpmpPriceList::class);
    }

    public function scopeByPpmpHeader($query, $ppmpHeaderId)
    {
        return $query->where('ppmp_header_id', $ppmpHeaderId);
    }

    public function getTotalAnnualQuantityAttribute()
    {
        return $this->jan_qty + $this->feb_qty + $this->mar_qty + 
               $this->apr_qty + $this->may_qty + $this->jun_qty + 
               $this->jul_qty + $this->aug_qty + $this->sep_qty + 
               $this->oct_qty + $this->nov_qty + $this->dec_qty;
    }

    public function getTotalAnnualAmountAttribute()
    {
        return $this->jan_amount + $this->feb_amount + $this->mar_amount + 
               $this->apr_amount + $this->may_amount + $this->jun_amount + 
               $this->jul_amount + $this->aug_amount + $this->sep_amount + 
               $this->oct_amount + $this->nov_amount + $this->dec_amount;
    }
}
