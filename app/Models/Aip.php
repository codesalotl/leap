<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aip extends Model
{
    protected $table = 'aip';

    public $timestamps = false;

    protected $fillable = [
        'aipRefCode',
        'ppaDescription',
        'implementingOfficeDepartmentLocation',
        'startingDate',
        'completionDate',
        'expectedOutputs',
        'fundingSource',
        'ps',
        'mooe',
        'fe',
        'co',
        'total',
        'ccAdaptation',
        'ccMitigation',
        'ccTypologyCode',
        'parentId',
        'aip_collection_id',
    ];
}
