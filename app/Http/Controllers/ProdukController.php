public function index(Request $request)
{
    $query = Product::query();

    // 1. Filter Pencarian (Nama Produk)
    if ($request->filled('search')) {
        $search = trim($request->search);
        $query->where('nama_produk', 'like', "%{$search}%");
    }

    // 2. JANTUNG MASALAH: Filter Kategori
    if ($request->filled('category') && $request->category !== 'Semua Kategori') {
        $category = trim($request->category);
        // Menggunakan LIKE % agar lebih fleksibel terhadap spasi atau case sensitivity
        $query->where('kategori', 'LIKE', "%{$category}%");
    }

    // 3. Deteksi Rute Admin
    $isAdminRoute = $request->is('admin/*') || $request->is('produk*') || $request->is('admin/produk*');

    if (!$isAdminRoute) {
        $query->where('status', 'aktif');
    }

    // 4. Ambil Data (Wajib withQueryString agar pagination tidak hilang saat difilter)
    $products = $query->latest()
        ->paginate(12)
        ->withQueryString();

    // 5. Ambil Kategori untuk Dropdown
    $categoriesList = \App\Models\Category::orderBy('name', 'asc')->pluck('name');

    $filters = [
        'search' => $request->search ?? '',
        'category' => $request->category ?? 'Semua Kategori'
    ];

    return Inertia::render($isAdminRoute ? 'admin/produk/index' : 'user/product', [
        'products' => $products,
        'categories' => $categoriesList,
        'filters'  => $filters
    ]);
}