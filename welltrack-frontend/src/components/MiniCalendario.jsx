import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import es from "date-fns/locale/es";

export default function MiniCalendario({ onClick }) {
  const [mesActual, setMesActual] = useState(new Date());
  const [eventos, setEventos] = useState([]);

  // ==== CARGAR EVENTOS ====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const cargarEventos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/eventos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEventos(
          data.map((e) => ({
            title: e.titulo,
            date: e.fecha_inicio,
          }))
        );
      } catch (err) {
        console.log("Error cargando eventos:", err);
      }
    };

    cargarEventos();
  }, []);

  // ==== GENERAR DÍAS DEL MES ====
  const inicio = startOfWeek(startOfMonth(mesActual), { weekStartsOn: 1 });
  const fin = endOfWeek(endOfMonth(mesActual), { weekStartsOn: 1 });
  const dias = eachDayOfInterval({ start: inicio, end: fin });

  const cambiarMes = (dir) => {
    setMesActual(dir === "next" ? addMonths(mesActual, 1) : subMonths(mesActual, 1));
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => cambiarMes("prev")}
          className="text-gray-500 hover:text-gray-700"
        >
          ◀
        </button>
        <h2 className="text-lg font-semibold text-gray-700">
          {format(mesActual, "MMMM yyyy", { locale: es })}
        </h2>
        <button
          onClick={() => cambiarMes("next")}
          className="text-gray-500 hover:text-gray-700"
        >
          ▶
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="font-semibold text-gray-500">
            {d}
          </div>
        ))}

        {dias.map((dia, i) => {
          const tieneEvento = eventos.some(
            (ev) => isSameDay(new Date(ev.date), dia)
          );

          return (
            <div
              key={i}
              onClick={onClick}
              className={`p-2 rounded-lg cursor-pointer transition
              ${
                isSameMonth(dia, mesActual)
                  ? "text-gray-700"
                  : "text-gray-300"
              }
              ${
                tieneEvento
                  ? "bg-green-300 text-green-900 font-bold"
                  : "hover:bg-gray-100"
              }`}
            >
              {format(dia, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
