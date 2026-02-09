<?php
    namespace App\Http\Controllers;

    use App\Models\SavedProperty;
    use Illuminate\Http\Request;
    use Inertia\Inertia;
    use Illuminate\Support\Facades\Auth;

    class SavedPropertyController extends Controller
    {
        // 1. Tampilkan halaman koleksi
        public function index()
        {
            $savedItems = SavedProperty::with('produk')
                ->where('user_id', Auth::id())
                ->latest()
                ->get()
                ->map(function ($item) {
                    // Pastikan gambar produk bisa diakses
                    if ($item->produk) {
                        $item->produk->gambar_url = $item->produk->gambar 
                            ? asset('storage/' . $item->produk->gambar) 
                            : null;
                    }
                    return $item;
                });

            // DISESUAIKAN: Arahkan ke folder 'user' dan file 'simpan'
            return Inertia::render('user/simpan', [
                'savedProperties' => $savedItems
            ]);
        }

        // 2. Logika klik tombol simpan (Toggle)
        public function toggle($id)
        {
            $userId = Auth::id();
            
            // Pastikan nama kolom database adalah produk_id sesuai migration kamu
            $exists = SavedProperty::where('user_id', $userId)
                                ->where('produk_id', $id)
                                ->first();

            if ($exists) {
                $exists->delete();
                return back()->with('message', 'Dihapus dari koleksi');
            }

            SavedProperty::create([
                'user_id' => $userId,
                'produk_id' => $id
            ]);

            return back()->with('message', 'Tersimpan!');
        }
    }