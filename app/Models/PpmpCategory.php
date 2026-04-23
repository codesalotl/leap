<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpCategory extends Model
{
    /** @use HasFactory<\Database\Factories\PpmpCategoryFactory> */
    use HasFactory;

    protected $fillable = ['name', 'is_non_procurement'];

    protected $casts = [
        'is_non_procurement' => 'boolean',
    ];

    public function chartOfAccountPivot()
    {
        return $this->hasMany(
            ChartOfAccountPpmpCategory::class,
            'ppmp_category_id',
        );
    }

    public function chartOfAccounts()
    {
        return $this->belongsToMany(
            ChartOfAccount::class,
            'chart_of_account_ppmp_categories',
            'ppmp_category_id',
            'chart_of_account_id',
        );
    }
}
