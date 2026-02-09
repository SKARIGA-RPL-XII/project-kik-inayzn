<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use App\Models\Category;
use App\Models\SavedProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProdukController extends Controller
{
    /**
     * Menampilkan daftar produk (Katalog)
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Fitur Search
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('nama_produk', 'like', "%{$search}%");
        }

        // Filter Kategori
        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $category = trim($request->category);
            $query->where('kategori', $category);
        }

        // LOGIKA DETEKSI HALAMAN: Perbaiki agar lebih akurat
        $isAdminRoute = $request->is('produk*') || $request->is('admin/produk*');

        if (!$isAdminRoute) {
            $query->where('status', 'aktif');
        }

        $products = $query->latest()
            ->paginate($isAdminRoute ? 10 : 12)
            ->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;
            return $product;
        });

        $categoriesList = Category::all()->map(function($cat) {
            return $cat->nama_kategori ?? $cat->name;
        })->filter()->values();

        $savedIds = [];
        if (Auth::check()) {
            $savedIds = SavedProperty::where('user_id', Auth::id())
                ->pluck('produk_id')
                ->toArray();
        }

        // Tentukan path file React dengan teliti
        // Pastikan folder di resources/js/Pages/ menggunakan huruf kecil semua sesuai string di bawah
        $viewPath = $isAdminRoute ? 'admin/produk/index' : 'user/product';

        return Inertia::render($viewPath, [
            'products'   => $products,
            'categories' => $categoriesList,
            'filters'    => $request->only(['search', 'category']),
            'savedIds'   => $savedIds
        ]);
    }

    /**
     * Agar tidak error saat akses route resource create
     */
    public function create()
    {
        return redirect()->route('produk.index');
    }

    /**
     * Simpan Produk Baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required',
            'harga'       => 'required|numeric',
            'gambar'      => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'deskripsi'   => 'nullable',
        ]);

        $path = $request->file('gambar') ? $request->file('gambar')->store('produk', 'public') : null;

        Product::create([
            'nama_produk' => $request->nama_produk,
            'kategori'    => $request->kategori,
            'harga'       => $request->harga,
            'deskripsi'   => $request->deskripsi,
            'gambar'      => $path,
            'status'      => 'aktif',
        ]);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan');
    }

    /**
     * Update Produk
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'harga'       => 'required|numeric',
            'gambar'      => 'nullable|image|max:2048'
        ]);

        $data = $request->only(['nama_produk', 'kategori', 'harga', 'deskripsi', 'status']);

        if ($request->hasFile('gambar')) {
            if ($product->gambar) Storage::disk('public')->delete($product->gambar);
            $data['gambar'] = $request->file('gambar')->store('produk', 'public');
        }

        $product->update($data);

        return redirect()->back()->with('success', 'Produk berhasil diperbarui');
    }

    /**
     * Hapus Produk
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->gambar) Storage::disk('public')->delete($product->gambar);
        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }

    /**
     * Halaman Properti Tersimpan
     */
    public function savedPage()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $savedItems = SavedProperty::where('user_id', Auth::id())
            ->with('produk') 
            ->get()
            ->pluck('produk')
            ->filter(); // Jaga-jaga kalau ada produk yang sudah dihapus

        $savedItems->transform(function ($product) {
            $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;
            return $product;
        });

        return Inertia::render('user/simpan', [
            'products' => $savedItems->values()
        ]);
    }

    /**
     * Detail Produk
     */
    public function show($id)
    {
        $product = Product::with([
            'ulasans' => function ($query) {
                $query->whereNull('parent_id')
                      ->with([
                          'user:id,username,avatar',
                          'replies.user:id,username,avatar' 
                      ]) 
                      ->latest();
            }
        ])->findOrFail($id);

        $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;

        if (Auth::check()) {
            Auth::user()->unreadNotifications()
                ->where('data->produk_id', $id)
                ->get()
                ->markAsRead();
        }

        return Inertia::render('user/product_detail', [
            'product' => $product,
            'user_has_reviewed' => Auth::check() 
                ? $product->ulasans->where('user_id', Auth::id())->count() > 0 
                : false
        ]);
    }

    /**
     * Fitur Save/Toggle
     */
    public function toggleSave($id)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userId = Auth::id();
        $exists = SavedProperty::where('user_id', $userId)
                               ->where('produk_id', $id)
                               ->first();

        if ($exists) {
            $exists->delete();
        } else {
            SavedProperty::create([
                'user_id'   => $userId,
                'produk_id' => $id
            ]);
        }

        return redirect()->back();
    }
}