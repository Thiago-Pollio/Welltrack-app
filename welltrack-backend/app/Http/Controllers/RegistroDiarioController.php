<?php

namespace App\Http\Controllers;

use App\Models\RegistroDiario;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RegistroDiarioController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'fecha' => 'required|date',
        'estadoAnimo' => 'string|max:50',
        'mente' => 'nullable|string|max:50',
        'energiaNivel' => 'nullable|string|max:50',
        'horasSueño' => 'nullable|numeric|min:0|max:24',
        'vidaSocial' => 'nullable|string|max:50',
        'aguaTomada' => 'nullable|numeric|min:0|max:5000',
        'estresNivel' => 'nullable|integer|min:1|max:10',
        'notaOpcional' => 'nullable|string|max:500',
    ]);

    

    $user = $request->user();

    $fechaLocal = \Carbon\Carbon::parse($validated['fecha'], 'America/Argentina/Buenos_Aires')->format('Y-m-d');

    $registro = RegistroDiario::updateOrCreate(
        [
            'idUsuario' => $user->idUsuario,
            'fecha' => $fechaLocal,
        ],
        array_merge($validated, ['fecha' => $fechaLocal])
    );

    return response()->json([
        'mensaje' => 'Registro diario guardado con éxito',
        'registro' => $registro
    ], Response::HTTP_CREATED);
}


        public function index(Request $request)
    {
        $user = $request->user();

            $registros = RegistroDiario::where('idUsuario', $user->idUsuario)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'mensaje' => 'Registros obtenidos con éxito',
            'registros' => $registros
        ], 200);
    }

    public function ultimo(Request $request)
{
    $user = $request->user();
    $hoyAr= now('America/Argentina/Buenos_Aires')->toDateString();


    $registro = RegistroDiario::where('idUsuario', $user->idUsuario)
        ->where('fecha', $hoyAr)
        ->first();

    if (!$registro) {
        return response()->json([
            'mensaje' => 'No hay registros todavía',
            'registro' => null
        ], 200);
    }

    return response()->json([
        'mensaje' => 'Último registro obtenido con éxito',
        'registro' => $registro
    ], 200);
}
}
