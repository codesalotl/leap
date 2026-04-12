<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Illuminate\Support\Facades\Auth;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        Auth::logout();

        // Redirect back to the register page with a flash message
        return redirect()
            ->route('register')
            ->with('status', 'awaiting-approval');
    }
}
