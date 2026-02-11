<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $table = 'produks';

    protected $fillable = [
        'nama_produk',
        'kategori',
        'harga',
        'stok',
        'status',
        'deskripsi',
        'gambar',
        'no_agen' // Tambahkan ke fillable agar bisa disimpan via Admin
    ];

    protected $casts = [
        'gambar' => 'array', 
    ];

    public function ulasans(): HasMany
    {
        return $this->hasMany(Ulasan::class, 'produk_id');
    }

    // Helper untuk menampilkan gambar utama
    public function getFirstImageUrlAttribute()
    {
        if ($this->gambar && is_array($this->gambar) && count($this->gambar) > 0) {
            return asset('storage/' . $this->gambar[0]);
        }
        return "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800";
    }
}