<?php

namespace App\Http\Controllers;

use App\Models\Aip;
use App\Http\Requests\StoreAipRequest;
use App\Http\Requests\UpdateAipRequest;
use App\Models\AipEntry;
use App\Models\Ppa;
use Inertia\Inertia;

class AipController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $aip = Aip::all();

        return Inertia::render('aip/index', [
            'aip' => $aip,
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
    public function store(StoreAipRequest $request)
    {
        try {
            Aip::create($request->validated());
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['year' => 'The year is already initialized.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Aip $aip)
    {
        // 1. Fetch Master PPA Library for the Import Modal (Hierarchical)
        // We get top-level programs and recurse down through children
        $masterPpaTree = Ppa::whereNull('parent_id')
            ->where('is_active', true)
            ->with([
                'office.sector',
                'office.lguLevel',
                'office.officeType',
                'children.children', // Recursive load
            ])
            ->get();

        // 2. Fetch existing AIP entries with their PPA details
        $aip_entries = AipEntry::with(['ppa.office', 'ppa.parent'])
            ->where('aip_id', $aip->id)
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

        return Inertia::render('aip/aip-summary-table', [
            'aip' => $aip,
            'aip_entries' => $aipTree,
            'masterPpas' => $masterPpaTree, // Hierarchical library for the modal
        ]);
    }

    /**
     * Helper to build tree for AIP Entries based on PPA hierarchy
     */
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
     * Show the form for editing the specified resource.
     */
    public function edit(Aip $aip)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAipRequest $request, Aip $aip)
    {
        $request->validate([
            'status' => 'required|string|in:Open,Closed',
        ]);

        $aip->update([
            'status' => $request->status,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Aip $aip)
    {
        //
    }
}
