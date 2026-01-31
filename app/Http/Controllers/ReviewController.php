<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Menampilkan halaman daftar ulasan.
     */
    public function index(): Response
    {
        // Mengambil data ulasan beserta data user (username) dan product (name)
        // Dipaginasi 8 data per halaman agar sesuai dengan desain gambar
        $reviews = Review::with(['user:id,username', 'product:id,name'])
            ->latest()
            ->paginate(8);

        return Inertia::render('admin/ulasan/index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Menghapus data ulasan dari database.
     */
    public function destroy(int $id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return redirect()->back()->with('success', 'Ulasan berhasil dihapus');
    }
}