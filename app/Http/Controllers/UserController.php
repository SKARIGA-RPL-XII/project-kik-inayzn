<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pengguna/index', [
            // Ambil semua admin tanpa pagination agar selalu di atas
            'admins' => User::where('role', 'admin')
                ->select('id', 'username', 'email', 'role')
                ->latest()
                ->get(),
            
            // Ambil user biasa dengan pagination
            'users' => User::where('role', 'user')
                ->select('id', 'username', 'email', 'role')
                ->latest()
                ->paginate(10)
        ]);
    }

    /**
     * Update data pengguna (untuk Modal Edit)
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed', // nullable supaya kalau password kosong tidak ganti
        ]);

        $user->username = $request->username;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->back()->with('message', 'Data berhasil diperbarui!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'admin', // Sesuaikan jika ingin nambah admin via modal
        ]);

        return redirect()->back()->with('message', 'Pengguna berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('message', 'Pengguna berhasil dihapus!');
    }
}