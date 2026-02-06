<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany; // Tambahkan ini

class Ulasan extends Model
{
    protected $fillable = [
        'user_id',
        'produk_id',
        'parent_id',    
        'isi_ulasan',
        'rating',
        'admin_reply',  
        'is_read',      
    ];

    /**
     * Relasi ke User: Siapa yang menulis ulasan/balasan ini.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Product: Merujuk ke tabel 'produks'.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'produk_id');
    }

    /**
     *  RELASI BARU: Mendapatkan balasan untuk ulasan ini.
     * Digunakan untuk fitur diskusi antar user.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Ulasan::class, 'parent_id')->with('user');
    }

    /**
     *  RELASI BARU: Mengetahui ulasan ini membalas siapa.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Ulasan::class, 'parent_id');
    }
}