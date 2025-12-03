<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InsigniaLogro extends Model
{
    protected $table = 'insignias_logros';
    protected $primaryKey = 'idInsignia';

    protected $fillable = [
        'titulo','descripcion','nivel','tipo','imagen','requisito_ciclos'
    ];

    public function usuarios()
{
    return $this->hasMany(UsuarioInsignia::class, 'idInsignia', 'idInsignia');
}
}