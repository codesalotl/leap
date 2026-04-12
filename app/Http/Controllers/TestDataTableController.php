<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ppa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestDataTableController extends Controller
{
    public function index()
    {
        $ppas = Ppa::whereNull('parent_id')
            ->with([
                'office',

                'children',
                'children.office',

                'children.children',
                'children.children.office',

                'children.children.children',
                'children.children.children.office',
            ])
            ->get();

        $yearId = 1;
        $filter = fn($q) => $q->where('fiscal_year_id', $yearId);
        $hasAip = fn($q) => $q->whereHas('aipEntries', $filter);

        $aipEntries = Ppa::whereNull('parent_id')
            ->whereHas('aipEntries', $filter)
            ->with([
                // programs
                'aipEntries' => $filter,
                'ppaFundingSources.fundingSource',
                'office.sector',
                'office.lguLevel',
                'office.officeType',

                // projects
                'children' => $hasAip,
                'children.aipEntries' => $filter,
                'children.ppaFundingSources.fundingSource',
                'children.office.sector',
                'children.office.lguLevel',
                'children.office.officeType',

                // activities
                'children.children' => $hasAip,
                'children.children.aipEntries' => $filter,
                'children.children.ppaFundingSources.fundingSource',
                'children.children.office.sector',
                'children.children.office.lguLevel',
                'children.children.office.officeType',

                // sub-activities
                'children.children.children' => $hasAip,
                'children.children.children.aipEntries' => $filter,
                'children.children.children.ppaFundingSources.fundingSource',
                'children.children.children.office.sector',
                'children.children.children.office.lguLevel',
                'children.children.children.office.officeType',
            ])
            ->get();

        return Inertia::render('test/users/index', [
            'users' => User::with('office')->get(),
            'ppas' => $ppas,
            'aipEntries' => $aipEntries,
        ]);
    }
}
