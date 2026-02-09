<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedProperty extends Model
{
    // Pastikan nama kolom sesuai migration kamu
    protected $fillable = ['user_id', 'produk_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function produk()
    {
        return $this->belongsTo(Product::class, 'produk_id');
    }
}