<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MasterData\CategoryController;
use App\Http\Controllers\MasterData\VariantGroupController;
use App\Http\Controllers\MasterData\VariantOptionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // User Management Routes
    Route::middleware(['role:admin'])->group(function () {
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('/create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('/{user}', [UserController::class, 'show'])->name('show');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        });
        
        // Category Management Routes
        Route::prefix('categories')->name('categories.')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->name('index');
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
        });

        // Variant Group Management Routes
        Route::prefix('variant-groups')->name('admin.variant-groups.')->group(function () {
            Route::get('/', [VariantGroupController::class, 'index'])->name('index');
            Route::get('/create', [VariantGroupController::class, 'create'])->name('create');
            Route::post('/', [VariantGroupController::class, 'store'])->name('store');
            Route::get('/{variantGroup}', [VariantGroupController::class, 'show'])->name('show');
            Route::get('/{variantGroup}/edit', [VariantGroupController::class, 'edit'])->name('edit');
            Route::put('/{variantGroup}', [VariantGroupController::class, 'update'])->name('update');
            Route::delete('/{variantGroup}', [VariantGroupController::class, 'destroy'])->name('destroy');
        });

        // Variant Option Management Routes
        Route::prefix('variant-options')->name('admin.variant-options.')->group(function () {
            Route::get('/', [VariantOptionController::class, 'index'])->name('index');
            Route::get('/variant-group/{variantGroup}/manage', [VariantOptionController::class, 'manage'])->name('manage');
            Route::get('/create', [VariantOptionController::class, 'create'])->name('create');
            Route::post('/', [VariantOptionController::class, 'store'])->name('store');
            Route::get('/{variantOption}', [VariantOptionController::class, 'show'])->name('show');
            Route::get('/{variantOption}/edit', [VariantOptionController::class, 'edit'])->name('edit');
            Route::put('/{variantOption}', [VariantOptionController::class, 'update'])->name('update');
            Route::delete('/{variantOption}', [VariantOptionController::class, 'destroy'])->name('destroy');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
