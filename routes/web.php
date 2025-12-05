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

Route::get('/aip', [AipController::class, 'index']);

Route::post('/aip-store', [AipController::class, 'store']);

Route::patch('/aip-update/{id}', [AipController::class, 'update']);

require __DIR__ . '/settings.php';
