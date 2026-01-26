<?php

namespace App\Http\Controllers;

use App\Models\PpmpItem;
use App\Models\PpmpHeader;
use App\Models\PpmpPriceList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpmpItemController extends Controller
{
    /**
     * Display a listing of PPMP items for a specific header.
     */
    public function index(Request $request, $ppmpHeaderId)
    {
        $ppmpHeader = PpmpHeader::with(['aipEntry', 'office', 'createdBy'])
            ->findOrFail($ppmpHeaderId);

        $ppmpItems = PpmpItem::with(['ppmpPriceList'])
            ->where('ppmp_header_id', $ppmpHeaderId)
            ->get();

        $ppmpPriceList = PpmpPriceList::all();

        return Inertia::render('ppmp/items/index', [
            'ppmpHeader' => $ppmpHeader,
            'ppmpItems' => $ppmpItems,
            'ppmpPriceList' => $ppmpPriceList,
        ]);
    }

    /**
     * Show the form for creating a new PPMP item.
     */
    public function create($ppmpHeaderId)
    {
        $ppmpHeader = PpmpHeader::findOrFail($ppmpHeaderId);
        $ppmpPriceList = PpmpPriceList::all();

        return Inertia::render('ppmp/items/create', [
            'ppmpHeader' => $ppmpHeader,
            'ppmpPriceList' => $ppmpPriceList,
        ]);
    }

    /**
     * Store a newly created PPMP item in storage.
     */
    public function store(Request $request, $ppmpHeaderId)
    {
        $validated = $request->validate([
            'ppmp_price_list_id' => 'required|exists:ppmp_price_lists,id',
            'quantity' => 'required|numeric|min:0',
            'unit_price' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'specifications' => 'nullable|string',
            'jan_qty' => 'required|integer|min:0|max:12',
            'jan_amount' => 'required|numeric|min:0',
            'feb_qty' => 'required|integer|min:0|max:12',
            'feb_amount' => 'required|numeric|min:0',
            'mar_qty' => 'required|integer|min:0|max:12',
            'mar_amount' => 'required|numeric|min:0',
            'apr_qty' => 'required|integer|min:0|max:12',
            'apr_amount' => 'required|numeric|min:0',
            'may_qty' => 'required|integer|min:0|max:12',
            'may_amount' => 'required|numeric|min:0',
            'jun_qty' => 'required|integer|min:0|max:12',
            'jun_amount' => 'required|numeric|min:0',
            'jul_qty' => 'required|integer|min:0|max:12',
            'jul_amount' => 'required|numeric|min:0',
            'aug_qty' => 'required|integer|min:0|max:12',
            'aug_amount' => 'required|numeric|min:0',
            'sep_qty' => 'required|integer|min:0|max:12',
            'sep_amount' => 'required|numeric|min:0',
            'oct_qty' => 'required|integer|min:0|max:12',
            'oct_amount' => 'required|numeric|min:0',
            'nov_qty' => 'required|integer|min:0|max:12',
            'nov_amount' => 'required|numeric|min:0',
            'dec_qty' => 'required|integer|min:0|max:12',
            'dec_amount' => 'required|numeric|min:0',
        ]);

        $validated['ppmp_header_id'] = $ppmpHeaderId;

        PpmpItem::create($validated);

        return redirect()->route('ppmp-items.index', $ppmpHeaderId)
            ->with('success', 'PPMP Item created successfully!');
    }

    /**
     * Display the specified PPMP item.
     */
    public function show($ppmpHeaderId, $ppmpItemId)
    {
        //
    }

    /**
     * Show the form for editing the specified PPMP item.
     */
    public function edit($ppmpHeaderId, $ppmpItemId)
    {
        //
    }

    /**
     * Update the specified PPMP item in storage.
     */
    public function update(Request $request, $ppmpHeaderId, $ppmpItemId)
    {
        //
    }

    /**
     * Remove the specified PPMP item from storage.
     */
    public function destroy($ppmpHeaderId, $ppmpItemId)
    {
        //
    }
}
