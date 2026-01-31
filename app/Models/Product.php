<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'produks'; // Sesuai nama di migration

    protected $fillable = [
        'nama_produk',
        'kategori',
        'harga',
        'stok',
        'status',
        'deskripsi',
        'gambar',
    ];
}