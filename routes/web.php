<?php

use App\Http\Controllers\AipCollectionController;
use App\Http\Controllers\PpaListController;
use App\Http\Controllers\LguProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AipController;
use App\Http\Controllers\AipRefCodeController;

Route::get(
    '/',
    fn() => Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]),
)->name('home');

Route::middleware(['auth', 'verified'])->group(
    fn() => Route::get('dashboard', fn() => Inertia::render('dashboard'))->name(
        'dashboard',
    ),
);

Route::get('aip', [AipController::class, 'index']);
Route::post('aip/{id}', [AipController::class, 'storeChild']);
Route::post('aip', [AipController::class, 'store']);
Route::patch('aip/{id}', [AipController::class, 'update']);
Route::delete('aip/{id}', [AipController::class, 'destroy']);

Route::get('aip-ref-code', [AipRefCodeController::class, 'index']);

Route::get('home', function () {
    return Inertia::render('home');
});

Route::get('aip-collections', [AipCollectionController::class, 'index']);
Route::get('aip-collections/{id}', [AipCollectionController::class, 'show']);
Route::post('aip-collections', [AipCollectionController::class, 'store']);

Route::get('ppa-list', [PpaListController::class, 'index']);
Route::patch('ppa-list/{program}', [PpaListController::class, 'update']);

Route::get('lgu-profile', [LguProfileController::class, 'index']);

require __DIR__ . '/settings.php';
