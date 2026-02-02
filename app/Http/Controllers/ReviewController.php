<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        // Tampilkan ulasan beserta balasan adminnya jika ada
        $reviews = Review::with(['user:id,username', 'product:id,name'])
            ->latest()
            ->paginate(8);

        return Inertia::render('admin/ulasan/index', [
            'reviews' => $reviews
        ]);
    }

    public function create(): Response
    {
        // Ambil ulasan yang BELUM memiliki balasan admin agar bisa dipilih
        $pendingReviews = Review::with(['user:id,username', 'product:id,name'])
            ->whereNull('admin_reply') 
            ->get();

        return Inertia::render('admin/ulasan/create', [
            'pendingReviews' => $pendingReviews
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'review_id' => 'required|exists:reviews,id',
            'admin_reply' => 'required|string|min:3',
        ]);

        // Kita cari ulasannya, lalu kita update kolom balasan adminnya
        $review = Review::findOrFail($validated['review_id']);
        $review->update([
            'admin_reply' => $validated['admin_reply'],
            // 'replied_at' => now(), // Tambahkan ini jika kamu punya kolom timestamp balasan
        ]);

        return redirect()->route('ulasan.index')->with('success', 'Balasan ulasan berhasil dikirim!');
    }

    public function destroy(int $id)
    {
        Review::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Ulasan berhasil dihapus');
    }
}