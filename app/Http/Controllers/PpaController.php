<?php

namespace App\Http\Controllers;

use App\Models\Ppa;
use App\Models\Office;
use App\Http\Requests\StorePpaRequest;
use App\Http\Requests\UpdatePpaRequest;
use Inertia\Inertia;

class PpaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ppaTree = Ppa::whereNull('parent_id')->with('children')->get();

        return Inertia::render('ppa/index', [
            'ppaTree' => $ppaTree,
            'offices' => Office::all(),
        ]);
    }

    /**
     * Recursive helper to ensure children is never null
     */
    private function formatPpa($ppa)
    {
        $ppa->children = $ppa->children->map(
            fn($child) => $this->formatPpa($child),
        );
        return $ppa;
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
