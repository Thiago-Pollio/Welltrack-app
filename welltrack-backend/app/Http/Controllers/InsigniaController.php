<?php

namespace App\Http\Controllers;

use App\Models\InsigniaLogro;
use App\Models\UsuarioInsignia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InsigniaController extends Controller
{
    // public function ganar(Request $request)
    // {
    //     $user = $request->user();
    //     $nivel = $request->nivel;  // 1 al 5

    //     $insignia = InsigniaLogro::where('tipo', 'pomodoro')
    //         ->where('nivel', $nivel)
    //         ->firstOrFail();

    //     // Ya la tiene?
    //     $ya = UsuarioInsignia::where('idUsuario', $user->idUsuario)
    //         ->where('idInsignia', $insignia->idInsignia)
    //         ->exists();

    //     if ($ya) {
    //         return response()->json([
    //             'nueva' => false,
    //             'insignia' => $insignia
    //         ]);
    //     }

    //     // Guardar
    //     UsuarioInsignia::create([
    //         'idUsuario' => $user->idUsuario,
    //         'idInsignia' => $insignia->idInsignia
    //     ]);

    //     return response()->json([
    //         'nueva' => true,
    //         'insignia' => $insignia
    //     ]);
    // }

    public function ganar(Request $request)
{
    $user = $request->user();

    $total = $user->totalPomodoros;

    // Buscar la insignia más alta que cumpla el requisito
    $insignia = InsigniaLogro::where('tipo', 'pomodoro')
        ->where('requisito_ciclos', '<=', $total)
        ->orderBy('requisito_ciclos', 'desc')
        ->first();

    if (!$insignia) {
        return response()->json(['nueva' => false]);
    }

    // Ya la tiene?
    $ya = UsuarioInsignia::where('idUsuario', $user->idUsuario)
        ->where('idInsignia', $insignia->idInsignia)
        ->exists();

    if ($ya) {
        return response()->json(['nueva' => false]);
    }

    // Guardar insignia
    UsuarioInsignia::create([
        'idUsuario' => $user->idUsuario,
        'idInsignia' => $insignia->idInsignia
    ]);

    return response()->json([
        'nueva' => true,
        'insignia' => $insignia
    ]);
}

    public function misInsignias(Request $request)
    {
        $user = $request->user();

        $insignias = UsuarioInsignia::where('idUsuario', $user->idUsuario)
            ->with('insignia')  // relación para traer título, imagen, nivel, etc
            ->get();

        return response()->json([
            'insignias' => $insignias
        ]);
    }

    public function homeInfo(Request $request)
{
    $user = $request->user();

    // Total de pomodoros completados
    $totalPomodoros = $user->pomodoros_completados ?? 0;

    // Insignias ganadas
    $insignias = UsuarioInsignia::where('idUsuario', $user->idUsuario)
        ->with('insignia')
        ->get();

    return response()->json([
        'pomodoros_completados' => $totalPomodoros,
        'insignias' => $insignias
    ]);
}

public function resumenHome(Request $request)
{
    $user = $request->user();

    // Cantidad total de pomodoros completados
    $totalPomodoros = \DB::table('pomodoro_sesiones')
        ->where('idUsuario', $user->idUsuario)
        ->where('completado', true)
        ->count();

    // Insignias obtenidas
    $insignias = UsuarioInsignia::where('idUsuario', $user->idUsuario)
        ->with('insignia')
        ->get();

    // La mejor insignia (si tiene)
    $mejor = null;
    if ($insignias->count() > 0) {
        $mejor = $insignias->sortByDesc('insignia.nivel')->first()->insignia;
    }

    return response()->json([
        'totalPomodoros' => $totalPomodoros,
        'insignias' => $insignias,
        'mejorInsignia' => $mejor,
    ]);
}
}
