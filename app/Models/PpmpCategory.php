<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpCategory extends Model
{
    /** @use HasFactory<\Database\Factories\PpmpCategoryFactory> */
    use HasFactory;

    protected $fillable = ['name'];
}
