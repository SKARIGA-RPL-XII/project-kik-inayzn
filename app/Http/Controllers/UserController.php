<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pengguna/index', [
            'admins' => User::where('role', 'admin')
                // Tambahkan 'avatar' dan 'updated_at' agar admin bisa lihat foto & urutan terbaru
                ->select('id', 'username', 'email', 'role', 'avatar', 'updated_at')
                ->latest('updated_at') // Urutkan berdasarkan update terakhir
                ->get(),
            
            'users' => User::where('role', 'user')
                ->select('id', 'username', 'email', 'role', 'avatar', 'updated_at')
                ->latest('updated_at')
                ->paginate(10)
        ]);
    }

    // Fungsi update profil (biasanya dipanggil oleh admin untuk edit user lain)
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

        return redirect()->back()->with('message', 'Data pengguna berhasil diperbarui!');
    }

    // Fungsi updateAvatar (Sudah oke, pastikan ProfileController juga pakai logika yang sama)
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $path]);
        }

        return redirect()->back()->with('message', 'Foto profil berhasil diperbarui!');
    }

    // ... fungsi store dan destroy tetap sama ...
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

        return redirect()->back()->with('message', 'Admin baru berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        $user->delete();
        return redirect()->back()->with('message', 'Pengguna berhasil dihapus!');
    }
}