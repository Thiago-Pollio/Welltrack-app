import React, { useState, useEffect } from "react";

export default function VerHabitosModal({ onClose }) {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("registrosHabitos");
    if (data) {
      setRegistros(JSON.parse(data));
    }
  }, []);

  const handleMarcar = (idregistrohabito, cantidad = 1) => {
    const nuevosRegistros = registros.map((r) => {
      if (r.idregistrohabito === idregistrohabito) {
        const nuevaCantidad = Math.min(
          (r.cantidadrealizada || 0) + cantidad,
          r.meta || 1
        );
        return {
          ...r,
          cantidadrealizada: nuevaCantidad,
          cumplido: nuevaCantidad >= (r.meta || 1),
        };
      }
      return r;
    });

    setRegistros(nuevosRegistros);
    localStorage.setItem("registrosHabitos", JSON.stringify(nuevosRegistros));
  };

  const handleEliminar = (idregistrohabito) => {
    const nuevosRegistros = registros.filter(
      (r) => r.idregistrohabito !== idregistrohabito
    );
    setRegistros(nuevosRegistros);
    localStorage.setItem("registrosHabitos", JSON.stringify(nuevosRegistros));
  };

  const formatoFecha = (fechaISO) => {
    if (!fechaISO) return "-";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-AR");
  };

  if (!registros || registros.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-[90%] text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
          >
            ✖
          </button>
          <p className="text-gray-600">No hay registros de hábitos todavía.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-[95%] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Mis hábitos 🗓️</h2>

        <div className="space-y-4">
          {registros.map((r) => (
            <div
              key={r.idregistrohabito}
              className="border rounded-lg p-3 shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{r.idhabito}</span>
                  <p className="text-sm text-gray-500">{formatoFecha(r.fecha)}</p>
                </div>
                <button
                  onClick={() => handleEliminar(r.idregistrohabito)}
                  className="text-red-500 hover:text-red-700 text-lg"
                  title="Eliminar hábito"
                >
                  🗑️
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <span>
                  Cantidad realizada:{" "}
                  <strong>{r.cantidadrealizada || 0}</strong> / {r.meta || 1}
                </span>
                <button
                  onClick={() => handleMarcar(r.idregistrohabito, 1)}
                  className="bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500 text-sm"
                  disabled={(r.cantidadrealizada || 0) >= (r.meta || 1)}
                >
                  +1
                </button>
              </div>

              <div>
                <span>Cumplido: </span>
                <span
                  className={
                    r.cumplido
                      ? "text-green-600 font-bold"
                      : "text-gray-500 font-medium"
                  }
                >
                  {r.cumplido ? "Sí ✅" : "No ❌"}
                </span>
              </div>

              {r.comentario && (
                <div className="text-gray-600 text-sm italic">
                  “{r.comentario}”
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

