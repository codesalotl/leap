<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AipPpa extends Model
{
    /** @use HasFactory<\Database\Factories\AipPpaFactory> */
    use HasFactory;

    protected $fillable = [
        'type',
        'reference_code',
        'description',
        'parent_id',
        'office_id', // Add this
        'sequence_number', // Add this
    ];

    // Define the relationship so the controller can find the parent's office
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function children()
    {
        return $this->hasMany(AipPpa::class, 'parent_id');
    }

    public function descendants()
    {
        return $this->children()->with('descendants');
    }
}
