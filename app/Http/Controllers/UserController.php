<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage; // <--- WAJIB TAMBAH INI
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pengguna/index', [
            'admins' => User::where('role', 'admin')
                ->select('id', 'username', 'email', 'role')
                ->latest()
                ->get(),
            
            'users' => User::where('role', 'user')
                ->select('id', 'username', 'email', 'role')
                ->latest()
                ->paginate(10)
        ]);
    }

    /**
     * Update Foto Profil (Fungsi yang tadi hilang)
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Hapus foto lama jika ada di folder storage
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Upload foto baru ke folder 'avatars'
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Update kolom avatar di database
            $user->update([
                'avatar' => $path
            ]);
        }

        return redirect()->back()->with('message', 'Foto profil berhasil diperbarui!');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'username' => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8|confirmed',
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
            'role'     => 'admin', 
        ]);

        return redirect()->back()->with('message', 'Pengguna berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Opsional: Hapus juga foto profilnya saat user dihapus
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->back()->with('message', 'Pengguna berhasil dihapus!');
    }
}