<?php

namespace App\Http\Controllers;

use App\Models\Product; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index()
    {
        $products = Product::latest()->paginate(10);

        return Inertia::render('admin/produk/index', [ 
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Produk/Create');
    }

        public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
