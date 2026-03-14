<?php

namespace App\Http\Controllers;

use App\Models\Office;
use App\Models\Sector;
use App\Models\LguLevel;
use App\Models\OfficeType;
use App\Http\Requests\StoreOfficeRequest;
use App\Http\Requests\UpdateOfficeRequest;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('offices/index', [
            'offices' => Office::with([
                'sector',
                'lguLevel',
                'officeType',
            ])->get(),
            'sectors' => Sector::all(),
            'lguLevels' => LguLevel::all(),
            'officeTypes' => OfficeType::all(),
        ]);
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
    public function store(StoreOfficeRequest $request)
    {
        try {
            $validated = $request->validated();
            $office = Office::create($validated);

            return redirect()->back()->with('success', 'Office created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation exceptions and return proper Inertia response
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Office $office)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Office $office)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOfficeRequest $request, Office $office)
    {
        try {
            $validated = $request->validated();
            $office->update($validated);

            return redirect()->back()->with('success', 'Office updated successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation exceptions and return proper Inertia response
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Office $office)
    {
        $office->delete();

        return redirect()->back()->with('success', 'Office deleted successfully');
    }
}
