<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ppa extends Model
{
    /** @use HasFactory<\Database\Factories\PpaFactory> */
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
    // public function office()
    // {
    //     return $this->belongsTo(Office::class);
    // }

    public function children()
    {
        return $this->hasMany(Ppa::class, 'parent_id');
    }

    public function descendants()
    {
        return $this->children()->with('descendants');
    }

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class, 'sector_id');
    }
}
