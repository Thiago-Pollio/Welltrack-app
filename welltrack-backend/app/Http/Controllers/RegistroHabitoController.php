<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegistroHabito;
use App\Models\Habito;
use Illuminate\Http\Response;
use Carbon\Carbon;
use Carbon\CarbonConverterInterface;
use Illuminate\Support\Facades\Log;

class RegistroHabitoController extends Controller
{
    //     public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'idHabito' => 'required|exists:habitos,idHabito',
    //         'valor' => 'required|numeric|min:0',
    //         'fecha' => 'required|date',
    //         'comentario' => 'nullable|string|max:255',
    //     ]);

    //     $user = $request->user();

    //     $habito = \App\Models\Habito::find($validated['idHabito']);
    //     $cumplido = $validated['valor'] >= $habito->meta;

    //     // 💾 Buscar o crear registro del día
    //     $registro = \App\Models\RegistroHabito::updateOrCreate(
    //         [
    //             'idUsuario' => $user->idUsuario,
    //             'idHabito'  => $validated['idHabito'],
    //             'fecha'     => now()->toDateString(),
    //         ],
    //         [
    //             'cantidadRealizada' => $validated['valor'],
    //             'cumplido'          => $cumplido,
    //             'comentario'        => $request->input('comentario', null),
    //         ]
    //     );

    //     // 🔥 Actualizar racha individual del hábito
    //     if ($cumplido) {
    //         $ayer = now()->subDay()->toDateString();

    //         if ($habito->fechaUltimoRegistro === $ayer) {
    //             $habito->rachaActual += 1;
    //         } else {
    //             $habito->rachaActual = 1;
    //         }

    //         if ($habito->rachaActual > $habito->rachaMaxima) {
    //             $habito->rachaMaxima = $habito->rachaActual;
    //         }

    //         $habito->fechaUltimoRegistro = now()->toDateString();
    //         $habito->save();
    //     }

    //     return response()->json([
    //         'mensaje' => 'Registro guardado con éxito',
    //         'registro' => $registro,
    //         'cumplido' => $cumplido,
    //         'valorHoy' => $validated['valor'],
    //         'rachaActual' => $habito->rachaActual,
    //         'rachaMaxima' => $habito->rachaMaxima,
    //     ], Response::HTTP_CREATED);
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'idHabito' => 'required|exists:habitos,idHabito',
            'valor' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            'comentario' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $habito = \App\Models\Habito::find($validated['idHabito']);

        $cumplido = $validated['valor'] >= $habito->meta;
        // $hoy = now()->toDateString();

        $tz = 'America/Argentina/Buenos_Aires';
        $hoy  = Carbon::today($tz)->toDateString();
        $ayer = Carbon::yesterday($tz)->toDateString();

        // 🔎 LOGS: antes de calcular racha individual
        Log::info('🧪 Racha - datos de entrada', [
            'idHabito' => $habito->idHabito ?? null,
            'fechaUltimoRegistro_raw' => (string) $habito->fechaUltimoRegistro,
            'fechaUltimoRegistro_date' => $habito->fechaUltimoRegistro ? \Carbon\Carbon::parse($habito->fechaUltimoRegistro)->toDateString() : null,
            'ayer_raw' => $ayer,
            'ayer_date' => \Carbon\Carbon::parse($ayer)->toDateString(),
            'cumplido' => $cumplido,
            'meta' => (float) ($habito->meta ?? 0),
            'valor' => (float) $validated['valor'],
        ]);

        $esAyerEstricto = ($habito->fechaUltimoRegistro === $ayer);
        $esMismoDia = $habito->fechaUltimoRegistro
            ? \Carbon\Carbon::parse($habito->fechaUltimoRegistro)->isSameDay(\Carbon\Carbon::parse($ayer))
            : false;

        Log::info('🧮 Comparaciones de fecha', [
            'igual_estricto' => $esAyerEstricto,
            'isSameDay' => $esMismoDia,
        ]);

        // 💾 Guardar progreso del día
        $registro = \App\Models\RegistroHabito::updateOrCreate(
            [
                'idUsuario' => $user->idUsuario,
                'idHabito'  => $validated['idHabito'],
                'fecha'     => $hoy,
            ],
            [
                'cantidadRealizada' => $validated['valor'],
                'cumplido'          => $cumplido,
                'comentario'        => $request->input('comentario', null),
            ]
        );
        file_put_contents(storage_path('logs/test_racha.txt'), now() . " 🧪 Entró al store, antes del IF (cumplido)\n", FILE_APPEND);
        // 🔥 Actualizar racha
        if ($cumplido) {

            file_put_contents(storage_path('logs/test_racha.txt'), now() . " ✅ Entró en cálculo de racha para el hábito {$habito->idHabito}\n", FILE_APPEND);

            $ayer = now()->subDay()->toDateString();

            // Si ayer fue el último registro, aumentar
            if ($habito->fechaUltimoRegistro === $ayer) {
                file_put_contents(storage_path('logs/test_racha.txt'), "➡️ Mismo día anterior: se suma racha\n", FILE_APPEND);
                $habito->rachaActual += 1;
            } else {
                file_put_contents(storage_path('logs/test_racha.txt'), "🔄 Día distinto: racha reiniciada\n", FILE_APPEND);
                $habito->rachaActual = 1;
            }

            // Actualizar máxima
            if ($habito->rachaActual > $habito->rachaMaxima) {
                $habito->rachaMaxima = $habito->rachaActual;
            }

            file_put_contents(storage_path('logs/test_racha.txt'), "🔥 Racha actual: {$habito->rachaActual}, máxima: {$habito->rachaMaxima}, fecha: {$habito->fechaUltimoRegistro}\n", FILE_APPEND);

            // Guardar fecha de hoy
            $habito->fechaUltimoRegistro = $hoy;
        } else {
            // Si no cumplió, racha vuelve a 0
            $habito->rachaActual = 0;
        }

        $habito->save();

        // 🧮 Verificar si todos los hábitos del usuario están cumplidos hoy


        // Verificar si todos los hábitos del usuario están cumplidos HOY
        $todosCumplidos = true;
        $hoy = Carbon::today('America/Argentina/Buenos_Aires')->toDateString();

        $habitosUsuario = \App\Models\Habito::where('idUsuario', $user->idUsuario)
            ->where('estado', 'activo')
            ->get();

        foreach ($habitosUsuario as $habitoUsuario) {
            $registroHoy = \App\Models\RegistroHabito::where('idHabito', $habitoUsuario->idHabito)
                ->where('idUsuario', $user->idUsuario)
                ->whereDate('fecha', $hoy)
                ->where('cumplido', true)
                ->first();

            if (!$registroHoy) {
                $todosCumplidos = false;
                break;
            }
        }


        $rachaGlobal = \App\Models\RachaGlobal::firstOrCreate(
            ['idUsuario' => $user->idUsuario],
            ['rachaActual' => 0, 'rachaMaxima' => 0]
        );

        if ($todosCumplidos) {
            $tz = 'America/Argentina/Buenos_Aires';
            $hoy = Carbon::today($tz)->toDateString();
            $ayer = Carbon::yesterday($tz)->toDateString();

            if ($rachaGlobal->fechaUltimoCumplimiento === $ayer) {
                $rachaGlobal->rachaActual += 1;
            } else {
                $rachaGlobal->rachaActual = 1;
            }

            if ($rachaGlobal->rachaActual > $rachaGlobal->rachaMaxima) {
                $rachaGlobal->rachaMaxima = $rachaGlobal->rachaActual;
            }

            $rachaGlobal->fechaUltimoCumplimiento = $hoy;
            $rachaGlobal->save();
        } else {

            $tz = 'America/Argentina/Buenos_Aires';
            $hoyDate = Carbon::today($tz);

            // Si no completó todos los hábitos hoy, y ya pasó el día, reiniciamos la racha
            $ultimaFecha = $rachaGlobal->fechaUltimoCumplimiento ? Carbon::parse($rachaGlobal->fechaUltimoCumplimiento, $tz)->startOfDay() : null;



            if ($ultimaFecha && $ultimaFecha->diffInDays($hoyDate) > 1) {
                $rachaGlobal->rachaActual = 0;
                $rachaGlobal->save();
            }
        }
        

        return response()->json([
            'mensaje' => 'Registro guardado con éxito',
            'registro' => $registro,
            'cumplido' => $cumplido,
            'valorHoy' => $validated['valor'],
            'rachaActual' => $habito->rachaActual,
            'rachaMaxima' => $habito->rachaMaxima,
            'todosCumplidos' => $todosCumplidos,
            'rachaGlobalActual' => $rachaGlobal->rachaActual,
            'rachaGlobalMaxima' => $rachaGlobal->rachaMaxima
        ], Response::HTTP_CREATED);
    }

    public function index(Request $request, $idHabito)
    {
        try {
            $user = $request->user();
            $desde = $request->query('desde', Carbon::today()->subDays(6)->toDateString());
            $hasta = $request->query('hasta', Carbon::today()->toDateString());

            $registros = RegistroHabito::where('idUsuario', $user->idUsuario)
                ->where('idHabito', $idHabito)
                ->whereBetween('fecha', [$desde, $hasta])
                ->orderBy('fecha', 'asc')
                ->get(['fecha', 'cumplido']);

            // Normalizamos a 7 días continuos para que el calendario siempre tenga 7 casillas
            $cursor = Carbon::parse($desde);
            $dias = [];
            for ($i = 0; $i < 7; $i++) {
                $f = $cursor->copy()->toDateString();
                $match = $registros->firstWhere('fecha', $f);
                $dias[] = [
                    'fecha' => $f,
                    'cumplido' => $match ? (bool)$match->cumplido : false,
                ];
                $cursor->addDay();
            }

            return response()->json([
                'historial' => $dias,  // [{fecha, cumplido} x 7]
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'mensaje' => 'Error al obtener historial',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function hoy(Request $request, $idHabito)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Usuario no autenticado'], 401);
            }

            $habito = \App\Models\Habito::findOrFail($idHabito);

            // 🔍 Buscar solo el registro del día actual (NO sumarlo)
            $registroHoy = \App\Models\RegistroHabito::where('idHabito', $habito->idHabito)
                ->where('idUsuario', $user->idUsuario)
                ->whereDate('fecha', now()->toDateString())
                ->first();

            return response()->json([
                'meta' => $habito->meta,
                'unidad' => $habito->unidad,
                'valorHoy' => $registroHoy->cantidadRealizada ?? 0,
                'cumplido' => (bool) ($registroHoy->cumplido ?? false),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    // public function registrar(Request $request, $idHabito)
    // {
    //     $request->validate([
    //         'valor' => 'required|numeric|min:0',
    //         'comentario' => 'nullable|string|max:255',
    //     ]);

    //     $user   = $request->user();
    //     $hoy    = now()->toDateString();
    //     $ayer   = now()->subDay()->toDateString();

    //     // 1) Traer hábito del usuario
    //     $habito = Habito::where('idHabito', $idHabito)
    //         ->where('idUsuario', $user->idUsuario)
    //         ->firstOrFail();

    //     $meta = (float) ($habito->meta ?? 0);
    //     $valorNuevo = (float) $request->input('valor', 0);

    //     // 🕐 Definir fecha actual
    //     $hoy = now()->toDateString();

    //     // 2) Buscar registro SOLO del día actual
    //     $registro = RegistroHabito::where('idUsuario', $user->idUsuario)
    //         ->where('idHabito', $habito->idHabito)
    //         ->whereDate('fecha', $hoy)
    //         ->first();

    //     // 3) Si no existe, crear nuevo
    //     if (!$registro) {
    //         $registro = RegistroHabito::create([
    //             'idUsuario' => $user->idUsuario,
    //             'idHabito' => $habito->idHabito,
    //             'fecha' => $hoy,
    //             'cantidadRealizada' => 0,
    //             'cumplido' => false,
    //             'comentario' => null,
    //         ]);
    //     }

    //     // 4) Reemplazar cantidad (NO sumar de días anteriores)
    //     $registro->cantidadRealizada = (float) $valorNuevo;

    //     // 5) Recalcular cumplimiento
    //     $registro->cumplido = $meta > 0 ? ($registro->cantidadRealizada >= $meta) : false;

    //     // 6) Guardar
    //     $registro->comentario = $request->input('comentario', $registro->comentario);
    //     $registro->save();

    //     // 4) Recalcular cumplimiento
    //     $registro->cumplido = $meta > 0 ? ($registro->cantidadRealizada >= $meta) : false;

    //     // 5) Guardar registro
    //     $registro->comentario = $request->input('comentario', $registro->comentario);
    //     $registro->save();

    //     // 6) Actualizar RACHA del hábito si HOY se cumplió
    //     if ($registro->cumplido) {
    //         if ($habito->fechaUltimoRegistro === $ayer) {
    //             $habito->rachaActual = (int) $habito->rachaActual + 1;
    //         } else {
    //             // Si ayer no estuvo cumplido (o nunca hubo), arranca en 1
    //             $habito->rachaActual = 1;
    //         }

    //         if ((int) $habito->rachaActual > (int) $habito->rachaMaxima) {
    //             $habito->rachaMaxima = (int) $habito->rachaActual;
    //         }

    //         $habito->fechaUltimoRegistro = $hoy;
    //         $habito->save();
    //     }
    //     // Si hoy NO se cumplió, no tocamos la racha aquí.
    //     // (La caída de racha se puede manejar al día siguiente si querés.)

    //     // 7) Verificar si el usuario completó TODOS sus hábitos hoy
    //     $todosCompletos = Habito::where('idUsuario', $user->idUsuario)
    //         ->where('estado', 'activo')
    //         ->get()
    //         ->every(function ($h) use ($user, $hoy) {
    //             return RegistroHabito::where('idUsuario', $user->idUsuario)
    //                 ->where('idHabito', $h->idHabito)
    //                 ->whereDate('fecha', $hoy)
    //                 ->where('cumplido', true)
    //                 ->exists();
    //         });

    //     // 8) Actualizar la racha global si corresponde
    //     $rachaGlobal = \App\Models\RachaGlobal::firstOrCreate(
    //         ['idUsuario' => $user->idUsuario],
    //         ['rachaActual' => 0, 'rachaMaxima' => 0]
    //     );

    //     if ($todosCompletos) {
    //         $ayer = now()->subDay()->toDateString();

    //         if ($rachaGlobal->fechaUltimoCumplimiento === $ayer) {
    //             $rachaGlobal->rachaActual += 1;
    //         } else {
    //             $rachaGlobal->rachaActual = 1;
    //         }

    //         if ($rachaGlobal->rachaActual > $rachaGlobal->rachaMaxima) {
    //             $rachaGlobal->rachaMaxima = $rachaGlobal->rachaActual;
    //         }

    //         $rachaGlobal->fechaUltimoCumplimiento = $hoy;
    //         $rachaGlobal->save();
    //     }

    //     // 7) Respuesta para el front (lo que tu UI ya consume)
    //     return response()->json([
    //         'mensaje'      => 'Registro guardado con éxito',
    //         'valorHoy'     => (float) $registro->cantidadRealizada,
    //         'cumplido'     => (bool)  $registro->cumplido,
    //         'rachaActual'  => (int)   $habito->rachaActual,
    //         'rachaMaxima'  => (int)   $habito->rachaMaxima,
    //         'rachaGlobalActual' => $rachaGlobal->rachaActual,
    //         'rachaGlobalMaxima' => $rachaGlobal->rachaMaxima,
    //         'todosCompletos'    => $todosCompletos,
    //     ], Response::HTTP_CREATED);
    // }

    public function registrar(Request $request, $idHabito)
    {


        // return response()->json([
        //     'hoy_carbon'   => Carbon::today()->toDateString(),
        //     'now_carbon'   => Carbon::now()->toDateTimeString(),
        //     'php_default'  => date('Y-m-d H:i:s'),
        // ]);


        $request->validate([
            'valor' => 'required|numeric|min:0',
            'comentario' => 'nullable|string|max:255',
        ]);

        $user = $request->user();
        $hoy = Carbon::today('America/Argentina/Buenos_Aires')->toDateString();
        $ayer = Carbon::yesterday('America/Argentina/Buenos_Aires')->toDateString();


        // 1) Traer hábito del usuario
        $habito = Habito::where('idHabito', $idHabito)
            ->where('idUsuario', $user->idUsuario)
            ->firstOrFail();

        $meta = (float) ($habito->meta ?? 0);
        $valorNuevo = (float) $request->input('valor', 0);

        // 2) Traer registro HOY (si existe)
        $registro = RegistroHabito::where('idUsuario', $user->idUsuario)
            ->where('idHabito', $habito->idHabito)
            ->whereDate('fecha', $hoy)
            ->first();

        // 3) Crear registro si no existe
        if (!$registro) {
            $registro = RegistroHabito::create([
                'idUsuario'            => $user->idUsuario,
                'idHabito'             => $habito->idHabito,
                'fecha'                => $hoy,
                'cantidadRealizada'    => 0,
                'cumplido'             => false,
                'comentario'           => null,
            ]);
        }

        // 4) ACUMULAR progreso
        $registro->cantidadRealizada += $valorNuevo;

        // 5) Recalcular cumplimiento
        $registro->cumplido = $meta > 0
            ? ($registro->cantidadRealizada >= $meta)
            : false;

        $registro->comentario = $request->input('comentario', $registro->comentario);
        $registro->save();

        // 6) Actualizar RACHA si se cumplió HOY
        if ($registro->cumplido) {

                    $tz = 'America/Argentina/Buenos_Aires';
        $hoyDate  = Carbon::today($tz);
        $ayerDate = Carbon::yesterday($tz);

        $ultima = $habito->fechaUltimoRegistro ? Carbon::parse($habito->fechaUltimoRegistro, $tz)->startOfDay() : null;

        if ($ultima && $ultima->equalTo($ayerDate)) {
            $habito->rachaActual += 1;
        } else {
            $habito->rachaActual = 1;
        }

        if ($habito->rachaActual > $habito->rachaMaxima) {
            $habito->rachaMaxima = $habito->rachaActual;
        }

        $habito->fechaUltimoRegistro = $hoyDate->toDateString();
        $habito->save();
        }
        else {
            $tz = 'America/Argentina/Buenos_Aires';
            $ultima = $habito->fechaUltimoRegistro ? Carbon::parse($habito->fechaUltimoRegistro, $tz)->startOfDay() : null;

            if ($ultima && $ultima->lt(Carbon::yesterday($tz))) {
                $habito->rachaActual = 0;
                $habito->save();
            }
        }

        //     if ($habito->fechaUltimoRegistro === $ayer) {
        //         $habito->rachaActual += 1;
        //     } else {
        //         $habito->rachaActual = 1;
        //     }

        //     if ($habito->rachaActual > $habito->rachaMaxima) {
        //         $habito->rachaMaxima = $habito->rachaActual;
        //     }

        //     $habito->fechaUltimoRegistro = $hoy;
        //     $habito->save();
        // }

        // 7) Verificar si TODOS los hábitos están cumplidos HOY
        // 7) Verificar si TODOS los hábitos están cumplidos HOY
        if (!$registro->cumplido) {
            // 👇 Si ESTE hábito no está cumplido, es imposible que estén todos completos
            $todosCompletos = false;

            // Igual necesitamos el objeto para responder al front
            $rachaGlobal = \App\Models\RachaGlobal::firstOrCreate(
                ['idUsuario' => $user->idUsuario],
                ['rachaActual' => 0, 'rachaMaxima' => 0]
            );
        } else {
            // ✅ Solo si este hábito ya está cumplido, tiene sentido revisar todos
            $todosCompletos = Habito::where('idUsuario', $user->idUsuario)
                ->where('estado', 'activo')
                ->get()
                ->every(function ($h) use ($user, $hoy) {
                    return RegistroHabito::where('idUsuario', $user->idUsuario)
                        ->where('idHabito', $h->idHabito)
                        ->whereDate('fecha', $hoy)
                        ->where('cumplido', true)
                        ->exists();
                });

            // 8) Racha Global
            $rachaGlobal = \App\Models\RachaGlobal::firstOrCreate(
                ['idUsuario' => $user->idUsuario],
                ['rachaActual' => 0, 'rachaMaxima' => 0]
            );

            Log::info('💡 todosCompletos evaluado:', [
                'valor' => $todosCompletos,
                'tipo' => gettype($todosCompletos),
            ]);

            if ($todosCompletos) {
                if ($rachaGlobal->fechaUltimoCumplimiento === $ayer) {
                    $rachaGlobal->rachaActual += 1;
                } else {
                    $rachaGlobal->rachaActual = 1;
                }

                if ($rachaGlobal->rachaActual > $rachaGlobal->rachaMaxima) {
                    $rachaGlobal->rachaMaxima = $rachaGlobal->rachaActual;
                }

                $rachaGlobal->fechaUltimoCumplimiento = $hoy;
                $rachaGlobal->save();
            }
        }

        $habitosUsuario = Habito::where('idUsuario', $user->idUsuario)
            ->where('estado', 'activo')
            ->get();

            // 🔥 Excluir hábitos creados HOY → no existían al comenzar el día
$habitosUsuario = $habitosUsuario->filter(function ($h) use ($hoy) {
    return substr($h->created_at, 0, 10) < $hoy;
});
        // 9) Respuesta final
        return response()->json([
            'mensaje' => 'Registro guardado con éxito',

            // DEBUG
            'debugTodosCompletos' => $todosCompletos,
            'debugHabitosUsuario' => $habitosUsuario->pluck('idHabito'),
            'debugCumplidosHoy' => $habitosUsuario->map(function ($h) use ($user, $hoy) {
                return [
                    'idHabito' => $h->idHabito,
                    'cumplidoHoy' => \App\Models\RegistroHabito::where('idUsuario', $user->idUsuario)
                        ->where('idHabito', $h->idHabito)
                        ->whereDate('fecha', $hoy)
                        ->where('cumplido', true)
                        ->exists(),
                ];
            }),

            // Lo que ya tenías
            'valorHoy' => (float) $registro->cantidadRealizada,
            'cumplido' => (bool) $registro->cumplido,
            'rachaActual' => (int) $habito->rachaActual,
            'rachaMaxima' => (int) $habito->rachaMaxima,
            'todosCompletos' => $todosCompletos,
            'rachaGlobalActual' => $rachaGlobal->rachaActual,
            'rachaGlobalMaxima' => $rachaGlobal->rachaMaxima,
            'debugRachaGlobalRaw' => [
                'rachaActual' => $rachaGlobal->rachaActual,
                'fechaUltimoCumplimiento' => $rachaGlobal->fechaUltimoCumplimiento
            ]
        ], Response::HTTP_CREATED);
    }

    public function historial($idHabito)
    {
        try {
            // Traer todos los registros del hábito actual, últimos 7 días
            $registros = \App\Models\RegistroHabito::where('idHabito', $idHabito)
                ->orderBy('fecha', 'desc')
                ->take(7)
                ->get(['fecha', 'cumplido']);

            // Formatear para el frontend
            $historial = $registros->map(function ($r) {
                return [
                    'fecha' => $r->fecha,
                    'cumplido' => (bool)$r->cumplido,
                ];
            });

            return response()->json(['historial' => $historial], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'mensaje' => 'Error al obtener historial.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function rachaGlobalHoy(Request $request)
    {
        $user = $request->user();

               $tz = 'America/Argentina/Buenos_Aires';
        $hoy  = Carbon::today($tz)->startOfDay();
        $ayer = Carbon::yesterday($tz)->startOfDay();

        $racha = \App\Models\RachaGlobal::firstOrCreate(
            ['idUsuario' => $user->idUsuario],
            ['rachaActual' => 0, 'rachaMaxima' => 0]
        );

        if (!$racha->fechaUltimoCumplimiento) {
            return response()->json([
            'rachaActual' => $racha->rachaActual,
            'rachaMaxima' => $racha->rachaMaxima,
            'fechaUltimoCumplimiento' => $racha->fechaUltimoCumplimiento,
            ]);
        }

        $ultima = Carbon::parse($racha->fechaUltimoCumplimiento, $tz)->startOfDay();

        if (!$ultima->equalTo($ayer) && !$ultima->equalTo($hoy)) {
            if ($racha->rachaActual != 0) {
                $racha->rachaActual = 0;
                $racha->save();
            }
        }

        return response()->json([
            'rachaActual' => $racha->rachaActual,
            'rachaMaxima' => $racha->rachaMaxima,
            'fechaUltimoCumplimiento' => $racha->fechaUltimoCumplimiento,
        ]);
    }
}
