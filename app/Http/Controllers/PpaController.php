<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePpaRequest;
use App\Http\Requests\UpdatePpaRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Models\Ppa;
use App\Models\Office;
use App\Models\Sector;
use App\Models\LguLevel;
use App\Models\OfficeType;

class PpaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userOfficeId = Auth::user()->office_id;

        // dd($userOfficeId);

        $ppaTree = Ppa::where('office_id', $userOfficeId)
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->with([
                'office',

                'children' => fn($q) => $q->orderBy('sort_order'),
                'children.office',

                'children.children' => fn($q) => $q->orderBy('sort_order'),
                'children.children.office',

                'children.children.children' => fn($q) => $q->orderBy(
                    'sort_order',
                ),
                'children.children.children.office',
            ])
            ->get();

        $offices = Office::with(['sector', 'lguLevel', 'officeType'])->get();

        return Inertia::render('ppa/index', [
            'ppaTree' => $ppaTree,
            'offices' => $offices,
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
    public function store(StorePpaRequest $request)
    {
        $validated = $request->validated();

        Ppa::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ppa $ppa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ppa $ppa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePpaRequest $request, Ppa $ppa)
    {
        $validated = $request->validated();

        $ppa->update($validated);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ppa $ppa)
    {
        // This will delete the PPA and its children if you have
        // a cascade delete set up in your migration.
        $ppa->delete();

        return redirect()->back()->with('success', 'Entry deleted.');
    }

    // reorder
    public function reorder(Request $request)
    {
        $activeId = $request->active_id;
        $overId = $request->over_id;

        // 1. Get the item being moved
        $movingItem = Ppa::findOrFail($activeId);

        // 2. Get all siblings in their current order
        $siblings = Ppa::where('parent_id', $movingItem->parent_id)
            ->orderBy('sort_order')
            ->get();

        $ids = $siblings->pluck('id')->toArray();

        // 3. Remove moving ID and find where to insert it
        $oldIndex = array_search($activeId, $ids);
        $newIndex = array_search($overId, $ids);

        array_splice($ids, $oldIndex, 1);
        array_splice($ids, $newIndex, 0, $activeId);

        // 4. Batch update the sort_order column
        foreach ($ids as $index => $id) {
            Ppa::where('id', $id)->update(['sort_order' => $index]);
        }

        // return response()->json(['status' => 'success']);
    }
}
