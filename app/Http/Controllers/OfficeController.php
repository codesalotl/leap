<?php

namespace App\Http\Controllers;

use App\Models\Office;
use App\Models\Sector;
use App\Models\LguLevel;
use App\Models\OfficeType;
use App\Http\Requests\StoreOfficeRequest;
use App\Http\Requests\UpdateOfficeRequest;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('offices/index', [
            'offices' => Office::with([
                'sector',
                'lguLevel',
                'officeType',
            ])->get(),
            'sectors' => Sector::all(),
            'lguLevels' => LguLevel::all(),
            'officeTypes' => OfficeType::all(),
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
    public function store(StoreOfficeRequest $request)
    {
        $validated = $request->validate([
            'sector_id' => 'required|exists:sectors,id',
            'lgu_level_id' => 'required|exists:lgu_levels,id',
            'office_type_id' => 'required|exists:office_types,id',
            'name' => 'required|string|max:100',
            'is_lee' => 'boolean',
            'code' => [
                'required',
                'string',
                'max:3',
                // Unique check: A suffix cannot be repeated for the same LGU Level + Office Type
                Rule::unique('offices')->where(
                    fn($q) => $q
                        ->where('lgu_level_id', $request->lgu_level_id)
                        ->where('office_type_id', $request->office_type_id),
                ),
            ],
        ]);

        Office::create($validated);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Office $office)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Office $office)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOfficeRequest $request, Office $office)
    {
        $validated = $request->validate([
            'sector_id' => 'required|exists:sectors,id',
            'lgu_level_id' => 'required|exists:lgu_levels,id',
            'office_type_id' => 'required|exists:office_types,id',
            'name' => 'required|string|max:100',
            'is_lee' => 'boolean',
            'code' => [
                'required',
                'string',
                'max:3',
                // Unique check while ignoring the current office record
                Rule::unique('offices')
                    ->ignore($office->id)
                    ->where(
                        fn($q) => $q
                            ->where('lgu_level_id', $request->lgu_level_id)
                            ->where('office_type_id', $request->office_type_id),
                    ),
            ],
        ]);

        $office->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Office $office)
    {
        $office->delete();

        return redirect()->back();
    }
}
