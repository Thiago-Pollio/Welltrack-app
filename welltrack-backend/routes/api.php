<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\RegistroDiarioController;
use App\Http\Controllers\HabitoController;
use App\Http\Controllers\RegistroHabitoController;
use App\Models\RegistroDiario;
use App\Http\Controllers\EventoController;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\PomodoroController;
use App\Http\Controllers\PomodoroInsigniaController;
use App\Http\Controllers\InsigniaController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ComunidadUsuarioController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserStatsController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

use Illuminate\Http\Request;

Route::get('/usuario-soap/{email}', function ($email) {
    $options = [
        'location' => 'http://localhost/soap-server.php',
        'uri' => 'http://localhost/soap-server.php'

    ];

    try {
        $client = new SoapClient(null, $options);
        $result = $client->obtenerUsuarioPorEmail($email);
        return response()->json($result);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

//Route::post('/logout', [AuthController::class, 'logout']);

//Route::post('/nota', [NotaController::class, 'store']);

//Route::get('/nota/{idUsuario}', [NotaController::class, 'index']);


Route::get('/afirmacion', [App\Http\Controllers\Api\AfirmacionController::class, 'obtener']);

Route::get('/eventos-google', function () {
    // Calendario público mundial de feriados de Google (formato ICS)
    $url = "https://www.calendarlabs.com/ical-calendar/ics/75/Argentina_Holidays.ics";


    try {
        $response = Http::withHeaders([
            'Accept' => 'text/calendar'
        ])->get($url);

        if ($response->failed() || empty($response->body())) {
            return response()->json([
                'error' => 'Error al obtener datos del calendario',
                'status' => $response->status(),
                'body' => $response->body(),
            ], 500);
        }

        $contenido = $response->body();
        $eventos = [];

        // 🔍 Buscar nombre (SUMMARY) y fecha (DTSTART)
        preg_match_all('/SUMMARY:(.*)\r?\nDTSTART.*:(\d{8})/', $contenido, $matches, PREG_SET_ORDER);

        foreach ($matches as $m) {
            $fecha = substr($m[2], 0, 4) . '-' . substr($m[2], 4, 2) . '-' . substr($m[2], 6, 2);
            $eventos[] = [
                'summary' => trim($m[1]),
                'start' => ['date' => $fecha]
            ];
        }

        return response()->json(['items' => $eventos]);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});


// Route::middleware('auth:sanctum')->group(
//     function () {
//         Route::post('/nota', [NotaController::class, 'store']);
//         Route::get('/nota', [NotaController::class, 'index']);
//         Route::patch('/nota/{id}/destacar', [NotaController::class, 'destacar']);
//         Route::patch('/nota/{id}/archivar', [NotaController::class, 'archivar']);
//         Route::patch('/nota/{id}/restaurar', [NotaController::class, 'restaurar']);
//         Route::delete('/nota/{id}', [NotaController::class, 'destroy']);
//         Route::post('/logout', [AuthController::class, 'logout']);

//         Route::post('/registro-diario', [RegistroDiarioController::class, 'store']);
//         Route::get('/registro-diario', [RegistroDiarioController::class, 'index']);

//         Route::post('/habitos', [HabitoController::class, 'store']);
//         Route::get('/habitos', [HabitoController::class, 'index']);
//         Route::delete('/habitos/{id}', [HabitoController::class, 'destroy']);
//         Route::post('/habitos/{id}/marcar', [HabitoController::class, 'marcarProgreso']);
//         Route::get('/habitos/{id}/historial', [RegistroHabitoController::class, 'historial']);
//         Route::get('/habitos/{id}/hoy', [HabitoController::class, 'hoy']);

//         Route::get('/habitos/{idHabito}/hoy', [RegistroHabitoController::class, 'hoy']);
//         Route::post('/habitos/{idHabito}/registrar', [RegistroHabitoController::class, 'registrar']);

//         Route::post('/registro-habito', [RegistroHabitoController::class, 'store']);
//         Route::get('/registro-habito/{idHabito}', [RegistroHabitoController::class, 'index']);
//         Route::get('/registro-habito/{idHabito}', [RegistroHabitoController::class, 'hoy']);


//         Route::get('/registro-diario/ultimo', [RegistroDiarioController::class, 'ultimo']);

//         Route::get('/eventos', [EventoController::class, 'index']);
//         Route::post('/eventos', [EventoController::class, 'store']);
//         Route::put('/eventos/{id}', [EventoController::class, 'update']);
//         Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);
//     }
// );

Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/usuario', [UserController::class, 'me']);
    Route::put('/usuario', [UserController::class, 'update']);
    Route::post('/usuario/avatar', [UserController::class, 'updateAvatar']);

    Route::get('/usuario/registro-historico', [UserStatsController::class, 'historial7dias']);

    // Estadísticas del usuario
    Route::get('/usuario/stats', [UserStatsController::class, 'stats']);

    // Totales de pomodoro
    Route::get('/usuario/pomodoros', [UserStatsController::class, 'pomodoros']);
    
    
    // 🔐 Autenticación y notas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/nota', [NotaController::class, 'store']);
    Route::get('/nota', [NotaController::class, 'index']);
    Route::patch('/nota/{id}/destacar', [NotaController::class, 'destacar']);
    Route::patch('/nota/{id}/archivar', [NotaController::class, 'archivar']);
    Route::patch('/nota/{id}/restaurar', [NotaController::class, 'restaurar']);
    Route::delete('/nota/{id}', [NotaController::class, 'destroy']);

    // 📅 Registro diario
    Route::post('/registro-diario', [RegistroDiarioController::class, 'store']);
    Route::get('/registro-diario', [RegistroDiarioController::class, 'index']);
    Route::get('/registro-diario/ultimo', [RegistroDiarioController::class, 'ultimo']);

    // 🌱 Hábitos
    Route::get('/habitos', [HabitoController::class, 'index']);
    Route::post('/habitos', [HabitoController::class, 'store']);
    Route::delete('/habitos/{id}', [HabitoController::class, 'destroy']);
    // Route::post('/habitos/{id}/marcar', [HabitoController::class, 'marcarProgreso']);
    Route::get('/habitos/{id}/hoy', [RegistroHabitoController::class, 'hoy']);

    // ✅ Registro de hábitos (progreso diario)
    // Route::get('/registro-habito/{idHabito}/hoy', [RegistroHabitoController::class, 'hoy']);
    // Route::post('/registro-habito', [RegistroHabitoController::class, 'store']);
    // Route::get('/registro-habito/{idHabito}', [RegistroHabitoController::class, 'index']);
    Route::get('/habitos/{id}/historial', [RegistroHabitoController::class, 'historial']);
    Route::post('/habitos/{idHabito}/registrar', [RegistroHabitoController::class, 'registrar']);


    Route::get('/racha-global/hoy', [RegistroHabitoController::class, 'rachaGlobalHoy']);

    // 📅 Eventos
    Route::get('/eventos', [EventoController::class, 'index']);
    Route::post('/eventos', [EventoController::class, 'store']);
    Route::put('/eventos/{id}', [EventoController::class, 'update']);
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    //⏲️ Pomodoro

    Route::get('/pomodoro/historial', [PomodoroController::class, 'historial']);
    Route::put('/pomodoro/{idSesion}/actualizar', [PomodoroController::class, 'actualizar']);
    Route::put('/pomodoro/{idSesion}/finalizar', [PomodoroController::class, 'finalizar']);
    Route::post('/pomodoro/iniciar', [PomodoroController::class, 'iniciar']);

    //⏲️ Pomodoro insignia

    // // Cuando termina el pomodoro
    // Route::post('/pomodoro/{idSesion}/insignia', 
    //     [PomodoroInsigniaController::class, 'registrarInsignia']);

    // Insignia de hoy
    Route::get('/pomodoro/insignia/hoy', 
        [PomodoroInsigniaController::class, 'insigniaHoy']);

    // Todas las insignias del usuario
    Route::get('/pomodoro/insignias', 
        [PomodoroInsigniaController::class, 'historial']);



        Route::post('/insignias/ganar', [InsigniaController::class, 'ganar']);
        Route::get('/insignias/mis-insignias', [InsigniaController::class, 'misInsignias']);

Route::get('/home-info', [InsigniaController::class, 'homeInfo']);

Route::get('/home/resumen', [InsigniaController::class, 'resumenHome']);


    // POSTS
    Route::get('/comunidad/posts', [PostController::class, 'index']);
    Route::post('/comunidad/posts', [PostController::class, 'store']);
    Route::get('/comunidad/posts/{idPost}', [PostController::class, 'show']);

    // Comunidad routes
Route::get('/comunidad/preguntas', [PostController::class, 'preguntas']);

Route::get('/comunidad/tendencias', [PostController::class, 'tendencias']);


    // COMENTARIOS
    Route::post('/comunidad/posts/{idPost}/comentarios', [ComentarioController::class, 'store']);

    // LIKES
    Route::post('/comunidad/posts/{idPost}/like', [LikeController::class, 'toggle']);

    // PERFILES
    Route::get('/comunidad/usuarios', [ComunidadUsuarioController::class, 'listar']);
    Route::get('/comunidad/usuarios/{idUsuario}', [ComunidadUsuarioController::class, 'perfilPublico']);

    Route::get('/comunidad/usuarios-activos', [ComunidadUsuarioController::class, 'activos']);

    // Comunidad - Panel derecho
Route::get('/comunidad/actividad', [ComunidadUsuarioController::class, 'actividad']);
Route::get('/comunidad/leaderboard-pomodoro', [ComunidadUsuarioController::class, 'leaderboardPomodoro']);
Route::get('/comunidad/estado-emocional', [ComunidadUsuarioController::class, 'estadoEmocional']);
Route::get('/comunidad/rachas-globales', [ComunidadUsuarioController::class, 'rachasGlobales']);
Route::get('/comunidad/hitos', [ComunidadUsuarioController::class, 'hitos']);

});
