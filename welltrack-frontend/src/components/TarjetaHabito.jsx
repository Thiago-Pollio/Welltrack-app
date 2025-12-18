import { useEffect, useState } from "react";
import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TarjetaHabito() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [totalHabitos, setTotalHabitos] = useState(0);
  const [completadosHoy, setCompletadosHoy] = useState(0);
  const [progresoGlobal, setProgresoGlobal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHabitos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/habitos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const lista = data.registros || [];

        setTotalHabitos(lista.length);

        if (lista.length === 0) {
          setLoading(false);
          return;
        }

        // Calcular progreso del día
        let countCompletados = 0;

        for (const hab of lista) {
          const respHoy = await fetch(
            `http://127.0.0.1:8000/api/habitos/${hab.idHabito}/hoy`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const infoHoy = await respHoy.json();

          if (infoHoy.cumplido) countCompletados++;
        }

        setCompletadosHoy(countCompletados);

        const porcentaje = Math.round((countCompletados / lista.length) * 100);
        setProgresoGlobal(porcentaje);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    cargarHabitos();
  }, []);

 return (
  <div className="bg-[#F1EADE] border border-[#E8DCC9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      {/* SECCIÓN IZQUIERDA: Título y Datos Generales */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Dumbbell className="w-6 h-6 text-[#57A773]" />
          <h3 className="text-xl font-semibold text-[#5A534A]">Tus hábitos</h3>
        </div>

        {loading ? (
          <p className="text-[#7A7266] text-sm animate-pulse">Cargando progreso...</p>
        ) : totalHabitos === 0 ? (
          <p className="text-[#7A7266] italic text-sm">
            Todavía no tenés hábitos creados.
          </p>
        ) : (
          <div>
            <p className="text-[#6E6A63] text-sm">
              Tenés <strong className="text-[#57A773]">{totalHabitos}</strong> hábitos activos.
            </p>
            <p className="text-[#6E6A63] text-sm mt-1">
              Hoy completaste <strong className="text-[#57A773]">{completadosHoy}</strong>.
            </p>
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: Barra de progreso y Botón (Aprovecha el ancho) */}
      {totalHabitos > 0 && (
        <div className="flex-1 w-full md:max-w-xs flex flex-col justify-center">
          
          <div className="flex justify-between text-xs text-[#7A7266] mb-1">
            <span>Progreso diario</span>
            <span className="font-semibold">{progresoGlobal}%</span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-[#E8DCC9] h-2.5 rounded-full mb-4">
            <div
              className="bg-[#57A773] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progresoGlobal}%` }}
            ></div>
          </div>

          <button
            onClick={() => navigate("/habitosIntegrado")}
            className="w-full bg-[#57A773] hover:bg-[#91B088] text-white py-2 rounded-xl transition text-sm font-medium shadow-sm"
          >
            Ver mis hábitos
          </button>
        </div>
      )}

      {/* Botón alternativo si no hay hábitos (para mantener estructura) */}
      {totalHabitos === 0 && !loading && (
        <div className="md:self-end">
             <button
            onClick={() => navigate("/habitosIntegrado")}
            className="bg-[#57A773] hover:bg-[#91B088] text-white py-2 px-6 rounded-xl transition text-sm font-medium shadow-sm"
          >
            Crear Hábito
          </button>
        </div>
      )}
      
    </div>
  </div>
);
}
