<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InsigniaLogro;

class InsigniasSeeder extends Seeder
{
    public function run()
    {
        $insignias = [
            ['nivel' => 1,  'titulo' => 'Primer Pomodoro',        'requisito_ciclos' => 1,  'imagen' => 'insignia1.png'],
            ['nivel' => 2,  'titulo' => 'Entrando en ritmo',      'requisito_ciclos' => 3,  'imagen' => 'insignia2.png'],
            ['nivel' => 3,  'titulo' => 'Productivo',             'requisito_ciclos' => 5,  'imagen' => 'insignia3.png'],
            ['nivel' => 4,  'titulo' => 'Constante',              'requisito_ciclos' => 10, 'imagen' => 'insignia4.png'],
            ['nivel' => 5,  'titulo' => 'Foco Sostenido',         'requisito_ciclos' => 15, 'imagen' => 'insignia5.png'],
            ['nivel' => 6,  'titulo' => 'Modo Estudio',           'requisito_ciclos' => 20, 'imagen' => 'insignia6.png'],
            ['nivel' => 7,  'titulo' => 'Máquina del Pomodoro',   'requisito_ciclos' => 30, 'imagen' => 'insignia7.png'],
            ['nivel' => 8,  'titulo' => 'Disciplina Pura',        'requisito_ciclos' => 40, 'imagen' => 'insignia8.png'],
            ['nivel' => 9,  'titulo' => 'Elite del Enfoque',      'requisito_ciclos' => 50, 'imagen' => 'insignia9.png'],
            ['nivel' => 10, 'titulo' => 'Maestro del Tiempo',     'requisito_ciclos' => 75, 'imagen' => 'insignia10.png'],
        ];

        foreach ($insignias as $ins) {
            InsigniaLogro::create(array_merge($ins, [
                'tipo' => 'pomodoro',
                'descripcion' => null
            ]));
        }
    }
}