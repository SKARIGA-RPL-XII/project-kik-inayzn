<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder 
{ // <--- KURUNG INI TADI HILANG, MAKANYA ERROR!
    public function run(): void
    {
        // 1. Akun Admin
        User::create([
            'username' => 'admin_toko',
            'email'    => 'admin@gmail.com',
            'password' => 'password123', // Akan di-hash otomatis oleh Model User
            'role'     => 'admin',
        ]);

        // 2. Akun User Biasa
        User::create([
            'username' => 'budi_pelanggan',
            'email'    => 'budi@gmail.com',
            'password' => 'password123', // Akan di-hash otomatis oleh Model User
            'role'     => 'user',
        ]);
    }
}