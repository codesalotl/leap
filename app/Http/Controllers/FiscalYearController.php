<?php

namespace App\Http\Controllers;

use App\Models\FiscalYear;
use App\Models\AipEntry;
use App\Models\Ppa;
use App\Models\Ppmp;
use App\Http\Requests\StoreFiscalYearRequest;
use App\Http\Requests\UpdateFiscalYearRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class FiscalYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('aip/index', [
            'fiscalYears' => FiscalYear::all(),
            'app' => Inertia::optional(function () use ($request) {
                $id = $request->query('fiscal_year_id');

                if (!$id) {
                    return null;
                }

                return Ppmp::with(['ppmpPriceList']) // Eager load the relationship
                    ->whereHas('aipEntry', function ($query) use ($id) {
                        $query->where('fiscal_year_id', $id);
                    })
                    ->get()
                    ->map(function ($item) {
                        // Quarterly Quantities
                        $item->q1_qty =
                            (float) $item->jan_qty +
                            (float) $item->feb_qty +
                            (float) $item->mar_qty;
                        $item->q2_qty =
                            (float) $item->apr_qty +
                            (float) $item->may_qty +
                            (float) $item->jun_qty;
                        $item->q3_qty =
                            (float) $item->jul_qty +
                            (float) $item->aug_qty +
                            (float) $item->sep_qty;
                        $item->q4_qty =
                            (float) $item->oct_qty +
                            (float) $item->nov_qty +
                            (float) $item->dec_qty;

                        // Quarterly Amounts
                        $item->q1_amount =
                            (float) $item->jan_amount +
                            (float) $item->feb_amount +
                            (float) $item->mar_amount;
                        $item->q2_amount =
                            (float) $item->apr_amount +
                            (float) $item->may_amount +
                            (float) $item->jun_amount;
                        $item->q3_amount =
                            (float) $item->jul_amount +
                            (float) $item->aug_amount +
                            (float) $item->sep_amount;
                        $item->q4_amount =
                            (float) $item->oct_amount +
                            (float) $item->nov_amount +
                            (float) $item->dec_amount;

                        // Grand Totals
                        $item->total_qty =
                            $item->q1_qty +
                            $item->q2_qty +
                            $item->q3_qty +
                            $item->q4_qty;
                        $item->total_amount =
                            $item->q1_amount +
                            $item->q2_amount +
                            $item->q3_amount +
                            $item->q4_amount;

                        return $item;
                    });
            }),
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
    public function store(StoreFiscalYearRequest $request)
    {
        FiscalYear::create($request->validated());
    }

    /**
     * Display the specified resource.
     */
    public function show(FiscalYear $fiscalYear)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FiscalYear $fiscalYear)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateFiscalYearRequest $request,
        FiscalYear $fiscal_year,
    ) {
        // $fiscal_year->update($request->validated());
    }

    // update fiscal year status
    public function updateStatus(Request $request, FiscalYear $fiscalYear)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive,closed',
        ]);

        $fiscalYear->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FiscalYear $fiscalYear)
    {
        //
    }
}
