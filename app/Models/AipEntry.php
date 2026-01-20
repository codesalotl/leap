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

    public function ppa(): BelongsTo
    {
        return $this->belongsTo(Ppa::class);
    }
}
