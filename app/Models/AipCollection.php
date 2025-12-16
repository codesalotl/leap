<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AipCollection extends Model
{
    protected $table = 'aip_collections';

    protected $fillable = ['year'];
}
