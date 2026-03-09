<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAipEntryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ppa_id' => 'required|integer',
            'aipRefCode' => 'required|string',
            'ppaDescription' => 'required|string',
            'implementingOfficeDepartmentLocation' => 'required|string',
            'fundingSource' => 'required|array|min:1',
            'fundingSource.*' => 'integer|exists:funding_sources,id',
            'scheduleOfImplementation.startingDate' => 'required|date',
            'scheduleOfImplementation.completionDate' => 'required|date',
            'expectedOutputs' => 'required|string',
            'amount.ps' => 'required|numeric',
            'amount.mooe' => 'required|numeric',
            'amount.fe' => 'required|numeric',
            'amount.co' => 'required|numeric',
            'amount.total' => 'nullable|string',
            'amountOfCcExpenditure.ccAdaptation' => 'required|numeric',
            'amountOfCcExpenditure.ccMitigation' => 'required|numeric',
            'ccTypologyCode' => 'required|string',
        ];
    }
}
