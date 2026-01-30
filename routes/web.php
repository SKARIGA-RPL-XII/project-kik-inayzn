<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- GUEST: LOGIN & REGISTER ---
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});

// --- AUTH: PROTECTED ROUTES ---
Route::middleware(['auth'])->group(function () {
    
    // Redirect Utama berdasarkan Role
    Route::get('/', function () {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('user.dashboard');
    })->name('home');

    // Dashboard Admin
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    // Dashboard User
    Route::get('/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('user.dashboard');

    // CRUD Produk
    Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::resource('produk', ProdukController::class)->except(['index']);
    
    // Data Users (Berada di folder pages/user/index.tsx)
    Route::get('/users', [UserController::class, 'index'])->name('user.index');

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';