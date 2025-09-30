<?php

namespace App\Http\Controllers;

use App\Models\Nota;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            //'idUsuario' => 'required|exists:usuarios,idUsuario',
            'contenido' => 'required|string|max:500',
            'estadoNota' => 'nullable|string|in:activa,destacada,archivada,eliminada'
        ]);

        $user = $request->user();

        $nota = Nota::create([
            'idUsuario' => $user->idUsuario,
            'contenido' => $validated['contenido'],
            'estadoNota' => $validated['estadoNota'] ?? 'activa',
        ]);

        return response()->json([
            'mensaje' => 'Nota creada con exito',
            'nota' => $nota
        ], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $estado = $request->query('estado');

        if ($estado) {
            $notas = Nota::where('idUsuario, $user->idUsuario')
            ->where('estadoNota', $estado)
            ->orderBy('updated_at', 'desc')
            ->get();
        } else {
            $notas = Nota::where('idUsuario', $user->idUsuario)
            ->whereIn('estadoNota', ['destacada', 'activa'])
            ->orderByRaw("estadoNota = 'destacada' DESC, updated_at DESC")
            ->get();
        }

        //$notas = Nota::where('idUsuario', $request->user()->idUsuario)->get();

        return response()->json([
            'mensaje' => 'Notas obtenidas con éxito',
            'notas' => $notas
        ], 200);
    }

    public function destacar (Request $request, $id)
    {
        $nota = Nota::findOrFail($id);

        if ($nota->idUsuario !== $request->user()->idUsuario) {
            return response()->json(['mensaje' => 'No autorizado'], Response::HTTP_FORBIDDEN);
        }
        $nota->estadoNota = 'destacada';
        $nota->save();

        return response()->json(['mensaje' => 'Nota destacada', 'nota' => $nota], Response::HTTP_OK);
    }
}
