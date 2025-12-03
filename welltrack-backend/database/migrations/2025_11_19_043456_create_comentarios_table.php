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
    Schema::create('comentarios', function (Blueprint $table) {
        $table->id('idComentario');
        $table->unsignedBigInteger('idPost');
        $table->unsignedBigInteger('idUsuario');
        $table->string('contenido', 200);
        $table->timestamps();

        $table->foreign('idPost')->references('idPost')->on('posts')->onDelete('cascade');
        $table->foreign('idUsuario')->references('idUsuario')->on('usuarios')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
