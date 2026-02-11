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
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('user.dashboard');
})->name('home');

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
Route::get('/simulator-kpr', function () {
    return Inertia::render('user/kpr'); 
})->name('user.kpr');

/*
|--------------------------------------------------------------------------
| Guest Routes
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
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    
    Route::get('/products/{id}', [ProdukController::class, 'show'])->name('user.products.detail');

    // --- ADMIN DASHBOARD (LINKABLE VERSION) ---
    Route::get('/admin/dashboard', function () {
        $stats = [
            'properti_terjual' => DB::table('produks')->count(), 
            'total_ulasan'     => DB::table('ulasans')->count(),
            'pengguna_aktif'   => DB::table('users')->where('role', 'user')->count(), 
        ];

        $categories = DB::table('categories')->get();
        
        $top_categories = $categories->map(function($cat) {
            $unitCount = DB::table('produks')->where('kategori', $cat->name)->count();

            return [
                'name'    => $cat->name,
                'sold'    => (int) $unitCount,
                'revenue' => 'Lihat Detail',
                // Mengarahkan ke list produk dengan filter pencarian kategori
                'url'     => route('produk.index', ['search' => $cat->name]) 
            ];
        })->sortByDesc('sold')->values()->take(4);

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'top_categories' => $top_categories
        ]); 
    })->name('admin.dashboard');

    // --- MANAJEMEN ROUTES ---
    Route::get('/saved-properties', [SavedPropertyController::class, 'index'])->name('user.saved');
    Route::post('/products/{id}/save', [SavedPropertyController::class, 'toggle'])->name('user.saved.toggle');

    Route::get('/profile', function () {
        return Inertia::render('user/profil', [
            'myReviews' => Ulasan::where('user_id', auth()->id())->with('product')->latest()->get()
        ]); 
    })->name('user.profile');

    Route::patch('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');

    // CRUD PRODUK
    Route::get('/produk', [ProdukController::class, 'index'])->name('produk.index');
    Route::get('/produk/create', [ProdukController::class, 'create'])->name('produk.create');
    Route::post('/produk', [ProdukController::class, 'store'])->name('produk.store');
    Route::resource('produk', ProdukController::class)->except(['index', 'create', 'store']);
    
    // CRUD KATEGORI
    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::resource('kategori', KategoriController::class)->except(['index']);
    
    // CRUD PENGGUNA
    Route::get('/pengguna', [UserController::class, 'index'])->name('user.index');
    Route::post('/pengguna', [UserController::class, 'store'])->name('user.store');
    Route::put('/pengguna/{id}', [UserController::class, 'update'])->name('user.update');
    Route::delete('/pengguna/{id}', [UserController::class, 'destroy'])->name('user.destroy');

    // CRUD ULASAN
    Route::get('/ulasan', [ReviewController::class, 'index'])->name('ulasan.index');
    Route::get('/ulasan/create', [ReviewController::class, 'create'])->name('ulasan.create');
    Route::post('/ulasan', [ReviewController::class, 'store'])->name('ulasan.store');
    Route::delete('/ulasan/{id}', [ReviewController::class, 'destroy'])->name('ulasan.destroy');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

require __DIR__.'/settings.php';