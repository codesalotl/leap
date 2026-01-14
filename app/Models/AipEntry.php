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
        'aip_id',
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

    /**
     * Correct relationship return type
     */
    public function ppa(): BelongsTo
    {
        return $this->belongsTo(Ppa::class, 'ppa_id');
    }

    public function aip(): BelongsTo
    {
        return $this->belongsTo(Aip::class);
    }

    public function sector(): BelongsTo
    {
        // If your table uses sector_id, this is standard:
        return $this->belongsTo(Sector::class);
    }

    /**
     * Also ensure you have the office relationship for ppa.office
     */
    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }
}
