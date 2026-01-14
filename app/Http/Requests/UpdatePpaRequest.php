<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePpaRequest extends FormRequest
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
                // REMOVE reference_code because the system manages it.
                // We only allow updating the description and the office_id (though office is usually locked)
                // 'description' => 'required|string|max:255',
                // 'office_id' => 'required|exists:offices,id',
            ];
    }
}
