<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePpmpPriceListRequest extends FormRequest
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
            'item_code' => 'required|string|max:50|unique:ppmp_price_lists,item_code',
            'item_description' => 'required|string|max:255',
            'unit' => 'required|string|max:20',
            'unit_price' => 'required|numeric|min:0|max:99999999.99',
            'expense_class' => 'required|in:PS,MOOE,FE,CO',
            'account_code' => 'required|string|max:20|exists:chart_of_accounts,account_code',
            'procurement_type' => 'required|in:Goods,Services,Civil Works,Consulting',
            'standard_specifications' => 'nullable|string|max:1000',
        ];
    }
}
