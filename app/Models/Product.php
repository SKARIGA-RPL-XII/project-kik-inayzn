<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'produks'; // ✅ karena nama tabel tidak default

    protected $fillable = [
        'nama_produk',
        'kategori',
        'harga',
        'stok',
        'status',
        'deskripsi',
        'gambar'
    ];
}
