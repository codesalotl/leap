<?php

use App\Http\Controllers\AipCollectionController;
use App\Http\Controllers\PpaListController;
use App\Http\Controllers\LguProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\AipController;
use App\Http\Controllers\AipRefCodeController;
use App\Http\Controllers\PpaController;
use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\AipEntryController;
use App\Http\Controllers\AipSummaryController;
use App\Http\Controllers\FiscalYearController;

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

// Route::get('aip', [AipController::class, 'index']);
// Route::post('aip/{id}', [AipController::class, 'storeChild']);
// Route::post('aip', [AipController::class, 'store']);
// Route::patch('aip/{id}', [AipController::class, 'update']);
// Route::delete('aip/{id}', [AipController::class, 'destroy']);

Route::get('aip-ref-code', [AipRefCodeController::class, 'index']);

Route::get('home', function () {
    return Inertia::render('home');
});

// Route::get('aip-collections', [AipCollectionController::class, 'index']);
// Route::get('aip-collections/{id}', [AipCollectionController::class, 'show']);
// Route::post('aip-collections', [AipCollectionController::class, 'store']);

Route::get('ppa-list', [PpaListController::class, 'index']);
Route::patch('ppa-list/{program}', [PpaListController::class, 'update']);

Route::get('lgu-profile', [LguProfileController::class, 'index']);

// aip ppa - master list for ppa
Route::get('aip-ppa', [PpaController::class, 'index']);
Route::post('aip-ppa', [PpaController::class, 'store'])->name('aip-ppa.store');
Route::patch('/aip-ppa/{aip_ppa}', [PpaController::class, 'update'])->name(
    'aip-ppa.update',
);
Route::delete('/aip-ppa/{aipPpa}', [PpaController::class, 'destroy'])->name(
    'aip-ppa.destroy',
);

Route::get('chart-of-accounts', [ChartOfAccountController::class, 'index']);

Route::get('sectors', [SectorController::class, 'index']);

Route::get('offices', [OfficeController::class, 'index']);
Route::post('offices', [OfficeController::class, 'store'])->name(
    'offices.store',
);
Route::put('offices/{office}', [OfficeController::class, 'update'])->name(
    'offices.update',
);
Route::delete('offices/{office}', [OfficeController::class, 'destroy'])->name(
    'offices.destroy',
);

// aip
Route::get('aip', [FiscalYearController::class, 'index']);
Route::post('aip', [FiscalYearController::class, 'store']);
Route::patch('/aip/{aip}', [FiscalYearController::class, 'update']);
// Route::get('aip/{aip}', [FiscalYearController::class, 'show']);

// aip summary
Route::prefix('aip/{fiscalYear}')->group(function () {
    Route::get('summary', [AipEntryController::class, 'index']);
});

// Route::get('ppa', [PpaController::class, 'index']);
Route::get('ppa', [PpaController::class, 'index'])->name('ppa.index');
Route::post('ppas', [PpaController::class, 'store'])->name('ppas.store');
Route::patch('ppas/{ppa}', [PpaController::class, 'update'])->name(
    'ppas.update',
);
Route::delete('ppas/{ppa}', [PpaController::class, 'destroy'])->name(
    'ppas.destroy',
);

Route::get('aip-entries', [AipEntryController::class, 'index']);
// View the AIP Summary Table
// Route::get('/aip/{aip}/summary', [AipEntryController::class, 'show'])->name(
//     'aip.summary',
// );
// Handle the Import Modal Logic
// Route::post('/aip/{aip}/import', [AipController::class, 'importPpas'])->name(
//     'aip.import-ppas',
// );

Route::get('aip-summary', [AipSummaryController::class, 'index']);

require __DIR__ . '/settings.php';
