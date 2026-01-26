<?php

namespace App\Http\Controllers;

use App\Models\PpmpPriceList;
use App\Models\ChartOfAccount;
use App\Http\Requests\StorePpmpPriceListRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PpmpPriceListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $priceList = PpmpPriceList::all();
        $chartOfAccounts = ChartOfAccount::all();

        return Inertia::render('ppmp/index', [
            'priceList' => $priceList,
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
     * Store a newly created resource in storage.
     */
    public function store(StorePpmpPriceListRequest $request)
    {
        $validated = $request->validated();
        
        $priceList = PpmpPriceList::create($validated);
        
        return back()->with('success', 'Price list item created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PpmpPriceList $ppmpPriceList)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PpmpPriceList $ppmpPriceList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdatePpmpPriceListRequest $request,
        PpmpPriceList $ppmpPriceList,
    ) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PpmpPriceList $ppmpPriceList)
    {
        //
    }
}
