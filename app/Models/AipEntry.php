<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// Make sure this specific line is here:
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AipEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'fiscal_year_id',
        'ppa_id',
        'start_date',
        'end_date',
        'expected_output',
        'ps_amount',
        'mooe_amount',
        'fe_amount',
        'co_amount',
        'ccet_adaptation',
        'ccet_mitigation',
    ];

    protected $casts = [
        'ps_amount' => 'decimal:2',
        'mooe_amount' => 'decimal:2',
        'fe_amount' => 'decimal:2',
        'co_amount' => 'decimal:2',
    ];

    public function ppa(): BelongsTo
    {
        return $this->belongsTo(Ppa::class);
    }

    public function getTotalAttribute()
    {
        // Use bcadd to keep it 100% precise
        $sum = bcadd($this->ps_amount, $this->mooe_amount, 2);
        $sum = bcadd($sum, $this->fe_amount, 2);
        return bcadd($sum, $this->co_amount, 2);
    }
}
