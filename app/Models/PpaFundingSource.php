<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\FundingSource;

class PpaFundingSource extends Model
{
    /** @use HasFactory<\Database\Factories\PpaFundingSourceFactory> */
    use HasFactory;

    public function funding_source()
    {
        return $this->belongsTo(FundingSource::class);
    }
}
