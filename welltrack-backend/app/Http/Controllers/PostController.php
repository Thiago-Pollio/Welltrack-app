<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class PostController extends Controller
{
public function index()
{
    return Post::with(['usuario', 'likes', 'comentarios'])
        ->orderBy('created_at', 'desc')
        ->get();
}

public function store(Request $request)
{
    $request->validate([
        'contenido' => 'required|max:300',
    ]);

    return Post::create([
        'idUsuario' => $request->user()->idUsuario,
        'contenido' => $request->contenido,
    ]);
}

public function show($idPost)
{
    return Post::with([
        'usuario',
        'comentarios.usuario',
        'likes'
    ])->findOrFail($idPost);
}

public function preguntas()
{
    return Post::with('usuario')
        ->where('contenido', 'LIKE', '%?')
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();
}

public function tendencias()
{
    return Post::with('usuario')
        ->withCount('likes')
        ->orderBy('likes_count', 'desc')
        ->take(5)
        ->get();
}
}