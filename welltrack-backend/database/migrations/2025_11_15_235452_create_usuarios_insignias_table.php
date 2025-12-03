<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('usuarios_insignias', function (Blueprint $table) {

            $table->id('idUsuarioInsignia');

            $table->unsignedBigInteger('idUsuario');
            $table->unsignedBigInteger('idInsignia');

            $table->timestamp('fechaObtencion')->useCurrent();

            // FOREIGN KEYS
            $table->foreign('idUsuario')
                ->references('idUsuario')->on('usuarios')
                ->onDelete('cascade');

            $table->foreign('idInsignia')
                ->references('idInsignia')->on('insignias_logros')
                ->onDelete('cascade');

            // 🔥 ESTA PARTE FALTABA
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuarios_insignias');
    }
};