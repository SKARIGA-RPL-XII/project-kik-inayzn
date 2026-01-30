<?php

namespace App\Http\Controllers;

use App\Models\Product; // Pastikan nama model sesuai (Product atau Produk)
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index()
    {
        $products = Product::all();

        // Di ProdukController.php
return Inertia::render('admin/produk/index', [ // Sesuaikan folder fisik: admin/produk/index
    'products' => $products
]);
    }

    // Jika kamu butuh fungsi create untuk resource
    public function create()
    {
        return Inertia::render('Admin/Produk/Create');
    }
}