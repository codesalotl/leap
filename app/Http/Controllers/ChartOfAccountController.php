<?php

namespace App\Http\Controllers;

use App\Models\ChartOfAccount;
use App\Http\Requests\StoreChartOfAccountRequest;
use App\Http\Requests\UpdateChartOfAccountRequest;
use Inertia\Inertia;

class ChartOfAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $chartOfAccounts = ChartOfAccount::orderBy('level')->orderBy('account_number')->get();
        
        // Build hierarchical tree structure
        $hierarchicalAccounts = $this->buildHierarchy($chartOfAccounts);

        return Inertia::render('chart-of-accounts/index', [
            'chartOfAccounts' => $hierarchicalAccounts,
        ]);
    }

    /**
     * Build hierarchical tree structure from flat collection
     */
    private function buildHierarchy($accounts, $parentId = null)
    {
        $tree = [];
        
        foreach ($accounts as $account) {
            if ($account->parent_id == $parentId) {
                $children = $this->buildHierarchy($accounts, $account->id);
                
                $accountArray = $account->toArray();
                $accountArray['children'] = $children;
                
                $tree[] = $accountArray;
            }
        }
        
        return $tree;
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
    public function store(StoreChartOfAccountRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ChartOfAccount $chartOfAccount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChartOfAccount $chartOfAccount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateChartOfAccountRequest $request,
        ChartOfAccount $chartOfAccount,
    ) {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChartOfAccount $chartOfAccount)
    {
        //
    }
}
