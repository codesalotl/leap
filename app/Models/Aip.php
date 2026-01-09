<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aip extends Model
{
    /** @use HasFactory<\Database\Factories\AipFactory> */
    use HasFactory;

    protected $fillable = ['year'];
}
