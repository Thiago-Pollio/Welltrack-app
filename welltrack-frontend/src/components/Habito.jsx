import { useState } from "react";

export default function Habito({ onClose }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [frecuencia, setFrecuencia] = useState("diario");
  const [meta, setMeta] = useState("");
  const [unidad, setUnidad] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/habitos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          frecuencia,
          meta: meta ? parseInt(meta) : null,
          unidad,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.mensaje || "Error al crear hábito");
      } else {
        alert("Hábito creado con éxito");
        onClose();
      }
    } catch (err) {
      console.error("Error al crear hábito:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500">✖</button>
        <h2 className="text-xl font-bold mb-4">Registrar Hábito</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del hábito"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border p-2 rounded"
          />
          <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} className="border p-2 rounded">
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
          <input
            type="number"
            placeholder="Meta"
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            className="border p-2 rounded"
          />
          <select
  value={unidad}
  onChange={(e) => setUnidad(e.target.value)}
  className="border p-2 rounded"
  required
>
  <option value="">Seleccionar unidad</option>
  <option value="veces">Veces</option>
  <option value="minutos">Minutos</option>
  <option value="horas">Horas</option>
  <option value="pasos">Pasos</option>
  <option value="ml">Mililitros (ml)</option>
  <option value="km">Kilómetros (km)</option>
  <option value="páginas">Páginas</option>
</select>
          <button type="submit" className="bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
