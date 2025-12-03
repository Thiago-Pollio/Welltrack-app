<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class ComentarioController extends Controller
{
public function store(Request $request, $idPost)
{
    $request->validate(['contenido' => 'required|max:200']);

    return Comentario::create([
        'idPost' => $idPost,
        'idUsuario' => $request->user()->idUsuario,
        'contenido' => $request->contenido,
    ]);
}
}