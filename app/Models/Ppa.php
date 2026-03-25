<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Ppa extends Model
{
    /** @use HasFactory<\Database\Factories\PpaFactory> */
    use HasFactory;

    protected $fillable = [
        'office_id',
        'parent_id',
        'title',
        'type',
        'code_suffix',
        'is_active',
    ];

    // protected $appends = ['full_code'];

    // protected function fullCode(): Attribute
    // {
    //     return Attribute::make(
    //         get: function () {
    //             $suffix = $this->code_suffix ?? '000';

    //             if ($this->parent_id) {
    //                 $parent = $this->parent;

    //                 if ($parent) {
    //                     return $parent->full_code . '-' . $suffix;
    //                 }
    //             }

    //             $officePrefix = $this->office?->full_code ?? '0000-0-00-000';

    //             return $officePrefix . '-' . $suffix;
    //         },
    //     );
    // }

    public function children()
    {
        return $this->hasMany(Ppa::class, 'parent_id');
    }

    public function ppaFundingSources()
    {
        return $this->hasMany(PpaFundingSource::class, 'ppa_id');
    }

    public function aipEntries()
    {
        return $this->hasMany(AipEntry::class, 'ppa_id');
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}
