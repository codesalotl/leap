<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // ADD THIS

class Office extends Model
{
    /** @use HasFactory<\Database\Factories\OfficeFactory> */
    use HasFactory;

    protected $fillable = [
        'sector_id',
        'lgu_level_id',
        'office_type_id',
        'code',
        'name',
        'is_lee',
    ];

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    public function lguLevel(): BelongsTo
    {
        return $this->belongsTo(LguLevel::class);
    }

    public function officeType(): BelongsTo
    {
        return $this->belongsTo(OfficeType::class);
    }
}
