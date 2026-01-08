<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePpaRequest extends FormRequest
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
            // REMOVE reference_code from here because the backend generates it now!

            'description' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:aip_ppas,id',

            // ADD office_id validation
            // It is required if there is no parent_id (Top-level Program)
            'office_id' => 'required_without:parent_id|exists:offices,id',
        ];
    }
}
