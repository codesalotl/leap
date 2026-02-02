<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePpmpPriceListRequest extends FormRequest
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
            // 'item_code' => 'required|string|max:50|unique:ppmp_price_lists,item_code,' . $this->ppmpPriceList->id,
            'item_number' =>
                'required|integer|unique:ppmp_price_lists,item_number,' .
                $this->ppmpPriceList->id,
            'description' => 'required|string|max:255',
            'unit_of_measurement' => 'required|string|max:20',
            'price' => 'required|numeric|min:0|max:99999999999999999.99',
            'chart_of_account_id' => 'required|exists:chart_of_accounts,id',
        ];
    }
}
