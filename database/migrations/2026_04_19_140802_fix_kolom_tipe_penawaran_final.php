<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            if (Schema::hasColumn('produks', 'tipe')) {
                $table->dropColumn('tipe');
            }
            
            if (!Schema::hasColumn('produks', 'tipe_penawaran')) {
                $table->string('tipe_penawaran')->after('kategori')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('produks', function (Blueprint $table) {
            $table->dropColumn('tipe_penawaran');
            $table->string('tipe')->nullable();
        });
    }
};