<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotaController;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

//Route::post('/logout', [AuthController::class, 'logout']);

//Route::post('/nota', [NotaController::class, 'store']);

//Route::get('/nota/{idUsuario}', [NotaController::class, 'index']);

Route::middleware('auth:sanctum')->group(
    function () {
        Route::post('/nota', [NotaController::class, 'store']);
        Route::get('/nota', [NotaController::class, 'index']);
        Route::patch('/nota/{id}/destacar', [NotaController::class, 'destacar']);
        Route::patch('/nota/{id}/archivar', [NotaController::class, 'archivar']);
        Route::patch('/nota/{id}/restaurar', [NotaController::class, 'restaurar']);
        Route::delete('/nota/{id}', [NotaController::class, 'destroy']);
        Route::post('/logout', [AuthController::class, 'logout']);

    }
);

