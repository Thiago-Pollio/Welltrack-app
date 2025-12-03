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
    Schema::create('pomodoro_sesiones', function (Blueprint $table) {
        $table->id('idSesion');

        $table->unsignedBigInteger('idUsuario');

        $table->string('modo', 50);          // clasico, profundo, express, personalizado
        $table->string('fase', 50);          // foco, descanso_corto, descanso_largo

        $table->integer('ciclosTotales')->nullable();  // ej: 4 ciclos
        $table->integer('cicloActual')->nullable();    // ej: 2

        $table->integer('duracionFase');     // segundos previstos (p.ej. 1500)
        $table->integer('duracionReal')->default(0);

        $table->boolean('completado')->default(false);

        $table->dateTime('inicio');
        $table->dateTime('fin')->nullable();

        $table->text('notas')->nullable();

        $table->string('audioSeleccionado', 100)->nullable();
        $table->integer('volumen')->default(70);

        $table->timestamps();

        $table->foreign('idUsuario')
              ->references('idUsuario')
              ->on('usuarios')
              ->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pomodoro_sesiones');
    }
};
