<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Tambahkan ini untuk urusan hapus file
use Inertia\Inertia;

class ProdukController extends Controller
{
    /**
     * Menampilkan daftar produk
     */
    public function index()
    {
        $products = Product::latest()->paginate(10);

        return Inertia::render('admin/produk/index', [
            'products' => $products
        ]);
    }

    /**
     * Menampilkan form tambah produk
     */
    public function create()
    {
        return Inertia::render('admin/produk/create'); // Pastikan C besar jika nama file Create.tsx
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

        return Inertia::render('admin/produk/edit', [ // Pastikan E besar jika nama file Edit.tsx
            'produk' => $produk
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

        // Cek jika ada file gambar baru yang diunggah
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($produk->gambar) {
                Storage::disk('public')->delete($produk->gambar);
            }

            // Simpan gambar baru
            $path = $request->file('gambar')->store('produk', 'public');
            $validated['gambar'] = $path;
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

        // Hapus file gambar dari storage sebelum hapus data di database
        if ($produk->gambar) {
            Storage::disk('public')->delete($produk->gambar);
        }

        $produk->delete();

        return redirect('/produk')->with('success', 'Produk berhasil dihapus!');
    }
}