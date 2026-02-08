<?php

namespace App\Http\Controllers;

use App\Models\Ulasan; 
use App\Models\Product; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Notifications\UlasanDibalas;

class ReviewController extends Controller
{
    public function index(): Response
    {
        $reviews = Ulasan::with(['user:id,username', 'product:id,nama_produk'])
            ->latest()
            ->paginate(8);

        return Inertia::render('admin/ulasan/index', [
            'reviews' => $reviews
        ]);
    }

    public function store(Request $request)
    {
        // 1. Logika untuk USER kirim ulasan atau membalas (Thread)
        if ($request->has('produk_id')) {
            $validated = $request->validate([
                'produk_id'  => 'required|exists:produks,id', 
                'isi_ulasan' => 'required|string|min:3',
                'rating'     => $request->parent_id ? 'nullable|integer' : 'required|integer|min:1|max:5',
                'parent_id'  => 'nullable|exists:ulasans,id',
            ]);

            $ulasan = Ulasan::create([
                'produk_id'  => $validated['produk_id'],
                'user_id'    => Auth::id(),
                'isi_ulasan' => $validated['isi_ulasan'],
                'rating'     => $request->parent_id ? null : $validated['rating'], 
                'parent_id'  => $validated['parent_id'] ?? null,
            ]);

            // --- LOGIKA NOTIFIKASI BALASAN USER ---
            if ($ulasan->parent_id) {
                $ulasanUtama = Ulasan::find($ulasan->parent_id);
                $penerima = $ulasanUtama->user;

                if ($penerima && $penerima->id !== Auth::id()) {
                    // Kita kirimkan objek $ulasan yang baru dibuat
                    $penerima->notify(new UlasanDibalas($ulasan));
                }
            }

            return redirect()->back()->with('success', 'Pesan terkirim!');
        }

        // 2. Logika untuk ADMIN membalas ulasan via kolom admin_reply
        $validated = $request->validate([
            'review_id'   => 'required|exists:ulasans,id',
            'admin_reply' => 'required|string|min:3',
        ]);

        $review = Ulasan::findOrFail($validated['review_id']);
        
        $review->update([
            'admin_reply' => $validated['admin_reply'],
        ]);

        // --- LOGIKA NOTIFIKASI BALASAN ADMIN ---
        $userPemilikUlasan = $review->user;
        if ($userPemilikUlasan) {
            // Admin membalas ulasan utama, jadi kita kirimkan objek ulasan tersebut
            $userPemilikUlasan->notify(new UlasanDibalas($review));
        }

        return redirect()->back()->with('success', 'Balasan admin berhasil dikirim!');
    }

    /**
     * Menandai notifikasi sebagai sudah dibaca
     */
    public function markAsRead(Request $request)
    {
        if (Auth::check()) {
            // Menandai notifikasi spesifik atau semua sebagai dibaca
            Auth::user()->unreadNotifications->markAsRead();
        }

        return redirect()->back();
    }

    public function destroy(int $id)
    {
        $ulasan = Ulasan::findOrFail($id);

        if (Auth::user()->role !== 'admin' && $ulasan->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menghapus pesan ini.');
        }

        $ulasan->delete();

        return redirect()->back()->with('success', 'Pesan berhasil dihapus');
    }
}