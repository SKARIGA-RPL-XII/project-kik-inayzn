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
            // Relasi ke tabel users (siapa yang memberikan ulasan)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Relasi ke tabel produks (produk mana yang diulas)
            // Sesuaikan 'produks' dengan nama tabel produk kamu
            $table->foreignId('produk_id')->constrained('produks')->onDelete('cascade');
            
            $table->text('isi_ulasan'); // Kolom untuk teks komentar
            $table->integer('rating');   // Kolom untuk jumlah bintang (1-5)
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