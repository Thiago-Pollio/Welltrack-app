<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RachaGlobal extends Model
{
    use HasFactory;

    protected $table = 'racha_global';
    protected $primaryKey = 'idRachaGlobal';
    protected $fillable = [
        'idUsuario',
        'rachaActual',
        'rachaMaxima',
        'fechaUltimoCumplimiento',
    ];
}