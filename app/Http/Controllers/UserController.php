<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Ambil query pencarian
        $search = $request->input('search');

        return Inertia::render('admin/pengguna/index', [
            // Admin biasanya tidak dipaginate karena jumlahnya sedikit
            'admins' => User::where('role', 'admin')
                ->when($search, function ($query, $search) {
                    $query->where(function($q) use ($search) {
                        $q->where('username', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->select('id', 'username', 'email', 'role', 'avatar', 'updated_at')
                ->latest('updated_at')
                ->get(),
            
            // User reguler dengan pagination
            'users' => User::where('role', 'user')
                ->when($search, function ($query, $search) {
                    $query->where(function($q) use ($search) {
                        $q->where('username', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->select('id', 'username', 'email', 'role', 'avatar', 'updated_at')
                ->latest('updated_at')
                ->paginate(10)
                ->withQueryString(), // Menjaga query string 'search' tetap ada saat pindah halaman

            // Kirim balik nilai filter untuk state di React
            'filters' => [
                'search' => $search
            ]
        ]);
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
            'role'     => 'admin', // Default dari form ini adalah tambah admin
        ]);

        return redirect()->back()->with('message', 'Admin baru berhasil ditambahkan!');
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

        return redirect()->back()->with('message', 'Data pengguna berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Hapus avatar jika ada sebelum hapus user
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }
        
        $user->delete();

        return redirect()->back()->with('message', 'Pengguna berhasil dihapus!');
    }

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
}