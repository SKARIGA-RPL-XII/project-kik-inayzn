<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategoriController; 
use App\Http\Controllers\ReviewController;
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
    
    Route::get('/', function () {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('user.dashboard');
    })->name('home');

    // Dashboard
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::get('/user/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('user.dashboard');

    // CRUD Produk
    Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::resource('produk', ProdukController::class)->except(['index']);
    
    // 2. TAMBAHKAN ROUTE KATEGORI DI SINI
    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::resource('kategori', KategoriController::class)->except(['index']);
    
    // Data Users
    Route::get('/pengguna', [UserController::class, 'index'])->name('user.index');
    Route::delete('/pengguna/{id}', [UserController::class, 'destroy'])->name('user.destroy');

    //Data Ulasan
    Route::get('/ulasan', [ReviewController::class, 'index'])->name('ulasan.index');
    Route::delete('/ulasan/{id}', [ReviewController::class, 'destroy'])->name('ulasan.destroy');

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';