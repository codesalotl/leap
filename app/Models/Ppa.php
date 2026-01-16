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
        'type',
        'title',
        'code_suffix',
        'reference_code',
        'parent_id',
        'office_id',
        'is_active',
    ];

    protected $appends = ['full_code'];

    protected function fullCode(): Attribute
    {
        return Attribute::make(
            get: function () {
                // Use 'code_suffix' instead of 'code'
                $currentSuffix = $this->code_suffix ?? '000';

                if ($this->parent) {
                    return $this->parent->full_code . '-' . $currentSuffix;
                }

                $officePrefix =
                    $this->office?->full_code ?? '0000-000-0-00-000';

                return $officePrefix . '-' . $currentSuffix;
            },
        );
    }

    // Casting ensures boolean values are handled correctly
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relationship: Recursive children
     */
    public function children()
    {
        return $this->hasMany(Ppa::class, 'parent_id')->with('children');
    }

    /**
     * Relationship: Immediate parent
     */
    public function parent()
    {
        return $this->belongsTo(Ppa::class, 'parent_id');
    }

    /**
     * Relationship: Office/Department
     */
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }
}
