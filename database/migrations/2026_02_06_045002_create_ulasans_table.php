<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ulasans', function (Blueprint $table) {
            $table->id();
            // Siapa yang komentar
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Produk mana yang diulas (Tabel: produks)
            $table->foreignId('produk_id')->constrained('produks')->onDelete('cascade');
            
            // Kolom untuk fitur balas-balasan antar User
            // Jika NULL = Ulasan Utama. Jika ISI ID = Balasan untuk ulasan ID tersebut.
            $table->foreignId('parent_id')->nullable()->constrained('ulasans')->onDelete('cascade');
            
            $table->text('isi_ulasan');
            $table->integer('rating')->nullable(); // Dibuat nullable karena balasan biasanya gak pake rating bintang
            
            // Kolom tambahan untuk fitur balasan Admin & Notifikasi
            $table->text('admin_reply')->nullable(); 
            $table->boolean('is_read')->default(true); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ulasans');
    }
};