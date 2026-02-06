<?php

namespace App\Http\Controllers;

use App\Models\Ulasan; 
use App\Models\Product; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        // Menampilkan ulasan di dashboard admin
        $reviews = Ulasan::with(['user:id,username', 'product:id,nama_produk'])
            ->latest()
            ->paginate(8);

        return Inertia::render('admin/ulasan/index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Simpan ulasan baru atau Balasan antar user
     */
    public function store(Request $request)
    {
        // 1. Logika untuk USER kirim ulasan atau membalas (Thread)
        if ($request->has('produk_id')) {
            $validated = $request->validate([
                'produk_id'  => 'required|exists:produks,id', 
                'isi_ulasan' => 'required|string|min:3',
                // Update: Rating hanya wajib jika bukan balasan (parent_id null)
                'rating'     => $request->parent_id ? 'nullable|integer' : 'required|integer|min:1|max:5',
                // Tambahkan parent_id di validasi
                'parent_id'  => 'nullable|exists:ulasans,id',
            ]);

            Ulasan::create([
                'produk_id'  => $validated['produk_id'],
                'user_id'    => Auth::id(),
                'isi_ulasan' => $validated['isi_ulasan'],
                'rating'     => $request->parent_id ? null : $validated['rating'], 
                'parent_id'  => $validated['parent_id'] ?? null,
                'is_read'    => true, 
            ]);

            return redirect()->back()->with('success', 'Pesan terkirim!');
        }

        // 2. Logika untuk ADMIN membalas ulasan (jika masih pakai kolom admin_reply)
        $validated = $request->validate([
            'review_id'   => 'required|exists:ulasans,id',
            'admin_reply' => 'required|string|min:3',
        ]);

        $review = Ulasan::findOrFail($validated['review_id']);
        
        $review->update([
            'admin_reply' => $validated['admin_reply'],
            'is_read'     => false, 
        ]);

        return redirect()->back()->with('success', 'Balasan admin berhasil dikirim!');
    }

    public function markAsRead($id)
    {
        $review = Ulasan::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
            
        $review->update(['is_read' => true]);

        return redirect()->back();
    }

    public function destroy(int $id)
    {
        // Hapus ulasan. Catatan: Jika pakai parent_id, pastikan 
        // di database sudah diset 'on delete cascade' untuk anak-anaknya.
        Ulasan::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Ulasan berhasil dihapus');
    }
}