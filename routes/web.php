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

Route::get('/aip', [AipController::class, 'index'])->name("aip.index");

Route::post('/aip-store', [AipController::class, 'store']);

Route::post('/aip-store-child/{id}', [AipController::class, 'storeChild']);

Route::patch('/aip-update/{id}', [AipController::class, 'update']);

Route::delete('/aip-delete/{id}', [AipController::class, 'delete']);

require __DIR__ . '/settings.php';
