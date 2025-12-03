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
    Schema::create('insignias_logros', function (Blueprint $table) {
        $table->id('idInsignia');
        $table->string('titulo');
        $table->string('descripcion')->nullable();
        $table->integer('nivel')->default(1); // 1 a 5
        $table->string('tipo')->default('pomodoro'); // pomodoro, habito, racha, etc.
        $table->string('imagen')->nullable(); // ruta a imagen PNG/SVG
        $table->integer('requisito_ciclos')->nullable(); // p/ pomodoro
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insignias_logros');
    }
};
