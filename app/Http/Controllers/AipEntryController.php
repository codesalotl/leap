<?php

namespace App\Http\Controllers;

use App\Models\AipEntry;
use App\Models\FundingSource;
use App\Models\Aip;
use App\Models\FiscalYear;
use App\Models\Ppa;
use App\Http\Requests\StoreAipEntryRequest;
use App\Http\Requests\UpdateAipEntryRequest;
use App\Models\ChartOfAccount;
use App\Models\Office;
use App\Models\PpmpPriceList;
use App\Models\Ppmp;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AipEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FiscalYear $fiscalYear)
    {
        $ppaMasterList = Ppa::whereNull('parent_id')
            ->with(['office', 'children', 'parent'])
            ->get();

        $yearId = $fiscalYear->id;

        $loadAipTree = function ($query) use ($yearId, &$loadAipTree) {
            $query
                ->whereHas(
                    'aipEntry',
                    fn($q) => $q->where('fiscal_year_id', $yearId),
                )
                ->with([
                    'office',
                    'parent',
                    'aipEntry' => fn($q) => $q
                        ->where('fiscal_year_id', $yearId)
                        ->with('fundingSource'),
                    'children' => $loadAipTree,
                ]);
        };
        $aipEntries = Ppa::whereNull('parent_id')->where($loadAipTree)->get();

        $offices = Office::all();

        return Inertia::render('aip-summary/index', [
            'fiscalYear' => $fiscalYear,
            'aipEntries' => $aipEntries,
            'masterPpas' => $ppaMasterList,
            'fundingSources' => FundingSource::all(),

            'offices' => $offices,
            'chartOfAccounts' => ChartOfAccount::all(),
            'ppmpPriceList' => PpmpPriceList::all(),
            'ppmpItems' => Ppmp::with(['ppmpPriceList'])->get(),
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
    public function store(StoreAipEntryRequest $request, $fiscal_year_id)
    {
        $validated = $request->validated();

        $newEntries = collect($validated['ppa_ids'])
            ->map(function ($ppaId) use ($fiscal_year_id) {
                return [
                    'fiscal_year_id' => $fiscal_year_id,
                    'ppa_id' => $ppaId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })
            ->toArray();

        \DB::table('aip_entries')->insert($newEntries);

        return back()->with('success', 'PPAs imported successfully!');
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
        $validated = $request->validated();

        $aipEntry->fundingSource()->sync($validated['fundingSource']);

        $aipEntry->update([
            'start_date' =>
                $validated['scheduleOfImplementation']['startingDate'],
            'end_date' =>
                $validated['scheduleOfImplementation']['completionDate'],
            'expected_output' => $validated['expectedOutputs'],
            'ps_amount' => $validated['amount']['ps'],
            'mooe_amount' => $validated['amount']['mooe'],
            'fe_amount' => $validated['amount']['fe'],
            'co_amount' => $validated['amount']['co'],
            'ccet_adaptation' =>
                $validated['amountOfCcExpenditure']['ccAdaptation'],
            'ccet_mitigation' =>
                $validated['amountOfCcExpenditure']['ccMitigation'],
        ]);

        PPA::where('id', $validated['ppa_id'])->update([
            'title' => $validated['ppaDescription'],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AipEntry $aipEntry)
    {
        try {
            DB::beginTransaction();

            // We only care about the PPA hierarchy to know WHICH entries to remove
            $fiscalYearId = $aipEntry->fiscal_year_id;
            $targetPpaId = $aipEntry->ppa_id;

            // 1. We look at the 'ppas' table ONLY to find the IDs of the children.
            // No PPA records are deleted here.
            $descendantPpaIds = $this->getDescendantPpaIds($targetPpaId);

            // 2. We combine the clicked PPA ID with all its child PPA IDs.
            $ppaIdsToRemoveFromAip = array_merge(
                [$targetPpaId],
                $descendantPpaIds,
            );

            // 3. Get the AIP entry IDs that will be deleted to handle PPMP constraints
            $aipEntryIdsToDelete = AipEntry::where(
                'fiscal_year_id',
                $fiscalYearId,
            )
                ->whereIn('ppa_id', $ppaIdsToRemoveFromAip)
                ->pluck('id')
                ->toArray();

            // 4. Delete PPMP records that reference these AIP entries first
            if (!empty($aipEntryIdsToDelete)) {
                \App\Models\Ppmp::whereIn(
                    'aip_entry_id',
                    $aipEntryIdsToDelete,
                )->delete();
            }

            // 5. Now delete the AIP entries
            AipEntry::where('fiscal_year_id', $fiscalYearId)
                ->whereIn('ppa_id', $ppaIdsToRemoveFromAip)
                ->delete();

            DB::commit();

            return back()->with('success', 'Removed from AIP summary.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Failed to remove entry: ' . $e->getMessage(),
            ]);
        }
    }

    private function getDescendantPpaIds($parentId)
    {
        // Querying the Library to find sub-projects/activities
        $children = DB::table('ppas')
            ->where('parent_id', $parentId)
            ->pluck('id')
            ->toArray();

        $descendants = $children;
        foreach ($children as $childId) {
            $descendants = array_merge(
                $descendants,
                $this->getDescendantPpaIds($childId),
            );
        }

        return $descendants;
    }
}
