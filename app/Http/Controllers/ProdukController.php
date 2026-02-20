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

        // Pencarian
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('nama_produk', 'like', "%{$search}%");
        }

        // Filter Kategori
        if ($request->filled('category') && $request->category !== 'Semua Kategori') {
            $category = trim($request->category);
            $query->where('kategori', $category);
        }

        // Cek akses admin atau user (berdasarkan prefix URL)
        $isAdminRoute = $request->is('produk*') || $request->is('admin/produk*');

        if (!$isAdminRoute) {
            $query->where('status', 'aktif');
        }

        $products = $query->latest()
            ->paginate($isAdminRoute ? 10 : 12)
            ->withQueryString();

        $products->getCollection()->transform(function ($product) {
            $images = $this->normalizeImages($product->gambar);

            if (count($images) > 0) {
                $firstImage = trim($images[0], " \"");
                $product->gambar_url = asset('storage/' . $firstImage);
            } else {
                $product->gambar_url = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";
            }
            
            $product->harga = (float) $product->harga;
            $product->stok = (int) $product->stok;
            return $product;
        });

        return Inertia::render($isAdminRoute ? 'admin/produk/index' : 'user/product', [
            'products'   => $products,
            'categories' => Category::all()->map(fn($cat) => [
                'id' => $cat->id, 
                'name' => $cat->nama_kategori ?? $cat->name
            ]),
            'filters'     => $request->only(['search', 'category']),
            'savedIds'    => Auth::check() ? SavedProperty::where('user_id', Auth::id())->pluck('produk_id')->toArray() : []
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['ulasans' => fn($q) => 
            $q->whereNull('parent_id')->with(['user', 'replies.user'])->latest()
        ])->findOrFail($id);
        
        $images = $this->normalizeImages($product->gambar);
        $gallery = [];

        if (count($images) > 0) {
            foreach ($images as $path) { 
                $gallery[] = asset('storage/' . trim($path, " \"")); 
            }
        } else {
            $gallery[] = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";
        }

        $product->gambar_url = $gallery[0];
        $product->product_images = $gallery;

        return Inertia::render('user/product_detail', [
            'product' => $product,
            'user_has_reviewed' => Auth::check() ? $product->ulasans->where('user_id', Auth::id())->count() > 0 : false
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/produk/create', [
            'categories' => Category::all()->map(fn($cat) => [
                'id' => $cat->id, 
                'name' => $cat->nama_kategori ?? $cat->name
            ])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'kategori'    => 'required|string',
            'harga'       => 'required|numeric|min:0',
            'stok'        => 'required|integer|min:0',
            'no_agen'     => 'required|string',
            'deskripsi'   => 'required|string',
            'gambar'      => 'required|array|min:1',
            'gambar.*'    => 'image|max:10240', // 10MB
        ]);

        $paths = [];
        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $file) {
                $paths[] = $file->store('produk', 'public');
            }
        }

        Product::create(array_merge($request->all(), [
            'gambar' => $paths, 
            'status' => strtolower($request->status ?? 'aktif')
        ]));
        
        return redirect('/produk')->with('success', 'Produk berhasil ditambahkan');
    }

    public function edit($id)
    {
        $produk = Product::findOrFail($id);
        $produk->gambar = $this->normalizeImages($produk->gambar);

        return Inertia::render('admin/produk/edit', [
            'produk' => $produk,
            'categories' => Category::all()->map(fn($cat) => [
                'id' => $cat->id, 
                'name' => $cat->nama_kategori ?? $cat->name
            ])
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'nama_produk'     => 'required|string|max:255',
            'kategori'        => 'required|string',
            'harga'           => 'required|numeric|min:0',
            'stok'            => 'required|integer|min:0',
            'status'          => 'required|string',
            'no_agen'         => 'required|string',
            'deskripsi'       => 'required|string',
            'gambar.*'        => 'nullable|image|max:10240', // 10MB
        ]);

        $data = $request->only(['nama_produk', 'kategori', 'harga', 'stok', 'deskripsi', 'no_agen']);
        $data['status'] = strtolower($request->status);
        
        $currentImagesInDb = $this->normalizeImages($product->gambar);
        
        // Logika Baru: Jika ada upload gambar baru, ganti semua foto lama
        if ($request->hasFile('gambar')) {
            // Hapus file fisik lama dari storage
            foreach ($currentImagesInDb as $path) {
                $cleanPath = trim($path, " \"");
                if (Storage::disk('public')->exists($cleanPath)) {
                    Storage::disk('public')->delete($cleanPath);
                }
            }

            // Simpan gambar baru
            $updatedImages = [];
            foreach ($request->file('gambar') as $file) {
                $updatedImages[] = $file->store('produk', 'public');
            }
        } else {
            // Jika tidak ada upload baru, cek apakah user minta hapus via tombol hapus (remove_old_image)
            if ($request->remove_old_image === 'true' || $request->remove_old_image === true) {
                foreach ($currentImagesInDb as $path) {
                    $cleanPath = trim($path, " \"");
                    if (Storage::disk('public')->exists($cleanPath)) {
                        Storage::disk('public')->delete($cleanPath);
                    }
                }
                $updatedImages = [];
            } else {
                // Tetap gunakan gambar lama
                $updatedImages = $currentImagesInDb;
            }
        }

        $data['gambar'] = array_values($updatedImages); 
        
        $product->update($data);

        return redirect('/produk')->with('success', 'Properti berhasil diperbarui');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $images = $this->normalizeImages($product->gambar);

        foreach ($images as $path) { 
            $cleanPath = trim($path, " \"");
            if (Storage::disk('public')->exists($cleanPath)) {
                Storage::disk('public')->delete($cleanPath); 
            }
        }

        $product->delete();
        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }

    public function toggleSave($id)
    {
        if (!Auth::check()) return redirect()->route('login');
        
        $exists = SavedProperty::where('user_id', Auth::id())->where('produk_id', $id)->first();
        if ($exists) {
            $exists->delete();
        } else {
            SavedProperty::create(['user_id' => Auth::id(), 'produk_id' => $id]);
        }
        
        return redirect()->back();
    }

    private function normalizeImages($gambar)
    {
        if (empty($gambar)) return [];
        if (is_array($gambar)) return array_values($gambar);
        
        $decoded = json_decode($gambar, true);
        if (is_array($decoded)) return array_values($decoded);

        return array_filter(explode(',', $gambar));
    }
}