<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Aip;
use App\Models\Program;

class AipController extends Controller
{
    public function index()
    {
        $data = Aip::all();
        $programs = Program::all();
        return Inertia::render('aip/aip-table', [
            'data' => $data,
            'programs' => $programs,
        ]);
    }

    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'aipRefCode' => 'required|string',
    //         'ppaDescription' => 'required|string',
    //         'implementingOfficeDepartmentLocation' => 'required|string',
    //         'scheduleOfImplementation' => 'required|array',
    //         'scheduleOfImplementation.startingDate' => 'required|date',
    //         'scheduleOfImplementation.completionDate' =>
    //             'required|date|after:scheduleOfImplementation.startingDate',
    //         'expectedOutputs' => 'required|string',
    //         'fundingSource' => 'required|string',
    //         'amount' => 'required|array',
    //         'amount.ps' => 'required|numeric|min:0',
    //         'amount.mooe' => 'required|numeric|min:0',
    //         'amount.fe' => 'required|numeric|min:0',
    //         'amount.co' => 'required|numeric|min:0',
    //         'amount.total' => 'required|numeric|min:0',
    //         'amountOfCcExpenditure' => 'required|array',
    //         'amountOfCcExpenditure.ccAdaptation' => 'required|numeric|min:0',
    //         'amountOfCcExpenditure.ccMitigation' => 'required|numeric|min:0',
    //         'ccTypologyCode' => 'required|string',
    //     ]);

    //     $flattenedData = [
    //         'aipRefCode' => $validatedData['aipRefCode'],
    //         'ppaDescription' => $validatedData['ppaDescription'],
    //         'implementingOfficeDepartmentLocation' =>
    //             $validatedData['implementingOfficeDepartmentLocation'],
    //         'startingDate' =>
    //             $validatedData['scheduleOfImplementation']['startingDate'],
    //         'completionDate' =>
    //             $validatedData['scheduleOfImplementation']['completionDate'],
    //         'expectedOutputs' => $validatedData['expectedOutputs'],
    //         'fundingSource' => $validatedData['fundingSource'],
    //         'ps' => $validatedData['amount']['ps'],
    //         'mooe' => $validatedData['amount']['mooe'],
    //         'fe' => $validatedData['amount']['fe'],
    //         'co' => $validatedData['amount']['co'],
    //         'total' => $validatedData['amount']['total'],
    //         'ccAdaptation' =>
    //             $validatedData['amountOfCcExpenditure']['ccAdaptation'],
    //         'ccMitigation' =>
    //             $validatedData['amountOfCcExpenditure']['ccMitigation'],
    //         'ccTypologyCode' => $validatedData['ccTypologyCode'],
    //     ];

    //     $aip = Aip::create($flattenedData);
    // }

    public function store(Request $request)
    {
        $id = $request->input('programId');

        $program = Program::findOrFail($id);

        $flattenedData = [
            'aipRefCode' => $program->{'aip-ref-code'},
            'ppaDescription' => $program->name,
            'implementingOfficeDepartmentLocation' => null,
            'startingDate' => null,
            'completionDate' => null,
            'expectedOutputs' => null,
            'fundingSource' => null,
            'ps' => null,
            'mooe' => null,
            'fe' => null,
            'co' => null,
            'total' => null,
            'ccAdaptation' => null,
            'ccMitigation' => null,
            'ccTypologyCode' => null,
        ];

        $aip = Aip::create($flattenedData);
    }

    public function storeChild(Request $request, $id)
    {
        $collectionId = $request->input('collectionId');

        // 1. Fetch the Parent to get its base aipRefCode
        $parent = Aip::findOrFail($id);
        $parentRefCode = $parent->aipRefCode;

        // 2. Fetch all children to determine the next sequence
        $children = Aip::where('parentId', $id)->get();

        if ($children->isEmpty()) {
            // If no children, start with -001
            $newRefCode = $parentRefCode . '-001';
        } else {
            // If children exist, find the highest suffix
            $maxSuffix = $children
                ->map(function ($child) {
                    // Get the last segment after the last hyphen
                    $parts = explode('-', $child->aipRefCode);
                    return (int) end($parts);
                })
                ->max();

            // Increment the max suffix and pad with zeros (e.g., 2 becomes 003)
            $newSuffix = str_pad($maxSuffix + 1, 3, '0', STR_PAD_LEFT);
            $newRefCode = $parentRefCode . '-' . $newSuffix;
        }

        $validatedData = $request->validate([
            // Note: aipRefCode is no longer required from request as we generate it
            'ppaDescription' => 'required|string',
            'implementingOfficeDepartmentLocation' => 'required|string',
            'scheduleOfImplementation' => 'required|array',
            'scheduleOfImplementation.startingDate' => 'required|string',
            'scheduleOfImplementation.completionDate' => 'required|string',
            'expectedOutputs' => 'required|string',
            'fundingSource' => 'required|string',
            'amount' => 'required|array',
            'amount.ps' => 'required|numeric|min:0',
            'amount.mooe' => 'required|numeric|min:0',
            'amount.fe' => 'required|numeric|min:0',
            'amount.co' => 'required|numeric|min:0',
            'amount.total' => 'required|numeric|min:0',
            'amountOfCcExpenditure' => 'required|array',
            'amountOfCcExpenditure.ccAdaptation' => 'required|numeric|min:0',
            'amountOfCcExpenditure.ccMitigation' => 'required|numeric|min:0',
            'ccTypologyCode' => 'required|string',
        ]);

        $flattenedData = [
            'aipRefCode' => $newRefCode, // Using the generated code
            'ppaDescription' => $validatedData['ppaDescription'],
            'implementingOfficeDepartmentLocation' =>
                $validatedData['implementingOfficeDepartmentLocation'],
            'startingDate' =>
                $validatedData['scheduleOfImplementation']['startingDate'],
            'completionDate' =>
                $validatedData['scheduleOfImplementation']['completionDate'],
            'expectedOutputs' => $validatedData['expectedOutputs'],
            'fundingSource' => $validatedData['fundingSource'],
            'ps' => $validatedData['amount']['ps'],
            'mooe' => $validatedData['amount']['mooe'],
            'fe' => $validatedData['amount']['fe'],
            'co' => $validatedData['amount']['co'],
            'total' => $validatedData['amount']['total'],
            'ccAdaptation' =>
                $validatedData['amountOfCcExpenditure']['ccAdaptation'],
            'ccMitigation' =>
                $validatedData['amountOfCcExpenditure']['ccMitigation'],
            'ccTypologyCode' => $validatedData['ccTypologyCode'],
            'parentId' => $id,
            'aip_collection_id' => $collectionId,
        ];

        $newChild = Aip::create($flattenedData);
    }

    public function update(Request $request, $id)
    {
        $aip = Aip::findOrFail($id);

        $validatedData = $request->validate([
            'aipRefCode' => 'required|string',
            'ppaDescription' => 'required|string',
            'implementingOfficeDepartmentLocation' => 'required|string',
            'scheduleOfImplementation' => 'required|array',
            'scheduleOfImplementation.startingDate' => 'required|string',
            'scheduleOfImplementation.completionDate' => 'required|string',
            'expectedOutputs' => 'required|string',
            'fundingSource' => 'required|string',
            'amount' => 'required|array',
            'amount.ps' => 'required|numeric|min:0',
            'amount.mooe' => 'required|numeric|min:0',
            'amount.fe' => 'required|numeric|min:0',
            'amount.co' => 'required|numeric|min:0',
            'amount.total' => 'required|numeric|min:0',
            'amountOfCcExpenditure' => 'required|array',
            'amountOfCcExpenditure.ccAdaptation' => 'required|numeric|min:0',
            'amountOfCcExpenditure.ccMitigation' => 'required|numeric|min:0',
            'ccTypologyCode' => 'required|string',
        ]);

        $flattenedData = [
            'aipRefCode' => $validatedData['aipRefCode'],
            'ppaDescription' => $validatedData['ppaDescription'],
            'implementingOfficeDepartmentLocation' =>
                $validatedData['implementingOfficeDepartmentLocation'],
            'startingDate' =>
                $validatedData['scheduleOfImplementation']['startingDate'],
            'completionDate' =>
                $validatedData['scheduleOfImplementation']['completionDate'],
            'expectedOutputs' => $validatedData['expectedOutputs'],
            'fundingSource' => $validatedData['fundingSource'],
            'ps' => $validatedData['amount']['ps'],
            'mooe' => $validatedData['amount']['mooe'],
            'fe' => $validatedData['amount']['fe'],
            'co' => $validatedData['amount']['co'],
            'total' => $validatedData['amount']['total'],
            'ccAdaptation' =>
                $validatedData['amountOfCcExpenditure']['ccAdaptation'],
            'ccMitigation' =>
                $validatedData['amountOfCcExpenditure']['ccMitigation'],
            'ccTypologyCode' => $validatedData['ccTypologyCode'],
        ];

        $aip->update($flattenedData);

        // return redirect()->back();
    }

    public function destroy($id)
    {
        $aip = Aip::findOrFail($id);
        $aip->delete();
    }
}
