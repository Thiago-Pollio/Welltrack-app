<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegistroDiario;

class UserStatsController extends Controller
{
    // -------------------------------------------
    // A) Últimos 7 días – sueño, agua, estrés
    // -------------------------------------------
    public function historial7dias(Request $request)
    {
        $user = $request->user();

        $registros = RegistroDiario::where('idUsuario', $user->idUsuario)
            ->orderBy('fecha', 'desc')
            ->take(7)
            ->get()
            ->map(function ($r) {
                return [
                    'fecha' => $r->fecha,
                    'sueño' => $r->horasSueño ?? 0,
                    'agua'  => $r->aguaTomada ?? 0,
                    'estres'=> $r->estresNivel ?? 5,
                ];
            });

        return response()->json($registros);
    }

    // -------------------------------------------
    // B) Mini-estadísticas (promedios)
    // -------------------------------------------
    public function stats(Request $request)
    {
        $user = $request->user();

        $registros = RegistroDiario::where('idUsuario', $user->idUsuario)->get();

        if ($registros->count() === 0) {
            return response()->json([
                'promedio_sueno' => 0,
                'promedio_agua'  => 0,
                'promedio_estres' => 0,
                'dias_registrados' => 0,
            ]);
        }

        return response()->json([
            'promedio_sueno' => round($registros->avg('horasSueño'), 1),
            'promedio_agua'  => round($registros->avg('aguaTomada')),
            'promedio_estres'=> round($registros->avg('estresNivel'), 1),
            'dias_registrados' => $registros->count(),
        ]);
    }

    // -------------------------------------------
    // C) Total pomodoros (ya lo tenés en usuario)
    // -------------------------------------------
    public function pomodoros(Request $request)
    {
        return response()->json([
            'totalPomodoros' => $request->user()->pomodoros_completados ?? 0
        ]);
    }
}
