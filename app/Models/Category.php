<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Menentukan kolom mana saja yang boleh diisi secara massal
    protected $fillable = ['name'];

    /**
     * Relasi ke Product: Satu kategori memiliki banyak produk.
     * Ini yang memungkinkan fungsi withCount('products') di Controller bekerja.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}