<?php

namespace App\Http\Controllers;

use App\Models\Ppa;
use App\Models\Office;
use App\Models\Sector;
use App\Http\Requests\StorePpaRequest;
use App\Http\Requests\UpdatePpaRequest;
use App\Models\LguLevel;
use App\Models\OfficeType;
use Inertia\Inertia;

class PpaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Load children and their parents recursively
        $ppaTree = Ppa::whereNull('parent_id')
            ->with([
                'office.sector',
                'office.lguLevel',
                'office.officeType',
                'children.children', // Load deeper levels
            ])
            ->get();

        $offices = Office::with(['sector', 'lguLevel', 'officeType'])->get();

        return Inertia::render('ppa/index', [
            'ppaTree' => $ppaTree,
            'offices' => $offices,
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
    public function store(StorePpaRequest $request)
    {
        $validated = $request->validate([
            'office_id' => 'required|exists:offices,id',
            'parent_id' => 'nullable|exists:ppas,id',
            'title' => 'required|string',
            'type' => 'required|in:Program,Project,Activity',
            'code_suffix' => 'required|string|max:3',
            'is_active' => 'boolean',
        ]);

        Ppa::create($validated);

        return redirect()->back()->with('success', 'Entry created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ppa $ppa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ppa $ppa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePpaRequest $request, Ppa $ppa)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'code_suffix' => 'required|string|max:3',
            'is_active' => 'boolean',
        ]);

        $ppa->update($validated);

        return redirect()->back()->with('success', 'Entry updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ppa $ppa)
    {
        // This will delete the PPA and its children if you have
        // a cascade delete set up in your migration.
        $ppa->delete();

        return redirect()->back()->with('success', 'Entry deleted.');
    }
}
