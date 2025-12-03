<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PomodoroInsignia extends Model
{
    protected $table = 'pomodoro_insignias';
    protected $primaryKey = 'idInsignia';

    protected $fillable = [
        'idUsuario',
        'nivel',
        'fecha',
    ];

    public $timestamps = true;

    // Opcional, si querés:
    public function usuario()
    {
        return $this->belongsTo(User::class, 'idUsuario', 'idUsuario');
    }
}