import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function EtiquetaFilter({ filtroEtiqueta, setFiltroEtiqueta }) {
  const [open, setOpen] = useState(false);

  const etiquetas = [
    { value: "todas", label: "Todas" },
    { value: "evento", label: "Evento" },
    { value: "tarea", label: "Tarea" },
    { value: "trabajo", label: "Trabajo" },
    { value: "cumpleaños", label: "Cumpleaños" },
    { value: "personal", label: "Personal" },
  ];

  return (
    <div className="relative w-full mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 flex justify-between items-center 
        bg-[#f3ece1] border border-[#d9cabb] rounded-xl shadow-sm 
        text-gray-700 text-sm font-medium hover:shadow transition-all"
      >
        <span>
          {etiquetas.find((e) => e.value === filtroEtiqueta)?.label || "Todas"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute mt-2 w-full rounded-xl p-2 backdrop-blur-md shadow-lg z-50
          bg-white/60 border border-[#e5d8c5] animate-fadeIn"
        >
          <div className="max-h-40 overflow-y-auto pr-1">
            {etiquetas.map((e) => (
              <div
                key={e.value}
                onClick={() => {
                  setFiltroEtiqueta(e.value);
                  setOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-sm text-gray-700 cursor-pointer
                hover:bg-[#f3ece1] transition"
              >
                {e.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
