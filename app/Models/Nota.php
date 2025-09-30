<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $table = 'notas';
    protected $primaryKey = 'idNota';

    protected $fillable = [
        'idUsuario',
        'contenido',
        'estadoNota'
    ];

    public $timestamps = true;
}
