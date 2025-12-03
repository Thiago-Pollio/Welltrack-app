<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('likes', function (Blueprint $table) {
        $table->id('idLike');
        $table->unsignedBigInteger('idPost');
        $table->unsignedBigInteger('idUsuario');
        $table->timestamps();

        $table->foreign('idPost')->references('idPost')->on('posts')->onDelete('cascade');
        $table->foreign('idUsuario')->references('idUsuario')->on('usuarios')->onDelete('cascade');

        $table->unique(['idPost', 'idUsuario']); // Un like por usuario
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
