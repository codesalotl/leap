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
        // 1. Get only Programs (root nodes)
        // 2. Eager load descendants (Projects and Activities)
        $ppa = Ppa::whereNull('parent_id')->with('descendants')->get();

        // 2. Get all Offices (The metadata for the Reference Code)
        // We fetch these so the user can select an office when creating a Program
        $offices = Office::get();

        // return response()->json($hierarchy);
        return Inertia::render('aip-ppa/aip-ppa', [
            'aipPpa' => $ppa,
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
        // If you are using StoreAipPpaRequest, validation happens automatically.
        // Ensure the rules() in that file match these keys.
        $validated = $request->validated();

        // 1. Get Office and Parent info
        $parent = $request->parent_id
            ? Ppa::with('office')->find($request->parent_id)
            : null;

        // Use the office_id from request if root, otherwise inherit from parent
        $officeId = $parent ? $parent->office_id : $request->office_id;
        $office = Office::findOrFail($officeId);

        // 2. Map Sector ID to BOM 4-digit codes
        $sectorMapping = [1 => '1000', 2 => '3000', 3 => '8000', 9 => '9000'];
        $sectorCode = $sectorMapping[$office->sector_id] ?? '9000';

        // 3. Determine Type and Sequence
        $type = $parent
            ? ($parent->type === 'Program'
                ? 'Project'
                : 'Activity')
            : 'Program';

        $lastSequence =
            Ppa::where('parent_id', $request->parent_id)
                ->where('office_id', $office->id)
                ->max('sequence_number') ?? 0;
        $newSequence = $lastSequence + 1;

        // 4. Generate Code
        // baseCode format: Sector-SubSector-Lvl-Type-OffNum (e.g., 1000-000-1-1-01)
        $baseCode = sprintf(
            '%s-000-%d-%d-%02d',
            $sectorCode,
            $office->lgu_level_id,
            $office->office_type_id,
            $office->office_number, // Corrected from office_num
        );

        if ($type === 'Program') {
            $reference_code = sprintf(
                '%s-%03d-000-000',
                $baseCode,
                $newSequence,
            );
        } elseif ($type === 'Project') {
            // Inherit from parent: Sector to Office segments (first 15 chars)
            $prefix = substr($parent->reference_code, 0, 15);
            $progSeg = substr($parent->reference_code, 16, 3);
            $reference_code = sprintf(
                '%s-%s-%03d-000',
                $prefix,
                $progSeg,
                $newSequence,
            );
        } else {
            // Activity: inherit up to Project segment (first 23 chars)
            $prefix = substr($parent->reference_code, 0, 23);
            $reference_code = sprintf('%s-%03d', $prefix, $newSequence);
        }

        Ppa::create([
            'type' => $type,
            'description' => $validated['description'],
            'reference_code' => $reference_code,
            'parent_id' => $request->parent_id,
            'office_id' => $office->id,
            'sequence_number' => $newSequence,
        ]);
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
        // 1. Get the validated data (only description and office_id)
        $validated = $request->validated();

        // 2. Update the model instance
        $ppa->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ppa $ppa)
    {
        $type = $ppa->type;
        $ppa->delete();

        // return Redirect::back()->with('success', "$type deleted successfully.");
    }
}
