<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product; // Ingat, Abang pakai Product
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class KategoriController extends Controller
{
    public function index()
    {
        // Tetap pakai withCount supaya jumlah produk otomatis muncul
        $categories = Category::withCount('products')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/kategori/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:categories,name',
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'nama_kategori.unique'   => 'Kategori ini sudah ada.',
        ]);

        Category::create([
            'name' => $request->nama_kategori,
        ]);

        return Redirect::back()->with('success', 'Kategori berhasil ditambahkan!');
    }

    /**
     * METHOD UPDATE: Ini yang tadi hilang sehingga bikin error
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            // unique:categories,name,{$id} artinya boleh sama dengan namanya sendiri saat ini
            'nama_kategori' => 'required|string|max:255|unique:categories,name,' . $id,
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'nama_kategori.unique'   => 'Nama kategori sudah digunakan.',
        ]);

        $category->update([
            'name' => $request->nama_kategori,
        ]);

        return Redirect::back()->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * METHOD DESTROY: Biar tombol hapus di UI juga berfungsi
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Hapus kategori (Pastikan logic di database sudah diatur untuk produk yang terkait)
        $category->delete();

        return Redirect::back()->with('success', 'Kategori berhasil dihapus!');
    }
}