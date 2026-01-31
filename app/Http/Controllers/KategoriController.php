<?php

namespace App\Http\Controllers;

use App\Models\Category; // <--- PASTIKAN BARIS INI ADA
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index()
    {
        // Laravel sekarang tahu Category itu ambil dari folder Models
        $categories = Category::withCount('products')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/kategori/index', [
            'categories' => $categories
        ]);
    }
}