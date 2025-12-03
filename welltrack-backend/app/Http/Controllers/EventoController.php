<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventoController extends Controller
{
    public function index(Request $request)
    {
        $eventos = Evento::where('idUsuario', $request->user()->idUsuario)->get();
        return response()->json($eventos);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'etiqueta' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
        ]);

        $evento = Evento::create([
            'idUsuario' => $request->user()->idUsuario,
            ...$data,
        ]);

        return response()->json(['mensaje' => 'Evento creado correctamente', 'evento' => $evento], Response::HTTP_CREATED);
    }

    public function update(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);

        if ($evento->idUsuario !== $request->user()->idUsuario) {
            return response()->json(['mensaje' => 'No autorizado'], Response::HTTP_FORBIDDEN);
        }

        $evento->update($request->only(['titulo', 'descripcion', 'fecha_inicio', 'fecha_fin', 'etiqueta', 'color']));

        return response()->json(['mensaje' => 'Evento actualizado', 'evento' => $evento], Response::HTTP_OK);
    }

    public function destroy(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);

        if ($evento->idUsuario !== $request->user()->idUsuario) {
            return response()->json(['mensaje' => 'No autorizado'], Response::HTTP_FORBIDDEN);
        }

        $evento->delete();

        return response()->json(['mensaje' => 'Evento eliminado'], Response::HTTP_OK);
    }
}
