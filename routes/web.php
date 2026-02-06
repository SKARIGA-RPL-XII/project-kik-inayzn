<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategoriController; 
use App\Http\Controllers\ReviewController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Bisa diakses Tanpa Login)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('user.dashboard');
})->name('home');

/**
 * 1. PINDAHKAN INI KE LUAR GRUP AUTH
 * Ini adalah "pintu masuk" dashboard. 
 * Kalau sudah login, dia cek role. Kalau belum login, langsung lempar ke user dashboard.
 */
Route::get('/dashboard', function () {
    if (auth()->check()) {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('user.dashboard');
    }
    return redirect()->route('user.dashboard');
})->name('dashboard.index');

// Dashboard User - Anonim bisa masuk
Route::get('/user/dashboard', function () {
    return Inertia::render('user/dashboard', [
        'products' => Product::where('status', 'aktif')->latest()->take(6)->get(),
        'auth' => [
            'user' => auth()->user()
        ]
    ]); 
})->name('user.dashboard');

// Katalog Produk - Anonim bisa melihat list
Route::get('/products', [ProdukController::class, 'index'])->name('user.products');

// Simulator KPR
Route::get('/simulator-kpr', function () {
    return Inertia::render('user/kpr'); 
})->name('user.kpr');


/*
|--------------------------------------------------------------------------
| Guest Routes (Hanya untuk user yang BELUM login)
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});


/*
|--------------------------------------------------------------------------
| Authenticated Routes (WAJIB Login)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    
    // DETAIL PRODUK - Sesuai request: Harus login dulu
    Route::get('/products/{id}', [ProdukController::class, 'show'])->name('user.products.detail');

    // Route Admin Dashboard tetap diproteksi
    Route::get('/admin/dashboard', function () {
        return Inertia::render('admin/dashboard'); 
    })->name('admin.dashboard');

    // Fitur User Terproteksi
    Route::get('/saved-properties', function () {
        return Inertia::render('user/simpan'); 
    })->name('user.saved');

    Route::get('/profile', function () {
        return Inertia::render('user/profil'); 
    })->name('user.profile');

    Route::post('/profile/avatar', [UserController::class, 'updateAvatar'])->name('user.profile.avatar');

    // --- CRUD PRODUK (ADMIN) ---
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

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';