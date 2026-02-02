<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategoriController; 
use App\Http\Controllers\ReviewController;
use App\Models\Product; // <--- WAJIB TAMBAH INI
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

    // Dashboard Switcher
    Route::get('/dashboard', function () {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('user.dashboard');
    });

    // Dashboard Admin
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard'); 
    })->name('admin.dashboard');

    // Dashboard User (Home) - SEKARANG MEMBAWA DATA PRODUK
    Route::get('/user/dashboard', function () {
        return Inertia::render('user/dashboard', [
            'products' => Product::where('status', 'aktif')->latest()->take(6)->get()
        ]); 
    })->name('user.dashboard');

    // --- PROPERTI (Halaman List Semua Produk) ---
    Route::get('/products', function () {
        return Inertia::render('user/product', [
            'products' => Product::where('status', 'aktif')->latest()->get()
        ]); 
    })->name('user.products');

    // --- TERSIMPAN ---
    Route::get('/saved-properties', function () {
        return Inertia::render('user/simpan'); 
    })->name('user.saved');

    // --- SIMULATOR KPR ---
    Route::get('/simulator-kpr', function () {
        return Inertia::render('user/kpr'); 
    })->name('user.kpr');

    // --- PROFIL USER ---
    Route::get('/profile', function () {
        return Inertia::render('user/profil'); 
    })->name('user.profile');

    // --- FITUR GANTI FOTO PROFIL ---
    Route::post('/profile/avatar', [UserController::class, 'updateAvatar'])->name('user.profile.avatar');

    // --- CRUD PRODUK (ADMIN SIDE) ---
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