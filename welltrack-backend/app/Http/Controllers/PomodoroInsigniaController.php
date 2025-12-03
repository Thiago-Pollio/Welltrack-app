<?php

namespace App\Http\Controllers;

use App\Models\PomodoroInsignia;
use App\Models\PomodoroSesion;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;

class PomodoroInsigniaController extends Controller
{
    /**
     * Registra o actualiza la insignia del día
     * cuando una sesión de pomodoro es finalizada.
     */
    public function registrarInsignia(Request $request, $idSesion)
    {
        $user = $request->user();

        $sesion = PomodoroSesion::where('idSesion', $idSesion)
            ->where('idUsuario', $user->idUsuario)
            ->firstOrFail();

        // Determinar nivel en base a ciclos
        $ciclos = $sesion->cicloActual ?? 1;
        $nivel = $this->calcularNivel($ciclos);

        $hoy = Carbon::today('America/Argentina/Buenos_Aires')->toDateString();

        // Crear o actualizar insignia del día
        $insignia = PomodoroInsignia::updateOrCreate(
            [
                'idUsuario' => $user->idUsuario,
                'fecha' => $hoy
            ],
            [
                'nivel' => $nivel
            ]
        );

        return response()->json([
            'mensaje' => 'Insignia actualizada',
            'insignia' => $insignia
        ], 200);
    }

    /**
     * Retorna la insignia actual del usuario (solo hoy).
     */
    public function insigniaHoy(Request $request)
    {
        $user = $request->user();
        $hoy = Carbon::today('America/Argentina/Buenos_Aires')->toDateString();

        $insignia = PomodoroInsignia::where('idUsuario', $user->idUsuario)
            ->where('fecha', $hoy)
            ->first();

        return response()->json([
            'insignia' => $insignia
        ]);
    }

    /**
     * Retorna todas las insignias del usuario.
     */
    public function historial(Request $request)
    {
        $user = $request->user();

        $insignias = PomodoroInsignia::where('idUsuario', $user->idUsuario)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'insignias' => $insignias
        ]);
    }

    /**
     * Lógica de niveles
     */
    private function calcularNivel(int $ciclos)
    {
        if ($ciclos >= 5) return 5;
        if ($ciclos === 4) return 4;
        if ($ciclos === 3) return 3;
        if ($ciclos === 2) return 2;
        return 1; // 1 ciclo
    }
}