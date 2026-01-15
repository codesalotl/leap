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
        // 1. Fetch existing entries for the table
        $aip_entries = AipEntry::with(['ppa.office', 'ppa.sector'])
            ->where('aip_id', $aip->id)
            ->get();

        // 2. Fetch Active PPAs for the Import Modal
        // We only select the columns needed to keep the payload light
        $master_ppas = Ppa::where('is_active', true)
            ->select(
                'id',
                'title',
                'type',
                'code_suffix',
                'parent_id',
                'is_active',
            )
            ->get();

        // Map the flat list into the formatted structure
        $formatted_entries = $aip_entries->map(function ($entry) {
            $ps = (float) $entry->ps_amount;
            $mooe = (float) $entry->mooe_amount;
            $fe = (float) $entry->fe_amount;
            $co = (float) $entry->co_amount;

            return [
                'id' => $entry->id,
                'ppa_id' => $entry->ppa_id,
                'parent_id' => $entry->ppa->parent_id,
                'aip_ref_code' => $entry->ppa->reference_code,
                'ppa_desc' => $entry->ppa->title, // Changed from description to title based on your migration
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

        // Build the Tree structure for TanStack Table
        $tree = $this->buildTree($formatted_entries);

        return Inertia::render('aip/aip-summary-table', [
            'aip' => $aip, // Pass the AIP record so you have the ID for the form post
            'aip_entries' => $tree,
            'masterPpas' => $master_ppas, // The prop for your PpaImportModal
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Aip $aip)
    {
        //
    }
}
