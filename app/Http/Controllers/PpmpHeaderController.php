<?php

namespace App\Http\Controllers;

use App\Models\PpmpHeader;
use App\Models\AipEntry;
use App\Models\Office;
use App\Http\Requests\StorePpmpHeaderRequest;
use App\Http\Requests\UpdatePpmpHeaderRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpmpHeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ppmpHeaders = PpmpHeader::with(['aipEntry', 'office', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $aipEntries = AipEntry::all();
        $offices = Office::all();

        return Inertia::render('ppmp/headers/index', [
            'ppmpHeaders' => $ppmpHeaders,
            'aipEntries' => $aipEntries,
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
    public function store(StorePpmpHeaderRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();
        
        $ppmpHeader = PpmpHeader::create($validated);
        
        return redirect()->route('ppmp-headers.index')
            ->with('success', 'PPMP Header created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PpmpHeader $ppmpHeader)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PpmpHeader $ppmpHeader)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePpmpHeaderRequest $request, PpmpHeader $ppmpHeader)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PpmpHeader $ppmpHeader)
    {
        //
    }
}
