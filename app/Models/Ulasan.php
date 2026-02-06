<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ulasan extends Model
{
    // Nama tabel biasanya otomatis 'ulasans', jadi tidak perlu didefinisikan 
    // kecuali kalau nama tabelmu beda.

    protected $fillable = [
        'user_id',
        'produk_id',
        'isi_ulasan',
        'rating',
    ];

    /**
     * Relasi ke User: Satu ulasan dimiliki oleh satu User.
     * Ini supaya di React kita bisa panggil {rev.user.name}
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Product: Satu ulasan merujuk pada satu Produk.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produk_id');
    }
}