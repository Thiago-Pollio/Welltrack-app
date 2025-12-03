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
    Schema::create('racha_global', function (Blueprint $table) {
        $table->id('idRachaGlobal');
        $table->unsignedBigInteger('idUsuario');
        $table->integer('rachaActual')->default(0);
        $table->integer('rachaMaxima')->default(0);
        $table->date('fechaUltimoCumplimiento')->nullable();
        $table->timestamps();

        $table->foreign('idUsuario')->references('idUsuario')->on('usuarios')->onDelete('cascade');
    });
}

public function down()
{
    Schema::dropIfExists('racha_global');
}
};
