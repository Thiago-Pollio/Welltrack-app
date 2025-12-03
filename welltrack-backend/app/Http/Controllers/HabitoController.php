<?php

namespace App\Http\Controllers;

use App\Models\Habito;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;
use App\Models\RegistroHabito;
use Illuminate\Support\Facades\Log;

class HabitoController extends Controller
{
    /* ✅ Crear hábito */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:120',
            'descripcion' => 'nullable|string',
            'frecuencia' => 'required|in:diario,semanal,mensual',
            'meta' => 'nullable|integer|min:1',
            'unidad' => 'nullable|string|max:30',
        ]);

        $user = $request->user();

        $habito = Habito::create([
            'idUsuario' => $user->idUsuario,
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'frecuencia' => $validated['frecuencia'],
            'meta' => $validated['meta'] ?? null,
            'unidad' => $validated['unidad'] ?? null,
            'estado' => 'activo',
            'rachaActual' => 0,
            'rachaMaxima' => 0,
            'fechaUltimoRegistro' => null,
        ]);

        return response()->json([
            'mensaje' => 'Hábito creado con éxito',
            'habito' => $habito
        ], Response::HTTP_CREATED);
    }

    /* ✅ Listar hábitos */
    public function index(Request $request)
    {

        Log::info('✅ El log está funcionando correctamente');

        $user = $request->user();

        $habitos = Habito::where('idUsuario', $user->idUsuario)
            ->where('estado', 'activo')
            ->orderBy('created_at', 'desc')
            ->select(
                'idHabito',
                'nombre',
                'descripcion',
                'frecuencia',
                'meta',
                'unidad',
                'estado',
                'rachaActual',
                'rachaMaxima',
                'fechaUltimoRegistro'
            )
            ->get();

        return response()->json([
            'mensaje' => 'Hábitos obtenidos con éxito',
            'registros' => $habitos
        ], 200);
    }

    /* 🗑️ Archivar hábito */
    public function destroy(Request $request, $id)
    {
        try {
            $habito = Habito::find($id);
            if (!$habito) {
                return response()->json(['mensaje' => 'Hábito no encontrado.'], 404);
            }

            $user = $request->user();
            if (!$user || $habito->idUsuario !== $user->idUsuario) {
                return response()->json(['mensaje' => 'No autorizado.'], 403);
            }

            $habito->estado = 'archivado';
            $habito->save();

            return response()->json([
                'mensaje' => 'Hábito archivado con éxito.',
                'habito' => $habito
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'mensaje' => 'Error al eliminar el hábito.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* 📆 Consultar progreso del día */

public function hoy(Request $request, $id)
{
    $user = $request->user();
    $habito = Habito::find($id);

    if (!$habito || $habito->idUsuario !== $user->idUsuario) {
        return response()->json(['mensaje' => 'Hábito no encontrado o no autorizado'], 404);
    }

    $hoy = Carbon::today('America/Argentina/Buenos_Aires')->toDateString();

    // 🔎 Buscar progreso REAL del día (NO usar fechaUltimoRegistro)
    $registroHoy = RegistroHabito::where('idHabito', $habito->idHabito)
        ->where('idUsuario', $user->idUsuario)
        ->whereDate('fecha', $hoy)
        ->first();

    return response()->json([
        'meta'      => $habito->meta,
        'unidad'    => $habito->unidad,
        'valorHoy'  => $registroHoy->cantidadRealizada ?? 0,
        'cumplido'  => (bool)($registroHoy->cumplido ?? false),
    ]);
}

    /* 💪 Marcar progreso y actualizar racha */
// public function marcarProgreso(Request $request, $id)
// {
//     try {
//         $habito = Habito::find($id);
//         if (!$habito) {
//             return response()->json(['mensaje' => 'Hábito no encontrado.'], 404);
//         }

//         $user = $request->user();
//         if (!$user || $habito->idUsuario !== $user->idUsuario) {
//             return response()->json(['mensaje' => 'No autorizado.'], 403);
//         }

//         $validated = $request->validate([
//             'valorHoy' => 'required|numeric|min:0',
//         ]);

//         $valor = $validated['valorHoy'];
//         $meta = $habito->meta ?? 0;
//         $cumplido = $meta > 0 && $valor >= $meta;

//         $hoy = now()->startOfDay();
//         $ultima = $habito->fechaUltimoRegistro
//             ? \Carbon\Carbon::parse($habito->fechaUltimoRegistro)->startOfDay()
//             : null;

//         if ($cumplido) {
//             // ✅ Si el último registro fue ayer, continuar racha
//             if ($ultima && $ultima->isSameDay($hoy->copy()->subDay())) {
//                 $habito->rachaActual += 1;
//             }
//             // 🔁 Si fue antes o nunca, reiniciar racha
//             else {
//                 $habito->rachaActual = 1;
//             }

//             // Actualizar récord máximo
//             if ($habito->rachaActual > $habito->rachaMaxima) {
//                 $habito->rachaMaxima = $habito->rachaActual;
//             }

//             $habito->fechaUltimoRegistro = $hoy;
//         } else {
//             // Si no se cumplió, no se toca la racha, pero actualizamos fecha
//             $habito->fechaUltimoRegistro = $hoy;
//         }

//         $habito->save();

//         return response()->json([
//             'mensaje' => 'Progreso guardado correctamente.',
//             'habito' => [
//                 'idHabito' => $habito->idHabito,
//                 'valorHoy' => $valor,
//                 'cumplido' => $cumplido,
//                 'rachaActual' => $habito->rachaActual,
//                 'rachaMaxima' => $habito->rachaMaxima,
//             ],
//         ], 200);
//     } catch (\Throwable $e) {
//         return response()->json([
//             'mensaje' => 'Error al guardar el progreso.',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// }

public function historial(Request $request, $id)
{
    $user = $request->user();
    $habito = Habito::find($id);

    if (!$habito || $habito->idUsuario !== $user->idUsuario) {
        return response()->json(['mensaje' => 'Hábito no encontrado o no autorizado'], 404);
    }

    $hoy = Carbon::today();
    $inicio = $hoy->copy()->subDays(6); // últimos 7 días

    $registros = RegistroHabito::where('idHabito', $habito->idHabito)
        ->whereBetween('fecha', [$inicio, $hoy])
        ->orderBy('fecha', 'asc')
        ->get(['fecha', 'cumplido']);

    // Crear arreglo con todos los días (aunque no haya registros)
    $historial = collect(range(0, 6))->map(function ($i) use ($inicio, $registros) {
        $fecha = $inicio->copy()->addDays($i)->toDateString();
        $registro = $registros->firstWhere('fecha', $fecha);
        return [
            'fecha' => $fecha,
            'cumplido' => (bool) optional($registro)->cumplido,
        ];
    });

    return response()->json(['historial' => $historial]);
}
}