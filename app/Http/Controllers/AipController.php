<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Aip;

class AipController extends Controller
{
    public function index()
    {
        $data = Aip::all();

        return Inertia::render('aip/aip-table', ['data' => $data]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'aipRefCode' => 'required|string',
            'ppaDescription' => 'required|string',
            'implementingOfficeDepartmentLocation' => 'required|string',
            'scheduleOfImplementation' => 'required|array',
            'scheduleOfImplementation.startingDate' => 'required|date',
            'scheduleOfImplementation.completionDate' =>
                'required|date|after:scheduleOfImplementation.startingDate',
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

        // Flatten the nested data
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

        $aip = Aip::create($flattenedData);

        // return to_route('aip.index');
    }

    public function storeChild(Request $request, $id)
    {
        $validatedData = $request->validate([
            'aipRefCode' => 'required|string',
            'ppaDescription' => 'required|string',
            'implementingOfficeDepartmentLocation' => 'required|string',
            'scheduleOfImplementation' => 'required|array',
            'scheduleOfImplementation.startingDate' => 'required|date',
            'scheduleOfImplementation.completionDate' =>
                'required|date|after:scheduleOfImplementation.startingDate',
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

        // Flatten the nested data
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
            'parentId' => $id,
        ];

        $aip = Aip::create($flattenedData);

        // return to_route('aip.index');
    }

    public function update(Request $request, $id)
    {
        $aip = Aip::findOrFail($id);

        $validatedData = $request->validate([
            'aipRefCode' => 'required|string',
            'ppaDescription' => 'required|string',
            'implementingOfficeDepartmentLocation' => 'required|string',
            'scheduleOfImplementation' => 'required|array',
            'scheduleOfImplementation.startingDate' => 'required|date',
            'scheduleOfImplementation.completionDate' =>
                'required|date|after:scheduleOfImplementation.startingDate',
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

        return redirect()->back();
    }

    public function delete($id)
    {
        $aip = Aip::findOrFail($id);
        $aip->delete();
    }
}
