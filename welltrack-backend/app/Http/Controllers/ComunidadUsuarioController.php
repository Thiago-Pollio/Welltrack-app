<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Post;
use App\Models\PomodoroSesion;
use App\Models\RegistroDiario;
use App\Models\RegistroHabito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ComunidadUsuarioController extends Controller
{
    // Listar usuarios con su insignia
    public function listar()
    {
        return Usuario::select('idUsuario', 'nombreUsuario')
            ->with(['insignias.insignia'])
            ->get();
    }

    // Perfil público de un usuario
    public function perfilPublico($idUsuario)
    {
        return [
            'usuario' => Usuario::with('insignias.insignia')->findOrFail($idUsuario),

            'posts' => Post::where('idUsuario', $idUsuario)
                ->withCount(['likes', 'comentarios'])
                ->latest()
                ->take(5)
                ->get(),

            'racha_habitos' => null,        
            'racha_animo' => null,          
            'racha_pomodoro' => null,       
        ];
    }


    //  Top 5 usuarios más activos (últimos 7 días)
    public function activos()
    {
        return Usuario::select('idUsuario', 'nombreUsuario')
            ->withCount(['posts' => function ($q) {
                $q->where('created_at', '>=', now()->subDays(7));
            }])
            ->orderBy('posts_count', 'desc')
            ->take(5)
            ->get();
    }


    //  Actividad total de la comunidad
    public function actividad()
    {
        return [
            'posts_semana' => Post::where('created_at', '>=', now()->subDays(7))->count(),
            'comentarios_semana' => DB::table('comentarios')->where('created_at', '>=', now()->subDays(7))->count(),
            'likes_semana' => DB::table('likes')->where('created_at', '>=', now()->subDays(7))->count(),
        ];
    }


    //  Leaderboard pomodoros (últimos 7 días)
    public function leaderboardPomodoro()
    {
        return PomodoroSesion::select('idUsuario', DB::raw('COUNT(*) as total'))
            ->where('completado', 1)
            ->where('inicio', '>=', now()->subDays(7))
            ->groupBy('idUsuario')
            ->orderByDesc('total')
            ->take(5)
            ->with('usuario:idUsuario,nombreUsuario')
            ->get();
    }


    //  Estado emocional promedio de la comunidad (últimos 7 días)
    public function estadoEmocional()
    {
        return RegistroDiario::select(
            DB::raw('AVG(nivel_animo) as promedio'),
            DB::raw('COUNT(*) as registros')
        )
        ->where('fecha', '>=', now()->subDays(7))
        ->first();
    }


    //  Rachas de la comunidad (suma total de rachas activas)
    public function rachasGlobales()
    {
        return [
            'habitos' => RegistroHabito::whereDate('fecha', today())->count(),
            'pomodoros' => PomodoroSesion::whereDate('inicio', today())->count(),
            // acá después agregamos racha de registro diario
        ];
    }


    //  Hitos de la comunidad
    public function hitos()
    {
        return [
            'total_posts' => Post::count(),
            'total_usuarios' => Usuario::count(),
            'total_pomodoros' => PomodoroSesion::count(),
        ];
    }
}