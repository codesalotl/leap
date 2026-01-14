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
        Aip::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(Aip $aip)
    {
        $aip_entries = AipEntry::with(['ppa.office', 'ppa.sector'])
            ->where('aip_id', $aip->id)
            ->get();

        // Map the flat list into the formatted structure first
        $formatted_entries = $aip_entries->map(function ($entry) {
            $ps = (float) $entry->ps_amount;
            $mooe = (float) $entry->mooe_amount;
            $fe = (float) $entry->fe_amount;
            $co = (float) $entry->co_amount;

            return [
                'id' => $entry->id,
                'ppa_id' => $entry->ppa_id, // Temp field for nesting
                'parent_id' => $entry->ppa->parent_id, // Temp field for nesting
                'aip_ref_code' => $entry->ppa->reference_code,
                'ppa_desc' => $entry->ppa->description,
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
                'amount_cc_expenditure' => number_format(
                    (float) $entry->ccet_adaptation +
                        (float) $entry->ccet_mitigation,
                    2,
                    '.',
                    '',
                ),
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
                'cc_typology_code' => '',
                'children' => [],
            ];
        });

        // Build the Tree
        $tree = $this->buildTree($formatted_entries);

        return Inertia::render('aip/aip-summary-table', [
            'aip_entries' => $tree,
        ]);
    }

    private function buildTree($elements, $parentId = null)
    {
        $branch = [];

        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                $children = $this->buildTree($elements, $element['ppa_id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
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

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Aip $aip)
    {
        //
    }
}
