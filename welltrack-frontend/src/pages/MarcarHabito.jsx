import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";

export default function MarcarHabito() {
  const { id } = useParams();
  const idHabito = id;
  const token = localStorage.getItem("token");
  const [habito, setHabito] = useState(null);
  const [valor, setValor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 Cargar info del hábito (progreso, meta, etc.)
  useEffect(() => {
    const obtenerHabito = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/habitos/${idHabito}/hoy`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setHabito(data);
        else console.error("Error cargando hábito:", data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    obtenerHabito();
  }, [idHabito, token]);

  // 💾 Registrar cantidad realizada
  const handleAgregar = async () => {
    if (!valor.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/habitos/${idHabito}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ valor: parseFloat(valor) }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.cumplido ? "🎉 ¡Objetivo cumplido!" : "Progreso actualizado 💪");
        setHabito({
          ...habito,
          valorHoy: data.valorHoy,
          cumplido: data.cumplido,
        });
        setValor("");
      } else {
        setMensaje(data.error || "Error al registrar progreso");
      }
    } catch (err) {
      console.error("Error al registrar:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!habito) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-gray-500 animate-pulse">Cargando hábito...</p>
        </div>
      </Layout>
    );
  }

  const progreso = habito.meta ? (habito.valorHoy / habito.meta) * 100 : 0;
  const color = progreso >= 100 ? "bg-green-500" : "bg-blue-500";

  return (
    <Layout>
      <div className="min-h-[calc(100vh-100px)] flex flex-col justify-between">
        {/* Contenido principal */}
        <main className="flex flex-col items-center justify-center flex-1 px-6">
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-3xl p-8 max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-2">{habito.nombre}</h1>
            <p className="text-gray-600 mb-6">{habito.descripcion || "Sin descripción"}</p>

            <div className="flex flex-col gap-2 mb-6">
              <p className="text-xl font-semibold text-green-800">
                {habito.valorHoy}/{habito.meta} {habito.unidad}
              </p>
              <div className="w-full bg-green-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`${color} h-3 transition-all duration-700`}
                  style={{ width: `${Math.min(progreso, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1 italic">
                {habito.cumplido ? "¡Objetivo cumplido! ✅" : "Todavía no llegaste a la meta 💪"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Cantidad"
                className="flex-1 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
              <button
                onClick={handleAgregar}
                disabled={loading}
                className={`${
                  loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } text-white rounded-xl px-4 py-2 transition font-semibold`}
              >
                {loading ? "Guardando..." : "Agregar"}
              </button>
            </div>

            {mensaje && (
              <p className="mt-4 text-sm font-medium text-green-700 bg-green-100 py-2 rounded-xl">
                {mensaje}
              </p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 py-4">
          © 2025 Welltrack • Cuidate cada día 🌿
        </footer>
      </div>
    </Layout>
  );
}