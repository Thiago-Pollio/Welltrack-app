import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import ins1 from "../assets/insignias/insignia1.png";
import ins2 from "../assets/insignias/insignia2.png";
import ins3 from "../assets/insignias/insignia3.png";
import ins4 from "../assets/insignias/insignia4.png";
import ins5 from "../assets/insignias/insignia5.png";

const IMAGENES_INSIGNIAS = {
  1: ins1,
  2: ins2,
  3: ins3,
  4: ins4,
  5: ins5,
};

export default function HomePomodoroStatus({ token }) {
  const [total, setTotal] = useState(0);
  const [mejorInsignia, setMejorInsignia] = useState(null);

  useEffect(() => {
    if (!token) return;

    const cargar = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/perfil", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        setTotal(data.pomodoros_completados || 0);

        if (data.insignias?.length > 0) {
          const mejor = data.insignias.reduce((max, i) =>
            i.insignia.nivel > max.insignia.nivel ? i : max
          );
          setMejorInsignia(mejor.insignia);
        }

      } catch (e) {
        console.error("Error cargando pomodoro estado:", e);
      }
    };

    cargar();
  }, [token]);

  return (
    <motion.div
      className="bg-white border border-emerald-100 rounded-3xl shadow p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-emerald-700 mb-3">
        Tu progreso Pomodoro ⏱️
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        Completaste <b>{total}</b> Pomodoros 🎉
      </p>

      {mejorInsignia ? (
        <div className="flex items-center gap-3">
          <img
            src={IMAGENES_INSIGNIAS[mejorInsignia.nivel]}
            alt="Mejor insignia"
            className="w-14 h-14"
          />
          <div>
            <p className="font-semibold text-emerald-700">
              {mejorInsignia.titulo}
            </p>
            <p className="text-xs text-gray-500">
              {mejorInsignia.descripcion}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500">
          Todavía no ganaste insignias.
        </p>
      )}
    </motion.div>
  );
}