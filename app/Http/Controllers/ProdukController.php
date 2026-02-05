<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // 1. Filter Pencarian
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('nama_produk', 'like', "%{$search}%");
        }

        // 2. Filter Kategori
        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $category = trim($request->category);
            $query->where('kategori', $category);
        }

        // 3. Cek apakah Admin (berdasarkan prefix URL /produk)
        $isAdminRoute = $request->is('produk*');

        if (!$isAdminRoute) {
            $query->where('status', 'aktif');
        }

        $products = $query->latest()
            ->paginate($isAdminRoute ? 10 : 12)
            ->withQueryString();

        $categoriesList = Category::orderBy('nama_kategori', 'asc')->pluck('nama_kategori');

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

    // Tampilkan Form Tambah (Hanya Admin)
    public function create()
    {
        return Inertia::render('admin/produk/create', [
            'categories' => Category::orderBy('nama_kategori', 'asc')->get()
        ]);
    }

    // Simpan Produk (Hanya Admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required|string',
            'harga'       => 'required|numeric',
            'stok'        => 'required|integer',
            'deskripsi'   => 'nullable|string',
            'status'      => 'required|in:aktif,nonaktif',
        ]);

        Product::create($validated);

        return redirect()->route('produk.index')->with('success', 'Produk berhasil dibuat!');
    }

    // Detail Produk (Wajib Login - diatur di web.php)
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('user/product_detail', [
            'product' => $product
        ]);
    }
}