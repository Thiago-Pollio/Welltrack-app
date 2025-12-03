<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PomodoroSesion extends Model
{
    protected $table = 'pomodoro_sesiones';
    protected $primaryKey = 'idSesion';

    protected $fillable = [
        'idUsuario',
        'modo',
        'fase',
        'ciclosTotales',
        'cicloActual',
        'duracionFase',
        'duracionReal',
        'completado',
        'inicio',
        'fin',
        'notas',
        'audioSeleccionado',
        'volumen',
        'activo'
    ];

    protected $casts = [
        'inicio' => 'datetime',
        'fin' => 'datetime',
        'completado' => 'boolean',
    ];

    // Relación: una sesión pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idUsuario', 'idUsuario');
    }
}