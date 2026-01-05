<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\AipCollection;
use App\Models\Program;
use App\Models\Aip;

class AipCollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $aipCollection = AipCollection::all();

        return Inertia::render('aip/aip-collections', [
            'aipCollection' => $aipCollection,
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
    public function store(Request $request)
    {
        $year = $request->input('year');

        $newAipCollection = AipCollection::create([
            'year' => $year,
        ]);
        $newAipCollectionId = $newAipCollection->id;

        $activePrograms = Program::select('id', 'aip_ref_code', 'name')
            ->where('is_active', 1)
            ->get();

        $aipRecords = [];

        foreach ($activePrograms as $program) {
            $aipRecords[] = [
                // Mapping Program fields to Aip fields
                'aipRefCode' => $program->aip_ref_code,
                'ppaDescription' => $program->name, // Assuming 'name' in Program maps to 'ppaDescription' in Aip

                // Linking the Aip to the newly created AipCollection
                'parentId' => null,
                'aip_collection_id' => $newAipCollectionId,

                // Setting default/placeholder values for the remaining required fields:
                'implementingOfficeDepartmentLocation' => null,
                'startingDate' => null, // Example: Use the current date
                'completionDate' => null, // Example: 1 year from now
                'expectedOutputs' => null,
                'fundingSource' => null,
                'ps' => 0.0,
                'mooe' => 0.0,
                'fe' => 0.0,
                'co' => 0.0,
                'total' => 0.0,
                'ccAdaptation' => null,
                'ccMitigation' => null,
                'ccTypologyCode' => null,

                // Laravel timestamps for mass assignment
                // 'created_at' => now(),
                // 'updated_at' => now(),
            ];
        }

        // $count = 0;
        // 4. Perform the single mass insertion (Correct: Outside the loop)
        if (!empty($aipRecords)) {
            Aip::insert($aipRecords);
            // $count = count($aipRecords);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $aipCollection = AipCollection::findOrFail($id);
        $data = Aip::where('aip_collection_id', $id)->get();
        $programs = Program::all();

        return Inertia::render('aip/aip-table', [
            'collection' => $aipCollection,
            'data' => $data,
            'programs' => $programs,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
