<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    // Custom user form routes for create and edit
    Route::get('users/form', [UserController::class, 'form'])->name('users.form.create');
    Route::get('users/form/{user}', [UserController::class, 'form'])->name('users.form.edit');

    // Alias for delete (optional, resource already provides this)
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.delete');

    Route::resource('users', UserController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
