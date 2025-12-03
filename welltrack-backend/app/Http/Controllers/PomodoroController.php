<?php

namespace App\Http\Controllers;

use App\Models\PomodoroSesion;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PomodoroController extends Controller
{
public function iniciar(Request $request)
{
    $request->validate([
        'modo' => 'required|string|max:50',
        'fase' => 'required|string|max:50',
        'duracionFase' => 'required|integer|min:1',
        'ciclosTotales' => 'nullable|integer|min:1',
        'audioSeleccionado' => 'nullable|string|max:100',
        'volumen' => 'nullable|integer|min:0|max:100'
    ]);

    $modo = $request->modo;

    $duracionesPredef = [
        'clasico' => ['foco' => 25, 'corto' => 5, 'largo' => 15, 'cada' => 4],
        'suave'   => ['foco' => 15, 'corto' => 5, 'largo' => 10, 'cada' => 4],
        'intenso' => ['foco' => 50, 'corto' => 10, 'largo' => 30, 'cada' => 2],
    ];

    // ⛔ Validación ANTES de crear sesion
    if ($modo !== 'personalizado' && !isset($duracionesPredef[$modo])) {
        return response()->json(['error' => 'Modo inválido'], 422);
    }

    $user = $request->user();

    // Cerrar cualquier sesión activa
    PomodoroSesion::where('idUsuario', $user->idUsuario)
        ->where('activo', true)
        ->update(['activo' => false]);

    // Crear nueva sesión
    $sesion = PomodoroSesion::create([
        'idUsuario' => $user->idUsuario,
        'modo' => $modo,
        'fase' => $request->fase,
        'ciclosTotales' => $request->ciclosTotales,
        'cicloActual' => 1,
        'duracionFase' => $request->duracionFase,
        'duracionReal' => 0,
        'audioSeleccionado' => $request->audioSeleccionado,
        'volumen' => $request->volumen ?? 70,
        'inicio' => now(),
    ]);

    return response()->json([
        'mensaje' => 'Sesión iniciada',
        'idSesion' => $sesion->idSesion
    ], 201);
}

public function actualizar(Request $request, $idSesion)
{
    $user = $request->user();
    
    $sesion = PomodoroSesion::where('idSesion', $idSesion)
        ->where('idUsuario', $user->idUsuario)
        ->firstOrFail();

    $sesion->update($request->only([
        'fase', 'cicloActual', 'duracionReal', 'audioSeleccionado', 'volumen', 'notas'
    ]));

    return response()->json([
        'mensaje' => 'Sesión actualizada',
        'sesion' => $sesion
    ]);
}

public function finalizar(Request $request, $idSesion)
{
    $user = $request->user();

    $sesion = PomodoroSesion::where('idSesion', $idSesion)
        ->where('idUsuario', $user->idUsuario)
        ->firstOrFail();

    $sesion->duracionReal = $request->duracionReal ?? $sesion->duracionReal;
    $sesion->fin = now();
    $sesion->activo = false;
    $sesion->completado = true;
    $sesion->save();

    // 💠 Sumar 1 pomodoro al usuario
$user->increment('totalPomodoros');

    return response()->json([
        'mensaje' => 'Sesión finalizada',
        'sesion' => $sesion
    ]);
}

public function historial(Request $request)
{
    $user = $request->user();

    $desde = $request->query('desde', now()->subDays(7)->toDateString());
    $hasta = $request->query('hasta', now()->toDateString());

    $sesiones = PomodoroSesion::where('idUsuario', $user->idUsuario)
        ->whereBetween('inicio', [$desde, $hasta . ' 23:59:59'])
        ->orderBy('inicio', 'desc')
        ->get();

    $totalFoco = $sesiones->where('fase', 'foco')->sum('duracionReal');

    return response()->json([
        'totalFoco' => $totalFoco,
        'totalSesiones' => $sesiones->count(),
        'sesiones' => $sesiones
    ]);
}
}
