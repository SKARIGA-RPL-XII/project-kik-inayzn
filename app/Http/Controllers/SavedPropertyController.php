<?php

namespace App\Http\Controllers;

use App\Models\SavedProperty;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SavedPropertyController extends Controller
{
    public function index()
    {
        $savedItems = SavedProperty::with('produk')
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($item) {
                if ($item->produk) {
                    $gambar = $item->produk->gambar;
                    
                    // LOGIKA PERBAIKAN: Cek jika gambar adalah array atau string JSON
                    $namaFile = null;
                    if (is_array($gambar)) {
                        $namaFile = $gambar[0] ?? null;
                    } elseif (is_string($gambar)) {
                        // Cek jika string adalah JSON (seperti ["foto.jpg"])
                        $decoded = json_decode($gambar, true);
                        if (is_array($decoded)) {
                            $namaFile = $decoded[0] ?? null;
                        } else {
                            // Jika string biasa (single file)
                            $namaFile = $gambar;
                        }
                    }

                    $item->produk->gambar_url = $namaFile 
                        ? asset('storage/' . $namaFile) 
                        : null;
                }
                return $item;
            });

        return Inertia::render('user/simpan', [
            'savedProperties' => $savedItems
        ]);
    }

    public function toggle($id)
    {
        $userId = Auth::id();
        
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