<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategoriController; 
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SavedPropertyController;
use App\Http\Controllers\ProfileController;
use App\Models\Product;
use App\Models\Ulasan; 
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public & Guest Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => redirect()->route('user.dashboard'))->name('home');

Route::get('/dashboard', function () {
    if (auth()->check()) {
        return auth()->user()->role === 'admin' 
            ? redirect()->route('admin.dashboard') 
            : redirect()->route('user.dashboard');
    }
    return redirect()->route('user.dashboard');
})->name('dashboard.index');

Route::get('/user/dashboard', function () {
    return Inertia::render('user/dashboard', [
        'products' => Product::where('status', 'aktif')->latest()->take(6)->get(),
        'auth' => ['user' => auth()->user()]
    ]); 
})->name('user.dashboard');

Route::get('/products', [ProdukController::class, 'index'])->name('user.products');
Route::get('/simulator-kpr', fn() => Inertia::render('user/kpr'))->name('user.kpr');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    
    Route::get('/products/{id}', [ProdukController::class, 'show'])->name('user.products.detail');

    // --- ADMIN DASHBOARD ---
    Route::get('/admin/dashboard', function () {
        $stats = [
            'properti_terjual' => DB::table('produks')->count(), 
            'total_ulasan'     => DB::table('ulasans')->count(),
            'pengguna_aktif'   => DB::table('users')->where('role', 'user')->count(), 
        ];

        $top_categories = DB::table('categories')->get()->map(function($cat) {
            return [
                'name'    => $cat->name,
                'sold'    => DB::table('produks')->where('kategori', $cat->name)->count(),
                'revenue' => 'Lihat Detail',
                'url'     => route('produk.index', ['category' => $cat->name]) 
            ];
        })->sortByDesc('sold')->values()->take(4);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'top_categories' => $top_categories
        ]); 
    })->name('admin.dashboard');

    // --- MANAJEMEN PROFILE & SAVED ---
    Route::get('/saved-properties', [SavedPropertyController::class, 'index'])->name('user.saved');
    Route::post('/products/{id}/save', [SavedPropertyController::class, 'toggle'])->name('user.saved.toggle');
    Route::get('/profile', function () {
        return Inertia::render('user/profil', [
            'myReviews' => Ulasan::where('user_id', auth()->id())->with('product')->latest()->get()
        ]); 
    })->name('user.profile');

    Route::patch('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');

    // --- CRUD PRODUK (CLEAN FIX) ---
    // PERUBAHAN DISINI: Ganti POST menjadi PUT supaya sinkron dengan _method: 'PUT' di React
    Route::put('/produk/{id}', [ProdukController::class, 'update'])->name('produk.update');
    
    // Resource route sisanya tanpa mengganggu 'update' yang sudah dibuat manual
    Route::resource('produk', ProdukController::class)->except(['update']);

    // --- CRUD KATEGORI, PENGGUNA, ULASAN ---
    Route::resource('kategori', KategoriController::class);
    
    Route::get('/pengguna', [UserController::class, 'index'])->name('user.index');
    Route::post('/pengguna', [UserController::class, 'store'])->name('user.store');
    Route::put('/pengguna/{id}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/pengguna/{id}', [UserController::class, 'destroy'])->name('user.destroy');

    Route::get('/ulasan', [ReviewController::class, 'index'])->name('ulasan.index');
    Route::post('/ulasan', [ReviewController::class, 'store'])->name('ulasan.store');
    Route::delete('/ulasan/{id}', [ReviewController::class, 'destroy'])->name('ulasan.destroy');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';