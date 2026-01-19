<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAipEntryRequest extends FormRequest
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
            // Ensure ppa_ids is an array and not empty
            'ppa_ids' => 'required|array|min:1',

            // Ensure every ID inside the array exists in the ppas table
            'ppa_ids.*' => 'exists:ppas,id',
        ];
    }
}
