<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProdukController extends Controller
{
    /**
     * Menampilkan daftar produk dengan fitur pencarian
     */
    public function index(Request $request)
    {
        $products = Product::query()
            // Logika pencarian: mencari berdasarkan nama_produk atau kategori
            ->when($request->search, function ($query, $search) {
                $query->where('nama_produk', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString(); // Menjaga parameter URL saat pindah halaman (pagination)

        return Inertia::render('admin/produk/index', [
            'products' => $products,
            'filters'  => $request->only(['search']) // Mengirim balik keyword pencarian ke React
        ]);
    }

    /**
     * Menampilkan form tambah produk
     */
    public function create()
    {
        $categories = Category::orderBy('name', 'asc')->get();

        return Inertia::render('admin/produk/create', [
            'categories' => $categories
        ]); 
    }

    /**
     * Menyimpan produk baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required|string',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'status'      => 'required|in:aktif,nonaktif',
            'deskripsi'   => 'required|string',
            'gambar'      => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('produk', 'public');
            $validated['gambar'] = $path;
        }

        Product::create($validated);

        return redirect('/produk')->with('success', 'Produk berhasil ditambahkan!');
    }

    /**
     * Menampilkan form edit produk
     */
    public function edit($id)
    {
        $produk = Product::findOrFail($id);
        $categories = Category::orderBy('name', 'asc')->get();

        return Inertia::render('admin/produk/edit', [ 
            'produk' => $produk,
            'categories' => $categories
        ]);
    }

    /**
     * Memperbarui data produk
     */
    public function update(Request $request, $id)
    {
        $produk = Product::findOrFail($id);

        $validated = $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required|string',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'status'      => 'required|in:aktif,nonaktif',
            'deskripsi'   => 'required|string',
            'gambar'      => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            if ($produk->gambar) {
                Storage::disk('public')->delete($produk->gambar);
            }
            $path = $request->file('gambar')->store('produk', 'public');
            $validated['gambar'] = $path;
        } else {
            unset($validated['gambar']);
        }

        $produk->update($validated);

        return redirect('/produk')->with('success', 'Produk berhasil diperbarui!');
    }

    /**
     * Menghapus produk
     */
    public function destroy($id)
    {
        $produk = Product::findOrFail($id);

        if ($produk->gambar) {
            Storage::disk('public')->delete($produk->gambar);
        }

        $produk->delete();

        return redirect('/produk')->with('success', 'Produk berhasil dihapus!');
    }
}