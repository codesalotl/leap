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

    protected $appends = ['full_code'];

    protected function fullCode(): Attribute
    {
        return Attribute::make(
            get: function () {
                $suffix = $this->code_suffix ?? '000';

                // 1. Check for Parent FIRST
                if ($this->parent_id) {
                    // Use relationLoaded to ensure we aren't triggering new queries
                    // and use the actual parent object
                    $parent = $this->parent;

                    if ($parent) {
                        return $parent->full_code . '-' . $suffix;
                    }
                }

                // 2. If no parent_id, then it's a Top-Level Program
                // Get the Office prefix (Sector-LGU-Type-Office)
                $officePrefix = $this->office?->full_code ?? '0000-0-00-000';

                return $officePrefix . '-' . $suffix;
            },
        );
    }

    public function office()
    {
        return $this->belongsTo(Office::class)->with(
            'sector',
            'lguLevel',
            'officeType',
        );
    }

    public function children()
    {
        return $this->hasMany(Ppa::class, 'parent_id')->with(
            'children',
            'office',
        );
    }

    public function parent()
    {
        return $this->belongsTo(Ppa::class, 'parent_id');
    }
}
