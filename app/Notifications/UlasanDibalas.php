<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Ulasan;

class UlasanDibalas extends Notification
{
    use Queueable;

    public $ulasanBaru;

    public function __construct(Ulasan $ulasan)
    {
        $this->ulasanBaru = $ulasan;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'replier_name' => $this->ulasanBaru->user->username ?? 'Seseorang',
            'product_name' => $this->ulasanBaru->product->nama_produk ?? 'Produk',
            'isi_ulasan'   => $this->ulasanBaru->isi_ulasan,
            'produk_id'    => $this->ulasanBaru->produk_id,
            
            // --- LOGIKA ID UNTUK NAVIGASI ---
            // Jika ini balasan (ada parent_id), kita arahkan ke ID ulasan utama.
            // Jika ini balasan admin (ulasan utama), arahkan ke dirinya sendiri.
            'ulasan_id'    => $this->ulasanBaru->parent_id ?? $this->ulasanBaru->id,
            
            'message'      => 'membalas ulasan Anda.',
        ];
    }
}