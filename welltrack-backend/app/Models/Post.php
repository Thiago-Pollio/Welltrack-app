<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';
    protected $primaryKey = 'idPost';

    protected $fillable = ['idUsuario', 'contenido'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'idUsuario');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class, 'idPost', 'idPost');
    }

    public function likes()
    {
        return $this->hasMany(Like::class, 'idPost', 'idPost');
    }
}