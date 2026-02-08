<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            
            'auth' => [
                'user' => $request->user(),
                
                // Menambahkan data notifikasi ulasan (diambil dari tabel notifications)
                'notifications' => $request->user() 
                    ? $request->user()->unreadNotifications()->latest()->take(10)->get() 
                    : [],
                
                // Menambahkan hitungan angka untuk badge "Baru" di profil
                'unread_count' => $request->user() 
                    ? $request->user()->unreadNotifications()->count() 
                    : 0,
            ],

            // Data Flash untuk Notifikasi (Toast success/error)
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}