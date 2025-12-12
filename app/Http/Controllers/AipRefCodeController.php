<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\LguLevels;
use App\Models\Offices;
use App\Models\OfficeTypes;

class AipRefCodeController extends Controller
{
    public function index()
    {
        $lgu_levels = LguLevels::all();
        $office_types = OfficeTypes::all();
        $offices = Offices::all();

        return Inertia::render('aip/aip-ref-code-input', [
            'lgu_levels' => $lgu_levels,
            'office_types' => $office_types,
            'offices' => $offices,
        ]);
    }
}
