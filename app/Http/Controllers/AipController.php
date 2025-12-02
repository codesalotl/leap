<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Aip;

class AipController extends Controller
{
    public function show()
    {
        return Aip::all();
    }

    public function index()
    {
        $data = Aip::all();

        // return Inertia::render('aip/aip', $data);
        return Inertia::render('aip/aip', ['data' => $data]);
    }
}
