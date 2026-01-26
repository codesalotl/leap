<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PpmpHeader extends Model
{
    /** @use HasFactory<\Database\Factories\PpmpHeaderFactory> */
    use HasFactory;

    protected $fillable = [
        'aip_entry_id',
        'office_id', 
        'procurement_type',
        'procurement_method',
        'implementation_schedule',
        'source_of_funds',
        'approved_budget',
        'status',
        'created_by',
    ];

    protected $casts = [
        'approved_budget' => 'decimal:2',
        'implementation_schedule' => 'date',
    ];

    public function aipEntry()
    {
        return $this->belongsTo(AipEntry::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function ppmpItems()
    {
        return $this->hasMany(PpmpItem::class);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByOffice($query, $officeId)
    {
        return $query->where('office_id', $officeId);
    }

    public function scopeByProcurementType($query, $procurementType)
    {
        return $query->where('procurement_type', $procurementType);
    }
}
