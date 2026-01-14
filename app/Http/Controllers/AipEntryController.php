<?php

namespace App\Http\Controllers;

use App\Models\AipEntry;
use App\Models\Aip;
use App\Http\Requests\StoreAipEntryRequest;
use App\Http\Requests\UpdateAipEntryRequest;
use Inertia\Inertia;
use App\Models\Ppa;
use Illuminate\Support\Facades\DB;

class AipEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('aip-entries/index');
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
    public function store(StoreAipEntryRequest $request, $aip_id)
    {
        // 1. Validation
        // Note: StoreAipEntryRequest should handle 'ppa_ids' => 'required|array'
        $request->validate([
            'ppa_ids' => 'required|array|min:1',
            'ppa_ids.*' => 'exists:ppas,id',
        ]);

        // 2. Locate the parent AIP record and get the year
        $aip = Aip::findOrFail($aip_id);
        $year = $aip->year;

        // 3. Fetch only the PPAs from the request that are actually ACTIVE
        $activePpaIds = Ppa::whereIn('id', $request->ppa_ids)
            ->where('is_active', true)
            ->pluck('id');

        if ($activePpaIds->isEmpty()) {
            return back()->with(
                'error',
                'No active PPAs were found to import.',
            );
        }

        // 4. Perform the import in a transaction for data integrity
        DB::transaction(function () use ($activePpaIds, $aip, $year) {
            foreach ($activePpaIds as $ppaId) {
                AipEntry::firstOrCreate(
                    [
                        'aip_id' => $aip->id,
                        'ppa_id' => $ppaId,
                    ],
                    [
                        // Default implementation schedule: Full Fiscal Year
                        'start_date' => "{$year}-01-01",
                        'end_date' => "{$year}-12-31",
                        'expected_output' => 'To be defined...',

                        // Defaulting all budget tranches to zero (matching migration)
                        'ps_amount' => 0,
                        'mooe_amount' => 0,
                        'fe_amount' => 0,
                        'co_amount' => 0,

                        // Climate Change Expenditure Tagging (CCET) defaults
                        'ccet_adaptation' => 0, // Using the field name from your show() logic
                        'ccet_mitigation' => 0,
                    ],
                );
            }
        });

        return back()->with(
            'success',
            $activePpaIds->count() .
                " PPAs successfully linked to the {$year} AIP Summary.",
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(AipEntry $aipEntry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AipEntry $aipEntry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAipEntryRequest $request, AipEntry $aipEntry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AipEntry $aipEntry)
    {
        //
    }
}
