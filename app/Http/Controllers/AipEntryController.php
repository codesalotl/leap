<?php

namespace App\Http\Controllers;

use App\Models\AipEntry;
use App\Models\Aip;
use App\Models\FiscalYear;
use App\Models\Ppa;
use App\Http\Requests\StoreAipEntryRequest;
use App\Http\Requests\UpdateAipEntryRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AipEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FiscalYear $fiscalYear)
    {
        $masterPpaTree = Ppa::whereNull('parent_id')
            ->where('is_active', true)
            ->with([
                'office.sector',
                'office.lguLevel',
                'office.officeType',
                'children.children',
            ])
            ->get();

        $aip_entries = AipEntry::with(['ppa.office', 'ppa.parent'])
            ->where('fiscal_year_id', $fiscalYear->id)
            ->get();

        // 3. Map flat database rows to the structure expected by the React UI
        $mappedEntries = $aip_entries->map(function ($entry) {
            $ps = (float) $entry->ps_amount;
            $mooe = (float) $entry->mooe_amount;
            $fe = (float) $entry->fe_amount;
            $co = (float) $entry->co_amount;

            return [
                'id' => $entry->id,
                'ppa_id' => $entry->ppa_id,
                'parent_ppa_id' => $entry->ppa->parent_id, // Used for tree building
                'aip_ref_code' => $entry->ppa->full_code, // From your Model Attribute
                'ppa_desc' => $entry->ppa->title,
                'implementing_office_department' =>
                    $entry->ppa->office->name ?? 'N/A',
                'sched_implementation' => [
                    'start_date' => $entry->start_date,
                    'completion_date' => $entry->end_date,
                ],
                'expected_outputs' => $entry->expected_output,
                'funding_source' => 'General Fund',
                'amount' => [
                    'ps' => number_format($ps, 2, '.', ''),
                    'mooe' => number_format($mooe, 2, '.', ''),
                    'fe' => number_format($fe, 2, '.', ''),
                    'co' => number_format($co, 2, '.', ''),
                    'total' => number_format(
                        $ps + $mooe + $fe + $co,
                        2,
                        '.',
                        '',
                    ),
                ],
                'cc_adaptation' => number_format(
                    (float) $entry->ccet_adaptation,
                    2,
                    '.',
                    '',
                ),
                'cc_mitigation' => number_format(
                    (float) $entry->ccet_mitigation,
                    2,
                    '.',
                    '',
                ),
                'cc_typology_code' => $entry->typology_code ?? '',
                'children' => [], // Placeholder for buildTree
            ];
        });

        // 4. Build the tree structure for the Summary Table
        $aipTree = $this->buildAipTree($mappedEntries);

        return Inertia::render('aip/aip-summary-form', [
            'fiscalYears' => $fiscalYear,
            'aipEntries' => $aipTree,
            'masterPpas' => $masterPpaTree, // Hierarchical library for the modal
        ]);
    }

    private function buildAipTree($entries, $parentId = null)
    {
        $branch = [];

        foreach ($entries as $entry) {
            if ($entry['parent_ppa_id'] == $parentId) {
                $children = $this->buildAipTree($entries, $entry['ppa_id']);
                if ($children) {
                    $entry['children'] = $children;
                }
                $branch[] = $entry;
            }
        }

        return $branch;
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
