<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth; // Tambahkan ini
use Inertia\Inertia;

class ProdukController extends Controller
{
    /**
     * Menampilkan daftar produk (Admin & User)
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Pencarian berdasarkan nama
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('nama_produk', 'like', "%{$search}%");
        }

        // Filter kategori
        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $category = trim($request->category);
            $query->where('kategori', $category);
        }

        // Cek apakah ini akses admin atau user
        $isAdminRoute = $request->is('produk*') || $request->is('admin*');

        if (!$isAdminRoute) {
            $query->where('status', 'aktif');
        }

        $products = $query->latest()
            ->paginate($isAdminRoute ? 10 : 12)
            ->withQueryString();

        // Inject gambar_url
        $products->getCollection()->transform(function ($product) {
            $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;
            return $product;
        });

        $categoriesList = Category::all()->map(function($cat) {
            return $cat->nama_kategori ?? $cat->name;
        })->filter()->values();

        return Inertia::render($isAdminRoute ? 'admin/produk/index' : 'user/product', [
            'products'   => $products,
            'categories' => $categoriesList,
            'filters'    => $request->only(['search', 'category'])
        ]);
    }

    /**
     * TAMPILAN DETAIL: Mengambil produk + Ulasan + Balasan
     */
    public function show($id)
    {
        $product = Product::with([
            'ulasans' => function ($query) {
                $query->whereNull('parent_id') // Hanya ulasan utama
                      ->with([
                          'user:id,username,avatar', // Tambahkan avatar jika ada
                          'replies.user:id,username,avatar' 
                      ]) 
                      ->latest();
            }
        ])->findOrFail($id);

        $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;

        // --- FITUR TAMBAHAN: AUTO-READ NOTIFIKASI ---
        // Jika user masuk ke halaman detail produk, kita bisa tandai notifikasi 
        // yang berhubungan dengan produk ini sebagai "sudah dibaca"
        if (Auth::check()) {
            Auth::user()->unreadNotifications()
                ->where('data->produk_id', $id)
                ->get()
                ->markAsRead();
        }

        return Inertia::render('user/product_detail', [
            'product' => $product,
            // Kirim status apakah user ini sudah pernah kasih ulasan (untuk proteksi UI)
            'user_has_reviewed' => Auth::check() 
                ? $product->ulasans->where('user_id', Auth::id())->count() > 0 
                : false
        ]);
    }

}