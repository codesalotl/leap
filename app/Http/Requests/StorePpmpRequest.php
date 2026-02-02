<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePpmpRequest extends FormRequest
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
            'ppmp_price_list_id' => 'nullable|exists:ppmp_price_lists,id',
            'quantity' => 'required|numeric|min:0',
            'jan_qty' => 'required|numeric|min:0',
            'jan_amount' => 'required|numeric|min:0',
            'feb_qty' => 'required|numeric|min:0',
            'feb_amount' => 'required|numeric|min:0',
            'mar_qty' => 'required|numeric|min:0',
            'mar_amount' => 'required|numeric|min:0',
            'apr_qty' => 'required|numeric|min:0',
            'apr_amount' => 'required|numeric|min:0',
            'may_qty' => 'required|numeric|min:0',
            'may_amount' => 'required|numeric|min:0',
            'jun_qty' => 'required|numeric|min:0',
            'jun_amount' => 'required|numeric|min:0',
            'jul_qty' => 'required|numeric|min:0',
            'jul_amount' => 'required|numeric|min:0',
            'aug_qty' => 'required|numeric|min:0',
            'aug_amount' => 'required|numeric|min:0',
            'sep_qty' => 'required|numeric|min:0',
            'sep_amount' => 'required|numeric|min:0',
            'oct_qty' => 'required|numeric|min:0',
            'oct_amount' => 'required|numeric|min:0',
            'nov_qty' => 'required|numeric|min:0',
            'nov_amount' => 'required|numeric|min:0',
            'dec_qty' => 'required|numeric|min:0',
            'dec_amount' => 'required|numeric|min:0',
        ];
    }
}
