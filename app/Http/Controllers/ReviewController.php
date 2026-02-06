<?php

namespace App\Http\Controllers;

use App\Models\Ulasan; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Dashboard Admin: Menampilkan daftar ulasan
     */
    public function index(): Response
    {
        $reviews = Ulasan::with(['user:id,username', 'product:id,nama_produk'])
            ->latest()
            ->paginate(8);

        return Inertia::render('admin/ulasan/index', [
            'reviews' => $reviews
        ]);
    }

    public function create()
    {
        return redirect()->back();
    }

    /**
     * Simpan ulasan baru (dari User) atau Balasan (dari Admin)
     */
    public function store(Request $request)
    {
        // 1. Logika untuk USER kirim ulasan
        if ($request->has('produk_id')) {
            $validated = $request->validate([
                'produk_id'  => 'required|exists:products,id', 
                'isi_ulasan' => 'required|string|min:3',
                'rating'     => 'required|integer|min:1|max:5',
            ]);

            Ulasan::create([
                'produk_id'  => $validated['produk_id'],
                'user_id'    => Auth::id(),
                'isi_ulasan' => $validated['isi_ulasan'],
                'rating'     => $validated['rating'],
                'is_read'    => true, // User baru kirim, set true karena admin belum balas
            ]);

            return redirect()->back()->with('success', 'Ulasan berhasil dikirim!');
        }

        // 2. Logika untuk ADMIN membalas ulasan
        $validated = $request->validate([
            'review_id'   => 'required|exists:ulasans,id',
            'admin_reply' => 'required|string|min:3',
        ]);

        $review = Ulasan::findOrFail($validated['review_id']);
        
        // UPDATE: Tambahkan is_read = false supaya muncul notif di sisi User
        $review->update([
            'admin_reply' => $validated['admin_reply'],
            'is_read'     => false, 
        ]);

        return redirect()->back()->with('success', 'Balasan ulasan berhasil dikirim!');
    }

    /**
     * Method baru buat User "mematikan" notif (klik ulasan)
     */
    public function markAsRead($id)
    {
        $review = Ulasan::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $review->update(['is_read' => true]);

        return redirect()->back();
    }

    public function destroy(int $id)
    {
        Ulasan::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Ulasan berhasil dihapus');
    }
}