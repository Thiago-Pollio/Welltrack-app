import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout"; 
import Loader from "../components/Loader";

export default function HabitosPage() {
  const token = localStorage.getItem("token");
  const [habitos, setHabitos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

const [loading, setLoading] = useState(true); 

useEffect(() => {
  const fetchHabitos = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/habitos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.mensaje || "Error al obtener hábitos");
        return;
      }

      const habitosConProgreso = await Promise.all(
        data.registros.map(async (h) => {
          try {
            const resp = await fetch(
              `http://127.0.0.1:8000/api/habitos/${h.idHabito}/hoy`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const prog = await resp.json();
            if (resp.ok) return { ...h, progreso: prog };
            else return { ...h, progreso: null };
          } catch {
            return { ...h, progreso: null };
          }
        })
      );

      setHabitos(habitosConProgreso);
    } catch (err) {
      console.error("Error:", err);
      setMensaje("Hubo un problema con la conexión.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  fetchHabitos();
}, [token]);

  if (!token)
    return (
      <Layout>
        <div className="p-6 text-center text-gray-600">
          <p>Iniciá sesión para ver tus hábitos.</p>
        </div>
      </Layout>
    );

  if (loading) return <Loader loading={true} />;

  return (
    <Layout>
      <div className="flex-grow w-screen min-h-screen bg-gradient-to-b from-green-100 via-white to-green-50 py-14 px-8 flex flex-col items-center">
        <section className="text-center mb-10">
          <h2 className="text-4xl font-bold text-green-700 mb-2">
            Mis Hábitos 🌱
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Seguimiento diario de tus hábitos para construir una rutina más
            saludable y constante.
          </p>

          {habitos.length > 0 &&
            (() => {
              const completados = habitos.filter(
                (h) => h.progreso?.cumplido
              ).length;
              const total = habitos.length;
              const porcentaje = Math.round((completados / total) * 100);

              return (
                <div className="mt-6 bg-white border border-green-100 shadow-sm rounded-2xl py-5 px-8 inline-flex flex-col items-center gap-3">
                  <p className="text-lg text-green-800 font-semibold">
                    {completados} de {total} hábitos completados
                  </p>

                  <div className="w-64 bg-green-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-700"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>

                  <p className="text-sm text-gray-500 italic">
                    Progreso diario: {porcentaje}% 🌞
                  </p>
                </div>
              );
            })()}
        </section>
        {mensaje && (
          <p className="text-center text-red-500 bg-red-50 py-2 px-4 rounded-xl mb-6 shadow-sm">
            {mensaje}
          </p>
        )}
        
        {habitos.length === 0 ? (
          <p className="text-center text-gray-500">No hay hábitos aún. 🌿</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center w-full px-6 md:px-12">
            {habitos.map((h) => {
              const p = h.progreso;
              const valor = p?.valorHoy ?? 0;
              const meta = p?.meta ?? h.meta ?? 0;
              const unidad = p?.unidad ?? h.unidad ?? "";
              const cumplido = p?.cumplido ?? false;
              const progreso =
                meta > 0 ? Math.min((valor / meta) * 100, 100) : 0;

              return (
                <div
                  key={h.idHabito}
                  className="bg-white border border-green-100 p-6 rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.02] transition flex flex-col justify-between w-full max-w-[400px] mx-auto"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-green-700 mb-2">
                      {h.nombre}
                    </h3>
                    {meta > 0 && (
                      <>
                        <div className="w-full bg-green-100 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${
                              cumplido ? "bg-green-600" : "bg-green-400"
                            }`}
                            style={{ width: `${progreso}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {valor}/{meta} {unidad}
                        </p>
                      </>
                    )}
                    <p
                      className={`text-sm mt-2 font-medium ${
                        cumplido ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {cumplido ? "✅ Completado hoy" : "❌ Aún no alcanzado"}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/habitos/${h.idHabito}`)}
                    className="mt-5 bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-xl hover:scale-105 transition font-semibold"
                  >
                    Marcar hoy
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
