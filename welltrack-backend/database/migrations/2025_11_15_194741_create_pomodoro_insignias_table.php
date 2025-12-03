<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pomodoro_insignias', function (Blueprint $table) {
            $table->id('idInsignia');
            $table->unsignedBigInteger('idUsuario');

            // Nivel de 1 a 5
            $table->unsignedTinyInteger('nivel')->default(1);

            // Día al que corresponde la insignia
            $table->date('fecha');

            $table->timestamps();

            // Relación con usuarios (ajustá nombre de tabla/PK si difiere)
            $table->foreign('idUsuario')
                ->references('idUsuario')
                ->on('usuarios')
                ->onDelete('cascade');

            // Para que no haya dos insignias del mismo día para el mismo usuario
            $table->unique(['idUsuario', 'fecha']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pomodoro_insignias');
    }
};