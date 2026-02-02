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

    // --- HALAMAN PRODUK UNTUK USER (SISI PEMBELI) ---
    // DISESUAIKAN: Menggunakan 'user/product' (p kecil) sesuai folder kamu
    Route::get('/products', function () {
        return Inertia::render('user/product'); 
    })->name('user.products');

    // --- CRUD PRODUK (SISI ADMIN / DASHBOARD) ---
    Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::get('/produk/create', [ProdukController::class, 'create'])->name('produk.create');
    Route::post('/produk', [ProdukController::class, 'store'])->name('produk.store');
    Route::resource('produk', ProdukController::class)->except(['index', 'create', 'store']);
    
    // --- KATEGORI ---
    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::resource('kategori', KategoriController::class)->except(['index']);
    
    // --- DATA USERS ---
    Route::get('/pengguna', [UserController::class, 'index'])->name('user.index');
    Route::post('/pengguna', [UserController::class, 'store'])->name('user.store');
    Route::put('/pengguna/{id}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/pengguna/{id}', [UserController::class, 'destroy'])->name('user.destroy');

    // --- DATA ULASAN ---
    Route::get('/ulasan', [ReviewController::class, 'index'])->name('ulasan.index');
    Route::get('/ulasan/create', [ReviewController::class, 'create'])->name('ulasan.create');
    Route::post('/ulasan', [ReviewController::class, 'store'])->name('ulasan.store');
    Route::delete('/ulasan/{id}', [ReviewController::class, 'destroy'])->name('ulasan.destroy');

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';