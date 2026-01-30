<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,    // Ini akan menjalankan akun Admin & User di atas
            ProductSeeder::class, // Seeder produk kamu
        ]);
    }
}