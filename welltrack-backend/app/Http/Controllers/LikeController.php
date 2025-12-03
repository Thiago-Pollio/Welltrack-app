<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class LikeController extends Controller
{
public function toggle(Request $request, $idPost)
{
    $idUsuario = $request->user()->idUsuario;

    $like = Like::where('idPost', $idPost)->where('idUsuario', $idUsuario);

    if ($like->exists()) {
        $like->delete();
        return ['liked' => false];
    } else {
        Like::create(['idPost' => $idPost, 'idUsuario' => $idUsuario]);
        return ['liked' => true];
    }
}
}