<?php

namespace App\Http\Controllers;

use App\Models\LguProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LguProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('lgu-profile/lgu-profile-layout');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(LguProfile $lguProfile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LguProfile $lguProfile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LguProfile $lguProfile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LguProfile $lguProfile)
    {
        //
    }
}
