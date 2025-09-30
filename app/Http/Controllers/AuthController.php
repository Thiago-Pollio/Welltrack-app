<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nombreApellido' => 'required|string|max:150',
            'nombreUsuario' => 'required|string|max:100',
            'email' => 'required|string|email|unique:usuarios,email',
            'password' => 'required|string|min:8',
            'fechaNac' => 'nullable|date',
        ]);

        $user = Usuario::create([
            'nombreApellido'=> $validated['nombreApellido'],
            'nombreUsuario'=> $validated['nombreUsuario'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'fechaNac' => $validated['fechaNac'] ?? null,
        ]);
        return response()->json([
            'mensaje' => 'usuario creado con exito',
            'usuario' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
         'email' => 'required|email',
         'password' => 'required|string',
        ]);

        $user = Usuario::where('email', $validated['email'])->first();

        if (!$user || !
        hash::check($validated['password'],
        $user->password)) {
            return response()->json([
                'mensaje' => 'Credenciales invalidas'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'mensaje' => 'Login exitoso',
            'usuario' => $user,
            'token' => $token
        ], 200);
    }

    public function logout (Request $request)
    {
        $request->user()->
        currentAccessToken()->delete();
        return response()->json([
            'mensaje' => 'Sesión cerrada con éxito'
        ], 200);
    }
}
