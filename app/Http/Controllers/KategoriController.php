<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%');
            })
            ->withCount('products')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/kategori/index', [
            'categories' => $categories,
            'filters' => $request->only(['search'])
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

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
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

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return Redirect::back()->with('success', 'Kategori berhasil dihapus!');
    }
}