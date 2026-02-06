<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('nama_produk', 'like', "%{$search}%");
        }

        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $category = trim($request->category);
            $query->where('kategori', $category);
        }

        $isAdminRoute = $request->is('produk*') || $request->is('admin*');

        if (!$isAdminRoute) {
            $query->where('status', 'aktif');
        }

        $products = $query->latest()
            ->paginate($isAdminRoute ? 10 : 12)
            ->withQueryString();

        // ✅ Tambahkan URL gambar ke setiap produk di list
        $products->getCollection()->transform(function ($product) {
            $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;
            return $product;
        });

        $categoriesList = Category::all()->map(function($cat) {
            return $cat->nama_kategori ?? $cat->name;
        })->filter()->values();

        $filters = [
            'search' => $request->search ?? '',
            'category' => $request->category ?? 'Semua Kategori'
        ];

        return Inertia::render($isAdminRoute ? 'admin/produk/index' : 'user/product', [
            'products'   => $products,
            'categories' => $categoriesList,
            'filters'    => $filters
        ]);
    }

    /**
     * ✅ UPDATE: Method Show sekarang membawa relasi ulasan & user
     */
    public function show($id)
    {
        // Ambil produk dengan relasi ulasans dan user di dalam ulasan tersebut
        $product = Product::with(['ulasans.user'])->findOrFail($id);

        // Tambahkan attribute gambar_url secara manual sebelum dikirim ke FE
        $product->gambar_url = $product->gambar ? asset('storage/' . $product->gambar) : null;

        return Inertia::render('user/product_detail', [
            'product' => $product
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/produk/create', [
            'categories' => Category::all()->map(function($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->nama_kategori ?? $cat->name
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required|string',
            'harga'       => 'required|numeric',
            'stok'        => 'required|integer',
            'deskripsi'   => 'nullable|string',
            'status'      => 'required|in:aktif,nonaktif',
            'gambar'      => 'required|array|min:1',
            'gambar.*'    => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $request->file('gambar')[0]->store('produk', 'public');
        }

        Product::create($validated);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil dibuat!');
    }

    public function edit($id)
    {
        $produk = Product::findOrFail($id);
        
        $categories = Category::all()->map(function($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->nama_kategori ?? $cat->name
            ];
        });

        return Inertia::render('admin/produk/edit', [
            'produk' => $produk,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required|string',
            'harga'       => 'required|numeric',
            'stok'        => 'required|integer',
            'status'      => 'required|in:aktif,nonaktif',
            'deskripsi'   => 'required|string',
            'gambar'      => 'nullable|array', 
            'gambar.*'    => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $data = $request->only(['nama_produk', 'kategori', 'harga', 'stok', 'status', 'deskripsi']);

        if ($request->hasFile('gambar')) {
            if ($product->gambar) {
                Storage::disk('public')->delete($product->gambar);
            }
            $data['gambar'] = $request->file('gambar')[0]->store('produk', 'public');
        }

        $product->update($data);

        return redirect()->route('produk.index')->with('message', 'Properti berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->gambar) {
            Storage::disk('public')->delete($product->gambar);
        }
        
        $product->delete();

        return redirect()->route('produk.index')->with('success', 'Produk berhasil dihapus!');
    }
}