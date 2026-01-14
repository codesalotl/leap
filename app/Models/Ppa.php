<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
