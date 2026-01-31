<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Ganti .get() menjadi .paginate(8) agar ada data navigasi halaman
        return Inertia::render('admin/pengguna/index', [
            'users' => User::select('id', 'username', 'email', 'role', 'created_at')
                ->latest()
                ->paginate(10)
        ]);
    }
}