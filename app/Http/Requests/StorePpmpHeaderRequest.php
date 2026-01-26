<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePpmpHeaderRequest extends FormRequest
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
            'aip_entry_id' => 'required|exists:aip_entries,id',
            'office_id' => 'required|exists:offices,id',
            'procurement_type' => 'required|in:Goods,Services,Civil Works,Consulting',
            'procurement_method' => 'required|in:Public Bidding,Direct Purchase,Shopping,Limited Source Bidding,Negotiated Procurement',
            'implementation_schedule' => 'nullable|date',
            'source_of_funds' => 'nullable|string|max:255',
            'approved_budget' => 'required|numeric|min:0',
        ];
    }
}
