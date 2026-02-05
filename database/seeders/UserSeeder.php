<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder 
{
    public function run(): void
    {
        // 1. Akun Admin (Hardcoded)
        User::create([
            'username' => 'admin_toko',
            'email'    => 'admin@gmail.com',
            'password' => '123', // Pastikan di Model User sudah ada cast 'hashed'
            'role'     => 'admin',
        ]);

        // 2. Akun User Biasa (Hardcoded)
        User::create([
            'username' => 'budi_pelanggan',
            'email'    => 'budi@gmail.com',
            'password' => 'password123', 
            'role'     => 'user',
        ]);
    }
}