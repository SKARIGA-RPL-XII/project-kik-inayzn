<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // Tambahkan ini woik!

class Product extends Model
{
    protected $table = 'produks'; // ✅ sudah benar

    protected $fillable = [
        'nama_produk',
        'kategori',
        'harga',
        'stok',
        'status',
        'deskripsi',
        'gambar'
    ];

    /**
     * ✅ RELASI: Satu produk punya banyak ulasan
     * Fungsi inilah yang dicari Controller saat kamu panggil with(['ulasans'])
     */
    public function ulasans(): HasMany
    {
        // 'produk_id' adalah nama kolom di tabel ulasans yang menyambung ke sini
        return $this->hasMany(Ulasan::class, 'produk_id');
    }
}