import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";

import { useNavigate } from "react-router-dom";




export default function TarjetaHabito({ setAbrirHabito }) {
  const token = localStorage.getItem("token");

  const [habito, setHabito] = useState(null);
  const [progresoHoy, setProgresoHoy] = useState(0);
  const [racha, setRacha] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ========================
  // Obtener hábitos
  // ========================
  useEffect(() => {
    const cargarHabito = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/habitos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        console.log("DEBUG HABITOS:", data);

        // 🔥 Tus hábitos están dentro de "registros"
        const lista = data.registros || [];

        if (lista.length === 0) {
          setLoading(false);
          return;
        }

        const primer = lista[0]; // TOMAMOS UNO SOLO
        setHabito(primer);

        await cargarProgresoHoy(primer.idHabito);
        await cargarRacha(primer.idHabito);
      } catch (err) {
        console.error("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarHabito();
  }, []);

  // ========================
  // Progreso de hoy
  // ========================
  const cargarProgresoHoy = async (idHabito) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/habitos/${idHabito}/hoy`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    // Tu backend devuelve { valorHoy, cumplido, meta, unidad }
    setProgresoHoy(data.cumplido ? 100 : 0);
  };

  // ========================
  // Racha
  // ========================
  const cargarRacha = async (idHabito) => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/habitos/${idHabito}/historial`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    const historial = data.historial || [];

    let rachaTemp = 0;
    const hoy = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < historial.length; i++) {
      const f = historial[i].fecha;
      const diff =
        (new Date(hoy) - new Date(f)) / (1000 * 60 * 60 * 24);

      if (diff === rachaTemp) {
        rachaTemp++;
      } else break;
    }

    setRacha(rachaTemp);
  };

  // ========================
  // UI
  // ========================
  return (
    <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
      <div>
        <Dumbbell className="w-8 h-8 mb-2 text-blue-800" />
        <h3 className="text-xl font-semibold text-blue-900">Tus hábitos</h3>

        {loading ? (
          <p className="text-blue-800/80 text-sm mt-1">Cargando...</p>
        ) : !habito ? (
          <p className="text-blue-900/80 italic text-sm mt-2">
            Todavía no tenés hábitos creados.
          </p>
        ) : (
          <>
            <p className="text-blue-900 mt-2 text-sm">
              Hábito destacado: <strong>{habito.nombre}</strong>
            </p>

            <p className="text-blue-900 font-medium mt-1 text-sm">
              🔥 Racha actual: {racha} días
            </p>

            <div className="w-full bg-white/40 h-2 rounded-full mt-3">
              <div
                className="bg-blue-700 h-full rounded-full"
                style={{ width: `${progresoHoy}%` }}
              ></div>
            </div>

            <p className="text-xs text-blue-900 mt-1">
              Progreso de hoy: {progresoHoy}%
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => navigate("/habitosIntegrado")}
        className="mt-4 bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800 transition"
      >
        Ver más
      </button>
    </div>
  );
}
