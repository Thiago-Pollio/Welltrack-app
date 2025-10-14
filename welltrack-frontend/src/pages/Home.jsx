import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { ChevronRight, ChevronLeft, StickyNote, Smile, Dumbbell, Eye } from "lucide-react";
import RegistroAnimo from "../components/RegistroAnimo";
import RegistroHabito from "../components/RegistroHabito";
import VerHabitosModal from "../components/VerHabitosModal";

export default function Home() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  //const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userKey = usuario ? `notas_${usuario.nombreUsuario}` : null;

  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");
  const [panelAbierto, setPanelAbierto] = useState(false);

  const [abrirRegistroAnimo, setAbrirRegistroAnimo] = useState(false);
  const [abrirRegistroHabito, setAbrirRegistroHabito] = useState(false);
  const [abrirVerHabitos, setAbrirVerHabitos] = useState(false);

  /*useEffect(() => {
    if (isLoggedIn && userKey) {
      const notasGuardadas = JSON.parse(localStorage.getItem(userKey)) || [];
      setNotas(notasGuardadas);
    }
  }, [isLoggedIn, userKey]);*/

  useEffect(() => {
        if (!usuario || !token) return;

      const fetchNotas = async () => {
        try {

      const response = await fetch("http://127.0.0.1:8000/api/nota", {
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`,
          },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.mensaje || "Error al obtener las notas");
        return;
      }

      setNotas(data.notas);
    } catch (error) {
      console.error("Error al cargar notas:", error);
      setMessage("Hubo un problema");
    }
  };

  fetchNotas();
  }, [usuario, token]);

  const agregarNota = async () => {
    if (!nuevaNota.trim() || !token) return;

    try {
    const response = await fetch("http://127.0.0.1:8000/api/nota", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contenido: nuevaNota,
        estadoNota: "activa",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.mensaje || "Error al crear la nota");
      return;
    }

    setNotas([data.nota, ...notas]);
    setNuevaNota("");
  } catch (error) {
    console.error("Error al agregar nota:", error);
    setMessage("Hubo un problema.");
  }
  };

  /*const eliminarNota = (id) => {
    const nuevasNotas = notas.filter((n) => n.id !== id);
    setNotas(nuevasNotas);
    localStorage.setItem(userKey, JSON.stringify(nuevasNotas));
  };*/

  if (!usuario || !token) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-600">
          <h2 className="text-2xl">Bienvenido a BienestarApp 🌿</h2>
          <p className="mt-2">
            Inicia sesión o regístrate para comenzar a usar el planner.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-screen w-screen relative ">
        {/* Botón lateral */}
        <button
          onClick={() => setPanelAbierto(!panelAbierto)}
          className={`absolute top-1/2 transform -translate-y-1/2 z-20 
            bg-white shadow-md border rounded-r-2xl p-2 transition-all duration-300 hover:bg-green-50`}
          style={{
            left: panelAbierto ? "320px" : "0",
          }}
        >
          {panelAbierto ? (
            <ChevronLeft className="text-gray-600" />
          ) : (
            <ChevronRight className="text-gray-600" />
          )}
        </button>

        {/* Panel lateral de notas */}
<div
  className={`fixed top-[80px] left-0 h-full z-50 transition-all duration-500 overflow-y-auto 
  backdrop-blur-lg bg-white/70 border-r border-white/50 shadow-2xl 
  ${panelAbierto ? "w-[340px] opacity-100" : "w-0 opacity-0"}`}
  style={{
    pointerEvents: panelAbierto ? "auto" : "none",
  }}
>
  {panelAbierto && (
    <div className="flex flex-col gap-5 p-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
          <StickyNote className="w-6 h-6 text-green-600" />
          Notas de {usuario.nombreUsuario}
        </h2>
      </div>

      {/* Campo para nueva nota */}
      <div className="flex items-center gap-2 bg-white/60 border border-green-100 rounded-2xl p-2 shadow-sm">
        <input
          type="text"
          value={nuevaNota}
          onChange={(e) => setNuevaNota(e.target.value)}
          placeholder="Escribe algo bonito hoy ✨"
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
        />
        <button
          onClick={agregarNota}
          className="bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-xl text-sm font-medium hover:scale-105 transition"
        >
          +
        </button>
      </div>

      {/* Lista de notas */}
      <div className="flex flex-col gap-3 mt-1">
        {notas.length === 0 ? (
          <p className="text-gray-400 text-sm text-center italic">
            Sin notas aún... 🌱
          </p>
        ) : (
          notas.map((n) => (
            <div
              key={n.id}
              className="group relative p-4 rounded-2xl border border-green-100 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
            >
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {n.contenido}
              </p>
              <button
                onClick={() => eliminarNota(n.id)}
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>


        {/* Contenido principal */}
        <div className="flex-1 p-8 overflow-relative">
          <h2 className="text-4xl font-bold mb-3 text-green-700">
            Hola, {usuario.nombreUsuario} 👋
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Bienvenido a tu espacio de bienestar diario. 🌿 Respira profundo y comencemos.
          </p>

          {/* Tarjetas principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Registrar Ánimo */}
            <div className="bg-gradient-to-br from-green-200 to-green-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <div>
                <Smile className="w-8 h-8 mb-2 text-green-800" />
                <h3 className="text-xl font-semibold text-green-900">Registrar Ánimo</h3>
                <p className="text-green-800/80 text-sm mt-1">
                  Registra tu estado de ánimo diario y observa tus cambios.
                </p>
              </div>
              <button
                onClick={() => setAbrirRegistroAnimo(true)}
                className="mt-4 bg-green-700 text-white py-2 rounded-xl hover:bg-green-800 transition"
              >
                Ver más
              </button>
            </div>

            {/* Registrar Hábito */}
            <div className="bg-gradient-to-br from-blue-200 to-blue-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <div>
                <Dumbbell className="w-8 h-8 mb-2 text-blue-800" />
                <h3 className="text-xl font-semibold text-blue-900">Registrar Hábito</h3>
                <p className="text-blue-800/80 text-sm mt-1">
                  Crea un hábito y regístralo diariamente para mejorar tu rutina.
                </p>
              </div>
              <button
                onClick={() => setAbrirRegistroHabito(true)}
                className="mt-4 bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800 transition"
              >
                Ver más
              </button>
            </div>

            {/* Ver / Marcar Hábito */}
            <div className="bg-gradient-to-br from-purple-200 to-purple-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <div>
                <Eye className="w-8 h-8 mb-2 text-purple-800" />
                <h3 className="text-xl font-semibold text-purple-900">Marcar Hábito</h3>
                <p className="text-purple-800/80 text-sm mt-1">
                  Visualiza tus hábitos y marca los días completados.
                </p>
              </div>
              <button
                onClick={() => setAbrirVerHabitos(true)}
                className="mt-4 bg-purple-700 text-white py-2 rounded-xl hover:bg-purple-800 transition"
              >
                Ver más
              </button>
            </div>

            {/* Tarjeta 4 de relleno */}
            <div className="bg-gradient-to-br from-pink-200 to-pink-400 p-6 rounded-3xl shadow-lg flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl">
              <h3 className="text-xl font-semibold text-pink-900 mb-2">Próximamente ✨</h3>
              <p className="text-pink-800/80 text-sm mb-4">
                Nuevas herramientas de bienestar estarán disponibles pronto.
              </p>
              <button className="bg-pink-700 text-white py-2 rounded-xl hover:bg-pink-800 transition">
                Ver más
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      {abrirRegistroAnimo && (
        <RegistroAnimo onClose={() => setAbrirRegistroAnimo(false)} />
      )}
      {abrirRegistroHabito && (
        <RegistroHabito onClose={() => setAbrirRegistroHabito(false)} />
      )}
      {abrirVerHabitos && (
        <VerHabitosModal onClose={() => setAbrirVerHabitos(false)} />
      )}
    </Layout>
  );
}
