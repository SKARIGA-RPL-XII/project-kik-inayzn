<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ulasan extends Model
{
    protected $fillable = [
        'user_id',
        'produk_id',
        'parent_id',    
        'isi_ulasan',
        'rating',
        'admin_reply',  
        // 'is_read' dihapus dari fillable karena kita pakai tabel 'notifications' sekarang
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
     * Mendapatkan balasan (thread) untuk ulasan ini.
     */
    public function replies(): HasMany
    {
        // 'with' user memastikan nama pengirim balasan langsung terbawa ke frontend
        return $this->hasMany(Ulasan::class, 'parent_id')->with('user');
    }

    /**
     * Mengetahui ulasan ini membalas ulasan yang mana.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Ulasan::class, 'parent_id');
    }
}