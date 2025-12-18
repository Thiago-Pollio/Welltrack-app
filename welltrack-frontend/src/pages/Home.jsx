import { useState, useEffect } from "react";
import Layout from "../components/Layout";

// 1. Agregamos 'Heart' a los imports
import {
  Smile,
  SmilePlus,
  Meh,
  Frown,
  Angry,
  AlertTriangle,
  Moon,
  HelpCircle,
  Ban,
  CheckCircle,
  Sparkles,
  Dumbbell,
  Users,
  Timer,
  Heart,
  BookHeart,
  Brain,
} from "lucide-react";

import { renderToString } from "react-dom/server";

import PanelNotas from "../components/PanelNotas";
import RegistroDiario from "./RegistroDiario";
import Habito from "../components/Habito";
import RegistroHabito from "../components/RegistroHabito";
import { useNavigate } from "react-router-dom";
import MiniCalendario from "../components/MiniCalendario";
import { useEventos } from "../context/EventosContext";

import ins1 from "../assets/insignias/insignia1.png";
import ins2 from "../assets/insignias/insignia2.png";
import ins3 from "../assets/insignias/insignia3.png";
import ins4 from "../assets/insignias/insignia4.png";
import ins5 from "../assets/insignias/insignia5.png";
import TarjetaHabito from "../components/TarjetaHabito";

const IMAGENES_INSIGNIAS = {
  1: ins1,
  2: ins2,
  3: ins3,
  4: ins4,
  5: ins5,
};

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estados de modales (si los usas)
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [abrirRegistroAnimo, setAbrirRegistroAnimo] = useState(false);
  const [abrirHabito, setAbrirHabito] = useState(false);
  const [abrirRegistroHabito, setAbrirRegistroHabito] = useState(false);

  const [registroDiario, setRegistroDiario] = useState([]);
  const { eventos } = useEventos();

  const estadoAnimoToIcon = {
    Feliz: renderToString(<Smile size={18} strokeWidth={2} />),
    Bien: renderToString(<SmilePlus size={18} strokeWidth={2} />),
    Indiferente: renderToString(<Meh size={18} strokeWidth={2} />),
    Triste: renderToString(<Frown size={18} strokeWidth={2} />),
    Enojo: renderToString(<Angry size={18} strokeWidth={2} />),
    Ansiedad: renderToString(<AlertTriangle size={18} strokeWidth={2} />),
    Apática: renderToString(<Moon size={18} strokeWidth={2} />),
    Insegura: renderToString(<HelpCircle size={18} strokeWidth={2} />),
    Irritable: renderToString(<Ban size={18} strokeWidth={2} />),
    Seguridad: renderToString(<CheckCircle size={18} strokeWidth={2} />),
    Entusiasmo: renderToString(<Sparkles size={18} strokeWidth={2} />),
    Sensible: renderToString(<Frown size={18} strokeWidth={2} />),
  };

  const navigate = useNavigate();

  // ---------------------------------------------------------
  // Datos del Dashboard
  // ---------------------------------------------------------

  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [mejorInsignia, setMejorInsignia] = useState(null);

  // 2. AQUI AGREGAMOS EL ESTADO PARA TENDENCIAS
  const [tendencias, setTendencias] = useState([]);

  // Cargar usuario y token local
  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioActual");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setCargando(false);
  }, []);

  // Cargar datos cuando hay token
  useEffect(() => {
    if (!token) return;

    // A. Cargar Resumen Pomodoro
    const cargarResumen = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/home/resumen", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTotalPomodoros(data.totalPomodoros);
        setMejorInsignia(data.mejorInsignia);
      } catch (err) {
        console.error("Error al cargar resumen:", err);
      }
    };

    // B. Cargar Registro Diario
    const cargarRegistroDiario = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/registro-diario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRegistroDiario(data.registros || []);
      } catch (err) {
        console.error(err);
      }
    };

    // C. Cargar Tendencias (NUEVO)
    const cargarTendencias = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/comunidad/tendencias",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setTendencias(data);
      } catch (e) {
        console.error("Error cargando tendencias", e);
      }
    };

    cargarResumen();
    cargarRegistroDiario();
    cargarTendencias(); // <--- Llamamos a la función
  }, [token]);

  // Ordenar registro
  const registroOrdenado = [...registroDiario].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  // 3. CALCULAMOS EL POST DESTACADO
  const postDestacado = tendencias.length > 0 ? tendencias[0] : null;

  // Renderizados condicionales de carga / login
  if (cargando) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)] text-gray-600">
          <p>Cargando...</p>
        </div>
      </Layout>
    );
  }

  if (!usuario || !token) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-600 text-center">
          <h2 className="text-3xl font-semibold mb-2 text-green-700">
            Bienvenido a BienestarApp 🌿
          </h2>
          <p className="text-gray-500">
            Inicia sesión o regístrate para comenzar tu camino de bienestar.
          </p>
        </div>
      </Layout>
    );
  }

  // ==================== RENDER PRINCIPAL ====================
  return (
    <>
    <PanelNotas
        abierto={panelAbierto}
        usuario={usuario}
        token={token}
        onToggle={() => setPanelAbierto(!panelAbierto)}
      />
    <Layout>
      <div className="fixed inset-0 w-full h-full bg-[#F9F7F2] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 justify-center">
          {/* ========================================== */}
          {/* COLUMNA IZQUIERDA                */}
          {/* ========================================== */}
          <div className="flex-1 -translate-y-6 lg:-translate-y-10 ">
            {/* Header */}
            <section
              className="mt-10 mb-12 px-8 py-8 rounded-3xl border border-[#E8DCC9]/40 shadow-sm
              bg-gradient-to-r from-[#F9F7F2]/20 via-[#F1EADE]/70 to-[#E8DCC9]/70 backdrop-blur-sm
              animated-gradient
              text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl font-semibold text-[#5A534A] mb-4 tracking-wide">
                Hola, {usuario.nombreUsuario} 🌿
              </h1>

              <p className="text-[#6E6A63] text-lg max-w-2xl mx-auto leading-relaxed font-light">
                Pequeños momentos de atención pueden transformar tus días.
                <br />
                Hoy podés empezar con uno.
              </p>
            </section>

            {/* Grid Principal Izquierdo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 1. Tarjeta Hábito (Horizontal, ocupa todo el ancho) */}
              <div className="col-span-1 md:col-span-2">
                <TarjetaHabito />
              </div>

              {/* 2. Tarjeta Pomodoro (Estilizada) */}
              <div className="bg-[#F1EADE] border border-[#E8DCC9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden">
                {/* Decoración de fondo */}
                <div className="absolute -top-4 -right-4 opacity-[0.07] pointer-events-none rotate-12">
                  <Timer size={100} className="text-[#57A773]" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="w-6 h-6 text-[#57A773]" />
                    <h3 className="text-xl font-semibold text-[#5A534A]">
                      Tu Pomodoro
                    </h3>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#57A773] tracking-tight">
                        {totalPomodoros}
                      </span>
                      <span className="text-[#7A7266] text-sm font-medium">
                        sesiones
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF]">
                      Mantené tu racha de enfoque.
                    </p>
                  </div>

                  {mejorInsignia ? (
                    <div className="bg-white/40 border border-[#E8DCC9]/60 rounded-xl p-3 flex items-center gap-3 backdrop-blur-sm">
                      <div className="bg-[#F9F7F2] p-1.5 rounded-lg shadow-sm border border-[#E8DCC9]/30">
                        <img
                          src={IMAGENES_INSIGNIAS[mejorInsignia.nivel]}
                          alt="Insignia"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#7A7266] font-bold">
                          Nivel {mejorInsignia.nivel}
                        </p>
                        <p className="text-sm font-semibold text-[#5A534A] leading-tight">
                          {mejorInsignia.titulo}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/40 border border-[#E8DCC9] rounded-xl p-3 text-center">
                      <p className="text-xs text-[#7A7266] italic">
                        Sin insignias aún.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("/pomodoro")}
                  className="mt-5 w-full bg-[#57A773] hover:bg-[#91B088] text-white py-2 rounded-xl transition shadow-sm font-medium relative z-10"
                >
                  Ir al Timer
                </button>
              </div>

              {/* 3. Tarjeta Comunidad (Con Tendencia incluida) */}
              <div className="bg-[#F1EADE] border border-[#E8DCC9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden">
                {/* Decoración de fondo: Usamos Users para mantener la identidad de la sección */}
                <div className="absolute -top-4 -right-4 opacity-[0.07] pointer-events-none -rotate-12">
                  <Users size={100} className="text-[#57A773]" />
                </div>

                <div className="relative z-10 w-full">
                  {/* Header: Vuelve a ser "Comunidad" */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-6 h-6 text-[#57A773]" />
                    <h3 className="text-xl font-semibold text-[#5A534A]">
                      Comunidad
                    </h3>
                  </div>

                  {/* CONTENIDO: Mostramos la Tendencia */}
                  {postDestacado ? (
                    <div>
                      {/* Pequeño subtítulo para dar contexto */}
                      <p className="text-xs text-[#7A7266] mb-2 flex items-center gap-1 font-medium">
                        <span className="text-orange-500 text-sm"></span>{" "}
                        Tendencia de hoy:
                      </p>

                      {/* Tarjeta Glass con el Post */}
                      <div className="bg-white/40 border border-[#E8DCC9]/60 rounded-xl p-4 backdrop-blur-sm shadow-sm relative group">
                        {/* Comillas decorativas */}
                        <span className="absolute top-2 left-2 text-4xl text-[#E8DCC9] font-serif opacity-50 leading-none">
                          “
                        </span>

                        <div className="relative z-10 pl-2">
                          {/* Contenido truncado a 2 líneas para que entre bien */}
                          <p className="text-[#5A534A] text-sm font-medium italic line-clamp-2 mb-2 leading-relaxed">
                            {postDestacado.contenido}
                          </p>

                          {/* Footer del Post */}
                          <div className="flex items-center justify-between border-t border-[#E8DCC9]/40 pt-2 mt-2">
                            <span className="text-xs font-bold text-[#57A773]">
                              @
                              {postDestacado.usuario?.nombreUsuario ||
                                "Anónimo"}
                            </span>

                            <div className="flex items-center gap-1 bg-[#F9F7F2] px-2 py-1 rounded-md border border-[#E8DCC9]/50">
                              <Heart
                                size={12}
                                className="text-red-400"
                                fill="currentColor"
                              />
                              <span className="text-xs font-bold text-[#5A534A]">
                                {postDestacado.likes_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Estado por si no hay tendencias cargadas */
                    <div className="bg-white/40 border border-[#E8DCC9]/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 h-[120px]">
                      <p className="text-[#7A7266] text-sm italic">
                        Conectá con otros usuarios.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate("/comunidad")}
                  className="mt-5 w-full bg-[#57A773] hover:bg-[#91B088] text-white py-2 rounded-xl transition shadow-sm font-medium relative z-10"
                >
                  Ir a la Comunidad
                </button>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* COLUMNA DERECHA                 */}
          {/* ========================================== */}
          <div className="w-full lg:w-[35%] flex flex-col items-center gap-6 ">
            {/* 1. Historial de Registro Diario (Rediseñado) */}
            <div className="bg-[#F1EADE] border border-[#E8DCC9] rounded-2xl shadow-sm p-6 w-full relative overflow-hidden flex flex-col justify-between">
              {/* Decoración de fondo */}
              <div className="absolute -top-6 -right-6 opacity-[0.07] pointer-events-none rotate-12">
                <BookHeart size={120} className="text-[#5A534A]" />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <BookHeart className="w-6 h-6 text-[#57A773]" />
                  <h3 className="text-xl font-semibold text-[#5A534A]">
                    Registro Diario
                  </h3>
                </div>

                {/* Contenido Principal */}
                <div className="min-h-[140px]">
                  {registroDiario.length === 0 ? (
                    // Estado Vacío
                    <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                      <div className="bg-[#E8DCC9]/50 p-3 rounded-full mb-2">
                        <Smile className="w-6 h-6 text-[#7A7266]" />
                      </div>
                      <p className="text-[#7A7266] text-sm">
                        Hoy es un buen día para empezar a registrar cómo te
                        sentís.
                      </p>
                    </div>
                  ) : (
                    // Tarjeta con el Último Registro
                    (() => {
                      const item = registroOrdenado[0]; // el más reciente

                      // SOLUCIÓN FECHA: timeZone: 'UTC' evita que te reste un día
                      const fechaFormateada = new Date(
                        item.fecha
                      ).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      });

                      return (
                        <div className="bg-white/60 border border-[#E8DCC9] rounded-xl p-4 shadow-sm backdrop-blur-sm relative">
                          {/* Cabecera del Registro */}
                          <div className="flex items-center justify-between mb-4 border-b border-[#E8DCC9]/50 pb-2">
                            <span className="text-xs font-bold text-[#7A7266] uppercase tracking-wider capitalize">
                              {fechaFormateada}
                            </span>
                            <span className="text-[10px] bg-[#E8DCC9] text-[#5A534A] px-2 py-0.5 rounded-full font-semibold">
                              Reciente
                            </span>
                          </div>

                          {/* BODY: Icono y Texto juntos, Badges abajo */}
<div className="flex flex-col gap-3">
  
  {/* 1. Línea Superior: Icono + Título alineados */}
  <div className="flex items-center gap-2">
    
    {/* Icono: Le agregamos 'flex' para asegurar que el SVG se comporte bien */}
    <div
      className="flex items-center justify-center flex-shrink-0 text-[#57A773]"
      dangerouslySetInnerHTML={{
        __html: estadoAnimoToIcon[
          item.estadoAnimo.split(",")[0].trim()
        ] || "",
      }}
    />

    {/* Texto del Ánimo: Quitamos leading-none y pt-1 */}
    <p className="font-bold text-[#5A534A] text-lg">
      {item.estadoAnimo}
    </p>
  </div>

  {/* 2. Línea Inferior: Badges de detalles (EN COLUMNA) */}
  {/* Cambiamos 'flex-wrap' por 'flex-col' y 'items-start' */}
  <div className="flex flex-col gap-2 pl-1 items-start">
    {item.horasSueño && (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg border border-indigo-100">
        <Moon size={10} className="stroke-2" />{" "}
        {item.horasSueño}h
      </span>
    )}
    {item.mente && (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100">
        <Brain size={10} className="stroke-2" />{" "}
        {item.mente}
      </span>
    )}
  </div>
</div>

                          {/* Nota (si existe) */}
                          {item.notas && (
                            <div className="mt-4 bg-[#F9F7F2]/80 p-2.5 rounded-lg border border-[#E8DCC9]/30 relative">
                              {/* Decoración pequeña de comillas */}
                              <span className="absolute top-1 left-2 text-[#E8DCC9] text-xl font-serif leading-none">
                                “
                              </span>
                              <p className="text-xs text-[#6E6A63] italic line-clamp-2 pl-3 pt-1">
                                {item.notas}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate("/registro-diario")}
                className="w-full mt-4 bg-[#57A773] hover:bg-[#91B088] text-white py-2 rounded-xl shadow-sm transition-all font-medium relative z-10"
              >
                {registroDiario.length === 0
                  ? "Crear primer registro"
                  : "Nuevo registro"}
              </button>
            </div>

            {/* 2. Calendario / Planner */}
            <div className="bg-[#F1EADE] border border-[#E8DCC9] rounded-2xl shadow-sm p-6 w-full">
              <MiniCalendario eventos={eventos} />
              <button
                onClick={() => navigate("/planner")}
                className="mt-6 w-full bg-[#57A773] hover:bg-[#91B088] text-white py-2 rounded-xl transition shadow-sm"
              >
                Ir al Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}
