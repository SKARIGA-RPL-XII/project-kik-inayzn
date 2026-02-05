<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'nama_produk' => fake()->words(2, true),
            'kategori' => fake()->word(),
            'harga' => fake()->numberBetween(10000, 500000),
            'stok' => fake()->numberBetween(1, 100),
            'status' => 'aktif',
            'deskripsi' => fake()->paragraph(),
            'gambar' => null,
        ]);
    }
}
