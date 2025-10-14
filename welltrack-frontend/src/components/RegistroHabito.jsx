import React, { useState, useEffect } from "react";

export default function RegistroHabito({ onClose }) {
  const handleClose = onClose || (() => {});

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [frecuencia, setFrecuencia] = useState("Diario");
  const [meta, setMeta] = useState("");
  const [unidad, setUnidad] = useState("");
  const [guardado, setGuardado] = useState(false);

  // Cargar hábitos existentes
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("habitos")) || [];
    if (data.length > 0) {
      setNombre(data[0].nombre || "");
      setDescripcion(data[0].descripcion || "");
      setFrecuencia(data[0].frecuencia || "Diario");
      setMeta(data[0].meta || "");
      setUnidad(data[0].unidad || "");
    }
  }, []);

  const handleGuardar = () => {
    // Crear hábito
    const idhabito = Date.now().toString();
    const habito = { idhabito, nombre, descripcion, frecuencia, meta, unidad };

    // Guardar hábito en localStorage
    const habitosExistentes = JSON.parse(localStorage.getItem("habitos")) || [];
    localStorage.setItem("habitos", JSON.stringify([...habitosExistentes, habito]));

    // Crear registro inicial para VerHabitosModal
    const registrosExistentes = JSON.parse(localStorage.getItem("registrosHabitos")) || [];
    const registro = {
      idregistrohabito: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      idhabito,
      idusuario: JSON.parse(localStorage.getItem("usuarioActual"))?.nombreUsuario || "anonimo",
      fecha: new Date().toISOString(),
      cantidadrealizada: 0,
      cumplido: false,
      comentario: "",
      meta: meta || 1,
    };
    localStorage.setItem("registrosHabitos", JSON.stringify([...registrosExistentes, registro]));

    setGuardado(true);
    setTimeout(() => {
      setGuardado(false);
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-lg overflow-y-auto max-h-[90vh]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Registro de hábito 🗓️
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre del hábito
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Meditar"
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe brevemente tu hábito..."
              rows={3}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Frecuencia
            </label>
            <select
              value={frecuencia}
              onChange={(e) => setFrecuencia(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option>Diario</option>
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Meta
              </label>
              <input
                type="number"
                min="0"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="Ej: 10"
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Unidad
              </label>
              <input
                type="text"
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                placeholder="Ej: minutos, páginas..."
                className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleGuardar}
            className="w-full bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
          >
            Guardar
          </button>

          {guardado && (
            <p className="text-green-600 font-semibold mt-3 text-center">
              ✅ ¡Hábito guardado correctamente!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
