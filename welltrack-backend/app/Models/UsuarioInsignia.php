<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuarioInsignia extends Model
{
    protected $table = 'usuarios_insignias';
    protected $primaryKey = 'idUsuarioInsignia';
    public $timestamps = false;

    protected $fillable = [
        'idUsuario',
        'idInsignia',
        'fechaObtencion',
    ];

    public function insignia()
    {
        return $this->belongsTo(InsigniaLogro::class, 'idInsignia', 'idInsignia');
    }
}