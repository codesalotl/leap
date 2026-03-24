<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use App\Models\AipEntry;
use App\Models\Ppmp;
use App\Models\PpmpCategory;
use App\Models\ChartOfAccount;
use App\Models\PpmpPriceList;
use App\Models\FundingSource;
use App\Models\PpaFundingSource;
use App\Http\Requests\StorePpmpRequest;
use App\Http\Requests\UpdatePpmpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PpmpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(FiscalYear $fiscalYear, AipEntry $aipEntry)
    {
        $ppmpItems = Ppmp::where('aip_entry_id', $aipEntry->id)
            ->with([
                'fundingSource', // Direct relationship
                'ppmpPriceList.category', // Nested relationships
                'ppmpPriceList.chartOfAccount',
            ])
            ->get();

        $chartOfAccounts = ChartOfAccount::whereIn('expense_class', [
            'MOOE',
            'CO',
        ])
            ->with(['ppmpPriceLists.category'])
            ->get();

        $ppmpCategories = PpmpCategory::all();

        $ppaFundingSources = PpaFundingSource::with('funding_source')
            ->where('ppa_id', $aipEntry->id)
            ->get();

        return Inertia::render('ppmp/index', [
            'fiscalYear' => $fiscalYear,
            'aipEntry' => $aipEntry,
            'ppmpItems' => $ppmpItems,
            'chartOfAccounts' => $chartOfAccounts,
            'ppmpCategories' => $ppmpCategories,
            'fundingSources' => $ppaFundingSources,
            'initialChoice' => request()->query('choice'),
        ]);
    }

    /**
     * Update AIP MOOE amount based on total PPMP amounts
     */
    // private function updateAipMooeAmount($aipEntryId)
    // {
    //     try {
    //         // Calculate total from all PPMP items for this AIP entry
    //         $totalAmount =
    //             Ppmp::where('aip_entry_id', $aipEntryId)
    //                 ->selectRaw(
    //                     'SUM(jan_amount + feb_amount + mar_amount + apr_amount + may_amount + jun_amount + jul_amount + aug_amount + sep_amount + oct_amount + nov_amount + dec_amount) as total',
    //                 )
    //                 ->value('total') ?? 0;

    //         // Update the corresponding AIP entry
    //         $aipEntry = AipEntry::find($aipEntryId);
    //         if ($aipEntry) {
    //             $aipEntry->mooe_amount = $totalAmount;
    //             $aipEntry->save();

    //             \Log::info('AIP MOOE amount updated:', [
    //                 'aip_entry_id' => $aipEntryId,
    //                 'mooe_amount' => $totalAmount,
    //             ]);
    //         }
    //     } catch (\Exception $e) {
    //         \Log::error('Failed to update AIP MOOE amount:', [
    //             'aip_entry_id' => $aipEntryId,
    //             'error' => $e->getMessage(),
    //         ]);
    //     }
    // }
    private function updateAipAmount($aipEntryId, $expenseClass, $fundingSourceId)
{
    $columnMap = [
        'MOOE' => 'mooe_amount',
        'CO'   => 'co_amount',
        'PS'   => 'ps_amount',
        'FE'   => 'fe_amount',
    ];

    $targetColumn = $columnMap[$expenseClass] ?? null;

    if (!$targetColumn) {
        \Log::warning("Unknown expense class encountered: {$expenseClass}");
        return;
    }

    try {
        // A. UPDATE GLOBAL AIP ENTRY TOTALS
        $totalForClass = Ppmp::where('aip_entry_id', $aipEntryId)
            ->whereHas('ppmpPriceList.chartOfAccount', function ($query) use ($expenseClass) {
                $query->where('expense_class', $expenseClass);
            })
            ->selectRaw('SUM(jan_amount + feb_amount + mar_amount + apr_amount + may_amount + jun_amount + jul_amount + aug_amount + sep_amount + oct_amount + nov_amount + dec_amount) as total')
            ->value('total') ?? 0;

        \App\Models\AipEntry::where('id', $aipEntryId)->update([
            $targetColumn => $totalForClass,
        ]);

        // B. UPDATE SPECIFIC FUNDING SOURCE TOTALS (Pivot Table)
        // Get the PPA ID from the AIP Entry
        $aipEntry = \App\Models\AipEntry::find($aipEntryId);
        if (!$aipEntry) return;

        $totalForSource = Ppmp::where('aip_entry_id', $aipEntryId)
            ->where('funding_source_id', $fundingSourceId) // Filter by the specific source
            ->whereHas('ppmpPriceList.chartOfAccount', function ($query) use ($expenseClass) {
                $query->where('expense_class', $expenseClass);
            })
            ->selectRaw('SUM(jan_amount + feb_amount + mar_amount + apr_amount + may_amount + jun_amount + jul_amount + aug_amount + sep_amount + oct_amount + nov_amount + dec_amount) as total')
            ->value('total') ?? 0;

        // Update the ppa_funding_sources table
        \DB::table('ppa_funding_sources')
            ->where('ppa_id', $aipEntry->ppa_id)
            ->where('funding_source_id', $fundingSourceId)
            ->update([
                $targetColumn => $totalForSource,
                'updated_at'  => now(),
            ]);

    } catch (\Exception $e) {
        \Log::error("Failed to sync AIP/Funding totals: " . $e->getMessage());
    }
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
    public function store(StorePpmpRequest $request)
    {
        $validated = $request->validated();

        $ppmp = Ppmp::create([
            'aip_entry_id' => $validated['aip_entry_id'],
            'ppmp_price_list_id' => $validated['ppmp_price_list_id'],
            'funding_source_id' => $validated['fundingSource'],
            'jan_qty' => 0,
            'jan_amount' => 0,
            'feb_qty' => 0,
            'feb_amount' => 0,
            'mar_qty' => 0,
            'mar_amount' => 0,
            'apr_qty' => 0,
            'apr_amount' => 0,
            'may_qty' => 0,
            'may_amount' => 0,
            'jun_qty' => 0,
            'jun_amount' => 0,
            'jul_qty' => 0,
            'jul_amount' => 0,
            'aug_qty' => 0,
            'aug_amount' => 0,
            'sep_qty' => 0,
            'sep_amount' => 0,
            'oct_qty' => 0,
            'oct_amount' => 0,
            'nov_qty' => 0,
            'nov_amount' => 0,
            'dec_qty' => 0,
            'dec_amount' => 0,
        ]);

        $expenseClass = $ppmp->ppmpPriceList->chartOfAccount->expense_class;

        $this->updateAipAmount($ppmp->aip_entry_id, $expenseClass, $ppmp->funding_source_id);
    }

    /**
     * Store a custom PPMP item (creates price list first, then PPMP)
     */
    // public function storeCustomItem(Request $request)
    // {
    //     $validated = $request->validate([
    //         'expenseAccount' => 'required|integer|exists:chart_of_accounts,id',
    //         'aip_entry_id' => 'required|integer|exists:aip_entries,id',
    //         'ppmp_price_list_id' =>
    //             'required|integer|exists:ppmp_price_lists,id',
    //         'fundingSource' => 'required|integer|exists:funding_sources,id',
    //         'itemNo' => 'required|integer|min:1',
    //         'description' => 'required|string',
    //         'unitOfMeasurement' => 'required|string|max:20',
    //         'price' => 'required|numeric|min:0',
    //         'category' => 'required|integer|exists:ppmp_categories,id',
    //     ]);

    //     Ppmp::create([
    //         'aip_entry_id' => $validated['aip_entry_id'],
    //         'ppmp_price_list_id' => $validated['ppmp_price_list_id'],
    //         'funding_source_id' => $validated['fundingSource'],
    //         'jan_qty' => 0,
    //         'jan_amount' => 0,
    //         'feb_qty' => 0,
    //         'feb_amount' => 0,
    //         'mar_qty' => 0,
    //         'mar_amount' => 0,
    //         'apr_qty' => 0,
    //         'apr_amount' => 0,
    //         'may_qty' => 0,
    //         'may_amount' => 0,
    //         'jun_qty' => 0,
    //         'jun_amount' => 0,
    //         'jul_qty' => 0,
    //         'jul_amount' => 0,
    //         'aug_qty' => 0,
    //         'aug_amount' => 0,
    //         'sep_qty' => 0,
    //         'sep_amount' => 0,
    //         'oct_qty' => 0,
    //         'oct_amount' => 0,
    //         'nov_qty' => 0,
    //         'nov_amount' => 0,
    //         'dec_qty' => 0,
    //         'dec_amount' => 0,
    //     ]);

    //     // // 1. Handle Category
    //     // $categoryId = $validated['ppmp_category_id'];

    //     // if (empty($categoryId) && !empty($validated['custom_category'])) {
    //     //     $newCategory = PpmpCategory::create([
    //     //         'name' => $validated['custom_category'],
    //     //     ]);
    //     //     $categoryId = $newCategory->id;
    //     // }

    //     // // 2. Create the price list
    //     // $newPriceList = PpmpPriceList::create([
    //     //     'item_number' => $validated['item_number'],
    //     //     'description' => $validated['description'],
    //     //     'unit_of_measurement' => $validated['unit_of_measurement'],
    //     //     'price' => $validated['price'],
    //     //     'chart_of_account_id' => $validated['chart_of_account_id'],
    //     //     'ppmp_category_id' => $categoryId,
    //     // ]);

    //     // // 3. Create the PPMP with the funding_source_id
    //     // Ppmp::create([
    //     //     'aip_entry_id' => $validated['aip_entry_id'],
    //     //     'ppmp_price_list_id' => $newPriceList->id,
    //     //     'funding_source_id' => $validated['fundingSource'],
    //     //     'jan_qty' => 0,
    //     //     'jan_amount' => 0,
    //     //     'feb_qty' => 0,
    //     //     'feb_amount' => 0,
    //     //     'mar_qty' => 0,
    //     //     'mar_amount' => 0,
    //     //     'apr_qty' => 0,
    //     //     'apr_amount' => 0,
    //     //     'may_qty' => 0,
    //     //     'may_amount' => 0,
    //     //     'jun_qty' => 0,
    //     //     'jun_amount' => 0,
    //     //     'jul_qty' => 0,
    //     //     'jul_amount' => 0,
    //     //     'aug_qty' => 0,
    //     //     'aug_amount' => 0,
    //     //     'sep_qty' => 0,
    //     //     'sep_amount' => 0,
    //     //     'oct_qty' => 0,
    //     //     'oct_amount' => 0,
    //     //     'nov_qty' => 0,
    //     //     'nov_amount' => 0,
    //     //     'dec_qty' => 0,
    //     //     'dec_amount' => 0,
    //     // ]);

    //     // $this->updateAipMooeAmount($ppmp->aip_entry_id);
    // }

    /**
     * Update monthly quantity for a PPMP item.
     */
    // public function updateMonthlyQuantity(Request $request, Ppmp $ppmp)
    // {
    //     $validated = $request->validate([
    //         'month' =>
    //             'required|in:jan_qty,feb_qty,mar_qty,apr_qty,may_qty,jun_qty,jul_qty,aug_qty,sep_qty,oct_qty,nov_qty,dec_qty',
    //         'quantity' => 'required|numeric|min:0',
    //     ]);

    //     $monthColumn = $validated['month'];
    //     $quantity = $validated['quantity'];

    //     // Get unit price from the price list relationship
    //     $unitPrice = $ppmp->ppmpPriceList?->price ?? 0;

    //     // Calculate amount (quantity × unit_price)
    //     $amountColumn = str_replace('_qty', '_amount', $monthColumn);

    //     // Update both quantity and amount
    //     $ppmp->update([
    //         $monthColumn => $quantity,
    //         $amountColumn => $quantity * $unitPrice,
    //     ]);

    //     // Update AIP MOOE amount after PPMP update
    //     $this->updateAipMooeAmount($ppmp->aip_entry_id);

    //     return back()->with('success', 'PPMP item updated successfully');
    // }
    public function updateMonthlyQuantity(Request $request, Ppmp $ppmp)
{
    $validated = $request->validate([
        'month' => 'required|in:jan_qty,feb_qty,mar_qty,apr_qty,may_qty,jun_qty,jul_qty,aug_qty,sep_qty,oct_qty,nov_qty,dec_qty',
        'quantity' => 'required|numeric|min:0',
    ]);

    $monthQty = $validated['month'];
    $monthAmount = str_replace('_qty', '_amount', $monthQty);
    $unitPrice = $ppmp->ppmpPriceList?->price ?? 0;

    $ppmp->update([
        $monthQty => $validated['quantity'],
        $monthAmount => $validated['quantity'] * $unitPrice,
    ]);

    $expenseClass = $ppmp->ppmpPriceList->chartOfAccount->expense_class;

    // Pass the funding_source_id to the sync method
    $this->updateAipAmount($ppmp->aip_entry_id, $expenseClass, $ppmp->funding_source_id);

    return back();
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ppmp $ppmp)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePpmpRequest $request, Ppmp $ppmp)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ppmp $ppmp)
    {
        $aipEntryId = $ppmp->aip_entry_id;
        // Capture class BEFORE deletion
        $expenseClass = $ppmp->ppmpPriceList->chartOfAccount->expense_class;

        $fsId = $ppmp->funding_source_id; // Capture before delete

        $ppmp->delete();

        // Trigger dynamic recalculation for the specific class
        $this->updateAipAmount($aipEntryId, $expenseClass, $fsId);
    }
}
