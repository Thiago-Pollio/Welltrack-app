<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class UserController extends Controller
{
    // 🟢 Traer usuario logueado
    public function me(Request $request)
    {
         $user = $request->user()->load([
        'insignias.insignia',  // trae historial + datos de la insignia real
    ]);
    
        return response()->json($request->user());
    }

    // 🟡 Actualizar datos del perfil privado
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nombreApellido' => 'nullable|string|max:255',
            'nombreUsuario'  => 'nullable|string|max:255',
            'email'          => 'nullable|email|max:255',
            'fechaNac'       => 'nullable|date',
            'avatar' => 'nullable|string',
        ]);

        $user->update($request->only([
            'nombreApellido',
            'nombreUsuario',
            'email',
            'fechaNac',
            'avatar'
        ]));

        return response()->json($user);
    }

    // 🔵 Subir foto de perfil
    // public function updateAvatar(Request $request)
    // {
    //     $user = $request->user();

    //     $request->validate([
    //         'avatar' => 'required|image|mimes:png,jpg,jpeg,webp|max:2048'
    //     ]);

    //     if ($request->avatarPreset) {
    //         $user->avatar = "/avatars/" . $request->avatarPreset;
    //         $user->save();

    //         return response()->json([
    //             'avatar' => $user->avatar
    //         ]);
    //     }


    //     $path = $request->file('avatar')->store('avatars', 'public');

    //     $user->avatar = "/storage/" . $path;
    //     $user->save();

    //     return response()->json([
    //         'message' => 'Avatar actualizado',
    //         'avatar'  => $user->avatar
    //     ]);
    // }

    public function updateAvatar(Request $request)
{
    $user = $request->user();

    // 👉 1) Si viene un preset (desde la app)
    if ($request->avatarPreset) {
        $user->avatar = $request->avatarPreset; // ej: /avatars/avatar3.png
        $user->save();

        return response()->json([
            "message" => "Avatar actualizado (preset)",
            "avatar" => $user->avatar
        ]);
    }

    // 👉 2) Si viene archivo subido normalmente
    $request->validate([
        'avatar' => 'required|image|mimes:png,jpg,jpeg,webp|max:2048'
    ]);

    $path = $request->file('avatar')->store('avatars', 'public');
    $user->avatar = "/storage/" . $path;
    $user->save();

    return response()->json([
        "message" => "Avatar actualizado",
        "avatar" => $user->avatar
    ]);
}

}
