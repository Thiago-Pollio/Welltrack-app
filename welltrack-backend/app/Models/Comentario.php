<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    protected $table = 'comentarios';
    protected $primaryKey = 'idComentario';

    protected $fillable = ['idPost', 'idUsuario', 'contenido'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario', 'idUsuario');
    }

    public function post()
{
    return $this->belongsTo(Post::class, 'idPost', 'idPost');
}
}