<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use App\Models\AipEntry;
use App\Models\Ppmp;
use App\Models\ChartOfAccount;
use App\Models\PpmpPriceList;
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
            ->with(['ppmpPriceList'])
            ->get();

        $chartOfAccounts = ChartOfAccount::where('expense_class', 'MOOE')
            ->with(['ppmpPriceLists'])
            ->get();

        return Inertia::render('aip/ppmp-page', [
            'fiscalYear' => $fiscalYear,
            'aipEntry' => $aipEntry,
            'ppmpItems' => $ppmpItems,
            'chartOfAccounts' => $chartOfAccounts,
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
     * Store a custom PPMP item (creates price list first, then PPMP)
     */
    public function storeCustomItem(Request $request)
    {
        try {
            $validated = $request->validate([
                'aip_entry_id' => 'required|exists:aip_entries,id',
                'item_number' => 'required|integer|unique:ppmp_price_lists,item_number',
                'description' => 'required|string',
                'unit_of_measurement' => 'required|string|max:20',
                'price' => 'required|numeric|min:0',
                'chart_of_account_id' => 'required|exists:chart_of_accounts,id',
            ]);

            \Log::info('Custom PPMP Request:', $validated);

            // First create the price list
            $newPriceList = PpmpPriceList::create([
                'item_number' => $validated['item_number'],
                'description' => $validated['description'],
                'unit_of_measurement' => $validated['unit_of_measurement'],
                'price' => $validated['price'],
                'chart_of_account_id' => $validated['chart_of_account_id'],
            ]);

            \Log::info('Price list created:', $newPriceList->toArray());

            // Then create the PPMP with the new price list ID
            $ppmp = Ppmp::create([
                'aip_entry_id' => $validated['aip_entry_id'],
                'ppmp_price_list_id' => $newPriceList->id,
                // Set all monthly quantities and amounts to 0 by default
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
            
            \Log::info('PPMP created:', $ppmp->toArray());

            return back()->with('success', 'Custom PPMP item created successfully');
        } catch (\Exception $e) {
            \Log::error('Custom PPMP Creation Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with(
                'error',
                'Failed to create custom PPMP item: ' . $e->getMessage(),
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePpmpRequest $request)
    {
        $validated = $request->validated();

        // Debug logging
        \Log::info('PPMP Store Request:', $validated);

        try {
            // Create PPMP with default values for all monthly fields
            $ppmp = Ppmp::create([
                'aip_entry_id' => $validated['aip_entry_id'],
                'ppmp_price_list_id' => $validated['ppmp_price_list_id'],
                // Set all monthly quantities and amounts to 0 by default
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
            
            \Log::info('PPMP Created:', $ppmp->toArray());

            return back()->with('success', 'PPMP item created successfully');
        } catch (\Exception $e) {
            \Log::error('PPMP Creation Error:', ['error' => $e->getMessage()]);
            return back()->with(
                'error',
                'Failed to create PPMP item: ' . $e->getMessage(),
            );
        }
    }

    /**
     * Update monthly quantity for a PPMP item.
     */
    public function updateMonthlyQuantity(Request $request, Ppmp $ppmp)
    {
        $validated = $request->validate([
            'month' =>
                'required|in:jan_qty,feb_qty,mar_qty,apr_qty,may_qty,jun_qty,jul_qty,aug_qty,sep_qty,oct_qty,nov_qty,dec_qty',
            'quantity' => 'required|numeric|min:0',
        ]);

        $monthColumn = $validated['month'];
        $quantity = $validated['quantity'];

        // Get unit price from the price list relationship
        $unitPrice = $ppmp->ppmpPriceList?->price ?? 0;

        // Calculate amount (quantity × unit_price)
        $amountColumn = str_replace('_qty', '_amount', $monthColumn);

        // Update both quantity and amount
        $ppmp->update([
            $monthColumn => $quantity,
            $amountColumn => $quantity * $unitPrice,
        ]);

        return back()->with('success', 'PPMP item updated successfully');
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
        try {
            // Log the deletion attempt
            \Log::info('Attempting to delete PPMP item:', [
                'id' => $ppmp->id,
                'description' => $ppmp->item_description,
            ]);

            // Delete the PPMP item
            $ppmp->delete();

            \Log::info('PPMP item deleted successfully:', ['id' => $ppmp->id]);

            return back()->with('success', 'PPMP item deleted successfully');
        } catch (\Exception $e) {
            \Log::error('PPMP Deletion Error:', [
                'error' => $e->getMessage(),
                'ppmp_id' => $ppmp->id,
            ]);

            return back()->with(
                'error',
                'Failed to delete PPMP item: ' . $e->getMessage(),
            );
        }
    }
}
