<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

//use Illuminate\Database\Eloquent\Model;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'idUsuario';

    protected $fillable = [
        'nombreApellido',
        'nombreUsuario',
        'email',
        'password',
        'fechaNac',
        'avatar',
        'pomodoros_completados',
    ];

    protected $hidden = ['password'];

    public function posts()
{
    return $this->hasMany(Post::class, 'idUsuario', 'idUsuario');
}

public function comentarios()
{
    return $this->hasMany(Comentario::class, 'idUsuario', 'idUsuario');
}

public function likes()
{
    return $this->hasMany(Like::class, 'idUsuario', 'idUsuario');
}

public function insignias()
{
    return $this->hasMany(UsuarioInsignia::class, 'idUsuario', 'idUsuario')
        ->with('insignia');
}
}
