<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AipController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('aip', [AipController::class, 'index']);
Route::post('aip/{id}', [AipController::class, 'storeChild']);
Route::post('aip', [AipController::class, 'store']);
Route::patch('aip/{id}', [AipController::class, 'update']);
Route::delete('aip/{id}', [AipController::class, 'destroy']);

Route::get('/aip-ref-code', function () {
    return Inertia::render('aip/aip-ref-code-input');
});

// Route::resource('aip', AipController::class);

require __DIR__ . '/settings.php';
