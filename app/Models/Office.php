<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
        'acronym',
        'is_lee',
    ];

    // protected function fullCode(): Attribute
    // {
    //     return Attribute::make(
    //         get: function () {
    //             $sector = $this->sector?->code ?? '0000';
    //             $lgu = $this->lguLevel?->code ?? '0';
    //             $type = $this->officeType?->code ?? '00';
    //             $office = $this->code ?? '000';

    //             // Example: 1000-0-01-011
    //             return "{$sector}-{$lgu}-{$type}-{$office}";
    //         },
    //     );
    // }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function lguLevel()
    {
        return $this->belongsTo(LguLevel::class);
    }

    public function officeType()
    {
        return $this->belongsTo(OfficeType::class);
    }
}
