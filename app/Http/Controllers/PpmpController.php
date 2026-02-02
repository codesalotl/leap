<?php

namespace App\Http\Controllers;

use App\Models\Ppmp;
use App\Http\Requests\StorePpmpRequest;
use App\Http\Requests\UpdatePpmpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PpmpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        
        // Debug logging
        \Log::info('PPMP Store Request:', $validated);
        
        try {
            $ppmp = Ppmp::create($validated);
            \Log::info('PPMP Created:', $ppmp->toArray());
            
            return back()->with('success', 'PPMP item created successfully');
        } catch (\Exception $e) {
            \Log::error('PPMP Creation Error:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create PPMP item: ' . $e->getMessage());
        }
    }

    /**
     * Update monthly quantity for a PPMP item.
     */
    public function updateMonthlyQuantity(Request $request, Ppmp $ppmp)
    {
        $validated = $request->validate([
            'month' => 'required|in:jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec',
            'quantity' => 'required|numeric|min:0',
        ]);

        $month = $validated['month'];
        $quantity = $validated['quantity'];
        
        // Update quantity
        $ppmp->{$month . '_qty'} = $quantity;
        
        // Calculate amount (quantity × unit_price)
        $unitPrice = $ppmp->unit_price;
        $ppmp->{$month . '_amount'} = $quantity * $unitPrice;
        
        $ppmp->save();
        
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
            \Log::info('Attempting to delete PPMP item:', ['id' => $ppmp->id, 'description' => $ppmp->item_description]);
            
            // Delete the PPMP item
            $ppmp->delete();
            
            \Log::info('PPMP item deleted successfully:', ['id' => $ppmp->id]);
            
            return back()->with('success', 'PPMP item deleted successfully');
        } catch (\Exception $e) {
            \Log::error('PPMP Deletion Error:', [
                'error' => $e->getMessage(),
                'ppmp_id' => $ppmp->id
            ]);
            
            return back()->with('error', 'Failed to delete PPMP item: ' . $e->getMessage());
        }
    }
}
