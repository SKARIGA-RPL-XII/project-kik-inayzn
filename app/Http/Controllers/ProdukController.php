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
     * Tampilan Katalog (Admin & User)
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Fitur Pencarian
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('nama_produk', 'like', "%{$search}%");
        }

        // Filter Kategori
        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $category = trim($request->category);
            $query->where('kategori', $category);
        }

        $isAdminRoute = $request->is('produk*') || $request->is('admin/produk*');

        if (!$isAdminRoute) {
            $query->where('status', 'aktif');
        }

        $products = $query->latest()
            ->paginate($isAdminRoute ? 10 : 12)
            ->withQueryString();

        // Transformasi untuk Thumbnail
        $products->getCollection()->transform(function ($product) {
            $images = $product->gambar;
            if (is_array($images) && count($images) > 0) {
                $product->gambar_url = asset('storage/' . $images[0]);
            } else {
                $product->gambar_url = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";
            }
            return $product;
        });

        $categoriesList = Category::all()->map(fn($cat) => $cat->nama_kategori ?? $cat->name)->filter()->values();

        $savedIds = Auth::check() 
            ? SavedProperty::where('user_id', Auth::id())->pluck('produk_id')->toArray() 
            : [];

        $viewPath = $isAdminRoute ? 'admin/produk/index' : 'user/product';

        return Inertia::render($viewPath, [
            'products'   => $products,
            'categories' => $categoriesList,
            'filters'    => $request->only(['search', 'category']),
            'savedIds'   => $savedIds
        ]);
    }

    /**
     * Detail Produk (Halaman User)
     */
    public function show($id)
    {
        $product = Product::with([
            'ulasans' => function ($query) {
                $query->whereNull('parent_id')
                    ->with(['user:id,username,avatar', 'replies.user:id,username,avatar'])
                    ->latest();
            }
        ])->findOrFail($id);

        $images = $product->gambar;
        $galleryImages = [];

        // Penanganan Galeri Gambar
        if (is_array($images) && count($images) > 0) {
            foreach ($images as $path) {
                $galleryImages[] = asset('storage/' . $path);
            }
        } else {
            $galleryImages[] = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";
        }

        // Pastikan no_agen tersedia untuk dikonsumsi Frontend
        $product->gambar_url = $galleryImages[0];
        $product->product_images = $galleryImages;

        if (Auth::check()) {
            Auth::user()->unreadNotifications
                ->where('data.produk_id', $id)
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
     * Simpan Produk Baru (Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required',
            'harga'       => 'required|numeric',
            'stok'        => 'required|numeric',
            'no_agen'     => 'required|string', // WAJIB ADA
            'gambar.*'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'deskripsi'   => 'nullable',
        ]);

        $paths = [];
        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $file) {
                $paths[] = $file->store('produk', 'public');
            }
        }

        Product::create([
            'nama_produk' => $request->nama_produk,
            'kategori'    => $request->kategori,
            'harga'       => $request->harga,
            'stok'        => $request->stok,
            'no_agen'     => $request->no_agen, // SIMPAN KE DATABASE
            'deskripsi'   => $request->deskripsi,
            'gambar'      => $paths,
            'status'      => 'aktif',
        ]);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil ditambahkan');
    }

    /**
     * Update Produk (Admin)
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required',
            'harga'       => 'required|numeric',
            'stok'        => 'required|numeric',
            'no_agen'     => 'required|string', // WAJIB ADA
            'status'      => 'required|in:aktif,nonaktif',
            'deskripsi'   => 'required',
            'gambar.*'    => 'nullable|image|max:2048'
        ]);

        // Tambahkan 'no_agen' ke dalam list data yang diupdate
        $data = $request->only(['nama_produk', 'kategori', 'harga', 'stok', 'deskripsi', 'status', 'no_agen']);

        if ($request->hasFile('gambar')) {
            // Hapus file lama
            if (is_array($product->gambar)) {
                foreach ($product->gambar as $oldPath) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            $newPaths = [];
            foreach ($request->file('gambar') as $file) {
                $newPaths[] = $file->store('produk', 'public');
            }
            $data['gambar'] = $newPaths;
        }

        $product->update($data);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil diperbarui');
    }

    /**
     * Hapus Produk
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if (is_array($product->gambar)) {
            foreach ($product->gambar as $path) {
                Storage::disk('public')->delete($path);
            }
        }
        
        $product->delete();
        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }

    /**
     * Fitur Simpan (Wishlist)
     */
    public function toggleSave($id)
    {
        if (!Auth::check()) return redirect()->route('login');

        $userId = Auth::id();
        $exists = SavedProperty::where('user_id', $userId)->where('produk_id', $id)->first();

        if ($exists) {
            $exists->delete();
        } else {
            SavedProperty::create(['user_id' => $userId, 'produk_id' => $id]);
        }

        return redirect()->back();
    }

    public function savedPage()
    {
        if (!Auth::check()) return redirect()->route('login');

        $savedItems = SavedProperty::where('user_id', Auth::id())
            ->with('produk') 
            ->get()
            ->pluck('produk')
            ->filter(); 

        $savedItems->transform(function ($product) {
            $images = $product->gambar;
            if (is_array($images) && count($images) > 0) {
                $product->gambar_url = asset('storage/' . $images[0]);
            } else {
                $product->gambar_url = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";
            }
            return $product;
        });

        return Inertia::render('user/simpan', [
            'products' => $savedItems->values()
        ]);
    }

    /**
     * Form Create & Edit (Inertia Render)
     */
    public function create()
    {
        return Inertia::render('admin/produk/create', [
            'categories' => Category::all()->map(fn($cat) => [
                'id' => $cat->id,
                'name' => $cat->nama_kategori ?? $cat->name
            ])
        ]);
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);
        return Inertia::render('admin/produk/edit', [
            'produk' => $product,
            'categories' => Category::all()->map(fn($cat) => [
                'id' => $cat->id,
                'name' => $cat->nama_kategori ?? $cat->name
            ])
        ]);
    }
}