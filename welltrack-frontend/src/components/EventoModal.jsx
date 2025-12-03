import { useState, useEffect } from "react";
import EtiquetaFilter from "./EtiquetaFilter"; 

const etiquetasDisponibles = ["evento", "tarea", "trabajo", "cumpleaños", "personal"];
const coloresDisponibles = ["#F9B5AC", "#FDE49C", "#B5EAD7", "#A7C7E7", "#D7BDE2", "#e3fc9eff"];

export default function EventoModal({ token, evento, onClose, onGuardar, diaSeleccionado }) {
  const [modo, setModo] = useState(evento?.modo || (evento ? "editar" : "nuevo"));

  const [titulo, setTitulo] = useState(evento?.title || "");
  const [descripcion, setDescripcion] = useState(evento?.extendedProps?.descripcion || "");
  const [fechaInicio, setFechaInicio] = useState(evento?.start?.slice(0, 10) || "");
  const [horaInicio, setHoraInicio] = useState(evento?.start ? evento.start.slice(11, 16) : "09:00");
  const [fechaFin, setFechaFin] = useState(evento?.end?.slice(0, 10) || "");
  const [horaFin, setHoraFin] = useState(evento?.end ? evento.end.slice(11, 16) : "10:00");
  const [etiqueta, setEtiqueta] = useState(evento?.extendedProps?.etiqueta || etiquetasDisponibles[0]);
  const [color, setColor] = useState(evento?.extendedProps?.color || coloresDisponibles[0]);

  useEffect(() => {
    if (!evento && diaSeleccionado) {
      const dia = new Date(diaSeleccionado);
      const diaStr = dia.toISOString().slice(0, 10);

      setFechaInicio(diaStr);
      setFechaFin(diaStr);
      setHoraInicio("09:00");
      setHoraFin("10:00");
      setModo("nuevo");
    }
  }, [diaSeleccionado, evento]);

  const guardar = async () => {
    try {
      const inicioISO = `${fechaInicio}T${horaInicio}`;
      const finISO = `${fechaFin}T${horaFin}`;

      const metodo = modo === "editar" ? "PUT" : "POST";
      const url =
        modo === "editar"
          ? `http://127.0.0.1:8000/api/eventos/${evento.idEvento}`
          : `http://127.0.0.1:8000/api/eventos`;

      const res = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          fecha_inicio: inicioISO,
          fecha_fin: finISO,
          etiqueta,
          color,
        }),
      });

      const data = await res.json();
      onGuardar(data.evento);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar evento");
    }
  };

  const eliminar = async () => {
    if (!evento?.idEvento) return;

    if (!confirm("¿Seguro que querés eliminar este evento?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/eventos/${evento.idEvento}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar evento");

      onGuardar({ idEvento: evento.idEvento, eliminar: true });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar evento");
    }
  };

  if (modo === "detalle") {
    const yaPaso = new Date(evento.start) < new Date(new Date().setHours(0, 0, 0, 0));

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-[#F1EADE] rounded-3xl p-6 w-96 shadow-xl border border-[#E8DCC9] text-[#5A534A]">

          <h3 className="text-2xl font-semibold mb-4 text-[#4b433c]">
            Detalles del evento
          </h3>

          <p className="mb-1"><strong>Título:</strong> {evento.title}</p>
          <p className="mb-1"><strong>Descripción:</strong> {evento.extendedProps.descripcion}</p>
          <p className="mb-1"><strong>Inicio:</strong> {new Date(evento.start).toLocaleString()}</p>
          <p className="mb-1"><strong>Fin:</strong> {new Date(evento.end).toLocaleString()}</p>
          <p className="mb-1"><strong>Etiqueta:</strong> {evento.extendedProps.etiqueta}</p>

         <p className="mt-2 text-center">
            <strong>Color:</strong>{" "}
            <span
              className="inline-flex w-4 h-4 rounded-full border align-middle"
              style={{ backgroundColor: evento.extendedProps.color }}
            ></span>
          </p>


          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => !yaPaso && setModo("editar")}
              disabled={yaPaso}
              className={`px-4 py-2 rounded-lg text-white transition
                ${yaPaso ? "bg-gray-400" : "bg-[#6B8F71] hover:bg-[#57775d]"}`}
            >
              Editar
            </button>

            <button
              onClick={() => {
                if (yaPaso) return;
                if (confirm("¿Seguro que querés eliminar este evento?")) {
                  onGuardar({ idEvento: evento.idEvento, eliminar: true });
                  onClose();
                }
              }}
              disabled={yaPaso}
              className={`px-4 py-2 rounded-lg text-white transition
                ${yaPaso ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
            >
              Eliminar
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#E8DCC9] hover:bg-[#dbcdb7] text-[#4b433c]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }


 return (
  <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-50 pt-24">
    <div className="bg-[#F1EADE] rounded-3xl p-5 w-[480px] shadow-xl border border-[#E8DCC9] text-[#5A534A]">

      <h3 className="text-xl font-semibold mb-3 text-[#4b433c]">
        {modo === "nuevo" ? "Nuevo Evento" : "Editar Evento"}
      </h3>

      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full mb-2 border border-[#D6C9B8] rounded-xl px-3 py-1 bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#6B8F71]"
      />

      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full mb-3 border border-[#D6C9B8] rounded-xl px-3 py-1 bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#6B8F71]"
      />

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block mb-0.5 text-xs text-[#5A534A]">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full border border-[#D6C9B8] rounded-xl px-3 py-1 bg-white/60"
          />
        </div>

        <div>
          <label className="block mb-0.5 text-xs text-[#5A534A]">Hora inicio</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full border border-[#D6C9B8] rounded-xl px-3 py-1 bg-white/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block mb-0.5 text-xs text-[#5A534A]">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full border border-[#D6C9B8] rounded-xl px-3 py-1 bg-white/60"
          />
        </div>

        <div>
          <label className="block mb-0.5 text-xs text-[#5A534A]">Hora fin</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full border border-[#D6C9B8] rounded-xl px-3 py-1 bg-white/60"
          />
        </div>
      </div>

      <label className="block mb-0.5 text-xs text-[#5A534A]">Etiqueta</label>

        <EtiquetaFilter
          filtroEtiqueta={etiqueta}
          setFiltroEtiqueta={setEtiqueta}
        />


      <label className="block text-xs mb-1 text-[#5A534A]">Color</label>
      <div className="flex justify-between mb-4">
        {coloresDisponibles.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setColor(c)}
            className={`w-6 h-6 rounded-full border-2 transition
              ${color === c ? "border-[#6B8F71] scale-110" : "border-[#D6C9B8]"}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2">
        {modo === "editar" && (
          <button
            onClick={eliminar}
            className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        )}

        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg bg-[#E8DCC9] hover:bg-[#dbcdb7] text-[#4b433c]"
        >
          Cancelar
        </button>

        <button
          onClick={guardar}
          className="px-3 py-1 rounded-lg bg-[#6B8F71] text-white hover:bg-[#57775d]"
        >
          Guardar
        </button>
      </div>

    </div>
  </div>
);

}
