// src/pages/RegistroDiario.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import HistorialGraficos from "../components/HistorialGraficos";
import PanelNotas from "../components/PanelNotas";

// IMPORTAMOS LOS ÍCONOS
import { 
  FaSmile, FaRegSmile, FaMeh, FaSadTear, FaAngry, FaFlushed, FaRegTired, 
  FaQuestionCircle, FaGrimace, FaCheckCircle, FaStar, FaHeartBroken,
  FaCloud, FaBrain, FaPalette, FaBan, FaBolt, FaMemory,
  FaBatteryEmpty, FaBatteryQuarter, FaBatteryHalf, FaBatteryThreeQuarters, FaFire,
  FaComments, FaHandsHelping, FaUserSecret, FaExclamationTriangle,
  FaMoon, FaTint // Agregamos Moon y Tint
} from "react-icons/fa";
import { RiMistFill, RiFocus2Line } from "react-icons/ri";
import { MdBlurOn, MdOutlinePsychology } from "react-icons/md";

// =====================================================================
// COMPONENTES AUXILIARES (DEFINIDOS AFUERA PARA EVITAR RE-RENDERS)
// =====================================================================

// 1. Wrapper de Pasos
const PasoWrapper = ({ titulo, contenido, children }) => {
  return (
    <div className="space-y-4 p-1 rounded-3xl">
      <h3 className="text-2xl font-semibold text-gray-800 text-center">
        {titulo}
      </h3>
      <p className="text-gray-500 text-sm text-center">
        Elegí la opción que mejor represente cómo te sentís.
      </p>
      <div className="flex justify-center flex-wrap gap-5 pt-2 mt-3">
        {contenido}
      </div>
      {children}
    </div>
  );
};

// 2. Barra de Progreso
const BarraProgreso = ({ valor, max, color = "emerald" }) => {
  const porcentaje = Math.max(0, Math.min(100, (valor / max) * 100));
  const colorClass =
    color === "blue"
      ? "bg-blue-400"
      : color === "emerald"
      ? "bg-emerald-400"
      : "bg-gray-400";

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`${colorClass} h-3 transition-all`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
};

// 3. Selector de Horas (Lunas)
const HorasSelector = ({ sueno, setSueno }) => {
  return (
    <div className="flex flex-col items-center mt-2">
      <div className="mb-3 text-center">
        <span className="text-3xl font-bold text-indigo-600">{sueno}</span>
        <span className="text-sm text-gray-500 font-medium ml-1">horas</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
        {Array.from({ length: 12 }).map((_, i) => {
          const active = sueno >= i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSueno(i + 1)}
              className={`
                w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                ${active 
                  ? "bg-indigo-50 scale-110 shadow-sm"
                  : "bg-transparent"
                }
              `}
            >
              <FaMoon 
                size={20} 
                className={`transition-colors duration-300 ${
                  active ? "text-yellow-400" : "text-gray-300"
                }`} 
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 4. Selector de Agua (Gotas)
const AguaSelector = ({ aguaTomada, setAguaTomada }) => {
  return (
    <div className="flex flex-col items-center mt-2">
      <div className="mb-3 text-center">
        <span className="text-3xl font-bold text-blue-600">{aguaTomada}</span>
        <span className="text-sm text-gray-500 font-medium ml-1">ml</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
        {Array.from({ length: 10 }).map((_, i) => {
          const value = (i + 1) * 100;
          const active = aguaTomada >= value;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setAguaTomada(value)}
              className={`
                w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                ${active 
                  ? "bg-blue-50 scale-110 shadow-sm"
                  : "bg-transparent"
                }
              `}
            >
              <FaTint 
                size={20} 
                className={`transition-colors duration-300 ${
                  active ? "text-blue-500" : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 5. Tarjeta Final
// 5. Tarjeta Final (Acomodada)
const FinalCard = ({
  estadoAnimo, mente, energia, sueno, aguaTomada, vidaSocial, notaOpcional, estresNivel,
}) => {
  return (
    <div className="animate-fadeIn w-full h-full flex flex-col justify-between">
      
      {/* Encabezado centrado */}
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-bold text-gray-800">¡Registro completo! 🎉</h3>
        <p className="text-gray-500 text-sm">Gracias por compartir cómo te sentiste hoy.</p>
      </div>

      {/* Resumen con scroll por si es muy largo */}
      <div className="flex-1 overflow-y-auto my-4 p-4 rounded-2xl bg-white/60 border border-gray-200/50 text-sm space-y-1.5 custom-scrollbar">
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Ánimo:</strong> 
          <span className="text-gray-800 text-right truncate ml-2 max-w-[60%]">{estadoAnimo.join(", ") || "-"}</span>
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Mente:</strong> 
          <span className="text-gray-800 text-right truncate ml-2 max-w-[60%]">{mente.join(", ") || "-"}</span>
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Energía:</strong> 
          <span className="text-gray-800 text-right truncate ml-2 max-w-[60%]">{energia.join(", ") || "-"}</span>
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Sueño:</strong> 
          <span className="text-gray-800">{sueno} horas</span>
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Agua:</strong> 
          <span className="text-gray-800">{aguaTomada} ml</span>
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Vida social:</strong> 
          <span className="text-gray-800 text-right truncate ml-2 max-w-[60%]">{vidaSocial.join(", ") || "-"}</span>
        </p>
        <p className="flex justify-between border-b border-gray-100 pb-1">
          <strong className="text-gray-600">Estrés:</strong> 
          <span className="font-semibold text-emerald-600">{estresNivel}/10</span>
        </p>
        
        {notaOpcional && (
          <div className="pt-2">
            <strong className="text-gray-600 block text-xs mb-1">Nota:</strong> 
            <p className="italic text-gray-700 bg-white p-2 rounded-lg border border-gray-100">
              "{notaOpcional}"
            </p>
          </div>
        )}
      </div>

      {/* Botón */}
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-900 transition shadow-md"
      >
        Volver al inicio
      </button>
    </div>
  );
};

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================

export default function RegistroDiario() {
  const token = localStorage.getItem("token");
  // const usuario = JSON.parse(localStorage.getItem("usuarioActual")); // No se usa por ahora

  const [estadoAnimo, setEstadoAnimo] = useState([]);
  const [mente, setMente] = useState([]);
  const [energia, setEnergia] = useState([]);
  const [sueno, setSueno] = useState(0);
  const [vidaSocial, setVidaSocial] = useState([]);
  const [aguaTomada, setAguaTomada] = useState(0);
  const [estresNivel, setEstresNivel] = useState(5);
  const [notaOpcional, setNotaOpcional] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [ultimaFecha, setUltimaFecha] = useState(null);
  const [registroOriginal, setRegistroOriginal] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [pasoActual, setPasoActual] = useState(1);
  const [panelAbierto, setPanelAbierto] = useState(false);

  const [usuario, setUsuario] = useState(null);

  // Opciones para los selectores
  const opciones = {
    estadoAnimo: [
      { icon: <FaSmile size={24} className="text-yellow-500" />, texto: "Feliz" },
      { icon: <FaRegSmile size={24} className="text-yellow-400" />, texto: "Bien" },
      { icon: <FaMeh size={24} className="text-gray-400" />, texto: "Indiferente" },
      { icon: <FaSadTear size={24} className="text-blue-400" />, texto: "Triste" },
      { icon: <FaAngry size={24} className="text-red-500" />, texto: "Enojo" },
      { icon: <FaFlushed size={24} className="text-purple-400" />, texto: "Ansiedad" },
      { icon: <FaRegTired size={24} className="text-gray-500" />, texto: "Apática" },
      { icon: <FaQuestionCircle size={24} className="text-blue-300" />, texto: "Insegura" },
      { icon: <FaGrimace size={24} className="text-orange-400" />, texto: "Irritable" },
      { icon: <FaCheckCircle size={24} className="text-green-500" />, texto: "Seguridad" },
      { icon: <FaStar size={24} className="text-yellow-300" />, texto: "Entusiasmo" },
      { icon: <FaHeartBroken size={24} className="text-rose-400" />, texto: "Sensible" },
    ],
    mente: [
      { icon: <FaCloud size={24} className="text-sky-300" />, texto: "Tranquilidad" },
      { icon: <RiMistFill size={24} className="text-gray-400" />, texto: "Niebla mental" },
      { icon: <RiFocus2Line size={24} className="text-blue-500" />, texto: "Concentración" },
      { icon: <MdOutlinePsychology size={24} className="text-red-400" />, texto: "Estrés" },
      { icon: <FaPalette size={24} className="text-pink-400" />, texto: "Creatividad" },
      { icon: <FaBan size={24} className="text-gray-500" />, texto: "Sin motivación" },
      { icon: <FaBolt size={24} className="text-yellow-500" />, texto: "Motivación" },
      { icon: <FaMemory size={24} className="text-indigo-400" />, texto: "Poca memoria" },
      { icon: <MdBlurOn size={24} className="text-gray-400" />, texto: "Distracción" },
    ],
    energia: [
      { icon: <FaBatteryEmpty size={24} className="text-red-500" />, texto: "Agotamiento" },
      { icon: <FaBatteryQuarter size={24} className="text-orange-400" />, texto: "Cansancio" },
      { icon: <FaBatteryHalf size={24} className="text-yellow-400" />, texto: "Ok" },
      { icon: <FaBatteryThreeQuarters size={24} className="text-lime-400" />, texto: "Vitalidad" },
      { icon: <FaFire size={24} className="text-red-500" />, texto: "Alto rendimiento" },
    ],
    vidaSocial: [
      { icon: <FaComments size={24} className="text-blue-400" />, texto: "Sociable" },
      { icon: <FaHandsHelping size={24} className="text-green-500" />, texto: "Apoyo" },
      { icon: <FaUserSecret size={24} className="text-gray-500" />, texto: "Introversión" },
      { icon: <FaExclamationTriangle size={24} className="text-red-500" />, texto: "Conflicto" },
    ],
  };

  const toggleSeleccion = (valor, setValor, listaActual) => {
    if (listaActual.includes(valor)) {
      setValor(listaActual.filter((v) => v !== valor));
    } else {
      setValor([...listaActual, valor]);
    }
  };

  const calcularEstres = () => {
    let nivel = 5;
    if (["Triste", "Ansiedad", "Enojo"].some((e) => estadoAnimo.includes(e))) nivel += 3;
    if (["Indiferente", "Irritable"].some((e) => estadoAnimo.includes(e))) nivel += 1;
    if (["Feliz", "Bien", "Seguridad", "Entusiasmo"].some((e) => estadoAnimo.includes(e))) nivel -= 2;
    if (sueno <= 4) nivel += 3;
    else if (sueno <= 6) nivel += 1;
    else if (sueno >= 8) nivel -= 1;
    if (energia.includes("Muy Baja") || energia.includes("Agotamiento")) nivel += 3;
    else if (energia.includes("Cansancio")) nivel += 1;
    else if (energia.includes("Vitalidad") || energia.includes("Alto Rendimiento")) nivel -= 1;
    return Math.max(0, Math.min(10, nivel));
  };

  useEffect(() => {
    setEstresNivel(calcularEstres());
  }, [estadoAnimo, mente, energia, sueno, aguaTomada, vidaSocial]);

  // Cargar datos
  useEffect(() => {
    if (!token) return;

    const fetchUltimo = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/registro-diario/ultimo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.registro) {
          const r = data.registro;
          const nuevoRegistro = {
            estadoAnimo: r.estadoAnimo ? (Array.isArray(r.estadoAnimo) ? r.estadoAnimo : r.estadoAnimo.split(",")) : [],
            mente: r.mente ? (Array.isArray(r.mente) ? r.mente : r.mente.split(",")) : [],
            energiaNivel: r.energiaNivel ? (Array.isArray(r.energiaNivel) ? r.energiaNivel : r.energiaNivel.split(",")) : [],
            horasSueño: r.horasSueño || 0,
            vidaSocial: r.vidaSocial ? (Array.isArray(r.vidaSocial) ? r.vidaSocial : r.vidaSocial.split(",")) : [],
            aguaTomada: r.aguaTomada || 0,
            estresNivel: r.estresNivel || 5,
            notaOpcional: r.notaOpcional || "",
          };
          setEstadoAnimo(nuevoRegistro.estadoAnimo);
          setMente(nuevoRegistro.mente);
          setEnergia(nuevoRegistro.energiaNivel);
          setSueno(nuevoRegistro.horasSueño);
          setVidaSocial(nuevoRegistro.vidaSocial);
          setAguaTomada(nuevoRegistro.aguaTomada);
          setEstresNivel(nuevoRegistro.estresNivel);
          setNotaOpcional(nuevoRegistro.notaOpcional);
          setUltimaFecha(r.fecha);
          setRegistroOriginal({ ...nuevoRegistro });
        }
      } catch (err) {
        console.error("Error al cargar último registro:", err);
      }
    };

    const fetchHistorial = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/registro-diario", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.registros) setHistorial(data.registros);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      }
    };

    fetchUltimo();
    fetchHistorial();
  }, [token]);

  const hayCambios = () => {
    if (!registroOriginal) return true;
    const originalEstado = Array.isArray(registroOriginal.estadoAnimo) ? registroOriginal.estadoAnimo : (registroOriginal.estadoAnimo ? registroOriginal.estadoAnimo.split(",") : []);
    const originalMente = Array.isArray(registroOriginal.mente) ? registroOriginal.mente : (registroOriginal.mente ? registroOriginal.mente.split(",") : []);
    const originalEnergia = Array.isArray(registroOriginal.energiaNivel) ? registroOriginal.energiaNivel : (registroOriginal.energiaNivel ? registroOriginal.energiaNivel.split(",") : []);
    const originalVida = Array.isArray(registroOriginal.vidaSocial) ? registroOriginal.vidaSocial : (registroOriginal.vidaSocial ? registroOriginal.vidaSocial.split(",") : []);

    return (
      originalEstado.join(",") !== estadoAnimo.join(",") ||
      originalMente.join(",") !== mente.join(",") ||
      originalEnergia.join(",") !== energia.join(",") ||
      sueno !== (registroOriginal.horasSueño || 0) ||
      originalVida.join(",") !== vidaSocial.join(",") ||
      aguaTomada !== (registroOriginal.aguaTomada || 0) ||
      estresNivel !== (registroOriginal.estresNivel || 5) ||
      notaOpcional !== (registroOriginal.notaOpcional || "")
    );
  };

  const handleGuardar = async () => {
    if (!token || !hayCambios()) return;
    const hoyAR = new Date().toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }).split("/").reverse().join("-");
    const registro = {
      fecha: hoyAR,
      estadoAnimo: estadoAnimo.join(","),
      mente: mente.join(","),
      energiaNivel: energia.join(","),
      horasSueño: sueno,
      vidaSocial: vidaSocial.join(","),
      aguaTomada,
      estresNivel,
      notaOpcional,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/registro-diario", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(registro),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.mensaje || "Error al guardar el registro");
        return;
      }
      const data = await res.json();
      setGuardado(true);
      setPasoActual("final");
      setUltimaFecha(registro.fecha);
      setRegistroOriginal({ ...registro });
      setHistorial([registro, ...historial.filter((r) => r.fecha !== registro.fecha)]);
      setTimeout(() => setGuardado(false), 1500);
    } catch (err) {
      console.error("Error al guardar registro:", err);
    }
  };

  const renderOpciones = (tipo, valores, setValores) => (
    <div className="flex flex-wrap gap-2">
      {opciones[tipo].map((op, index) => (
        <button
          key={index}
          type="button"
          onClick={() => toggleSeleccion(op.texto, setValores, valores)}
          className={`flex flex-col items-center p-2 rounded-lg border transition select-none ${
            valores.includes(op.texto) ? "bg-green-300 border-green-500" : "bg-white border-gray-300 hover:bg-green-100"
          }`}
        >
          <span className="mb-1">{op.icon}</span>
          <span className="text-sm">{op.texto}</span>
        </button>
      ))}
    </div>
  );

  const formatoFecha = (fechaISO) => {
    const [y, m, d] = fechaISO.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <><PanelNotas
            abierto={panelAbierto}
            usuario={usuario}
            token={token}
            onToggle={() => setPanelAbierto(!panelAbierto)}
          />
    <Layout>
      <div className="bg-[#F7F5EF] border-b border-[#C2A377]/40 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <h1 className="text-4xl font-bold text-[#121F15]">Registro diario ✨</h1>
          <p className="text-gray-600 mt-1">Contá cómo te sentís hoy completando cada paso.</p>
          {ultimaFecha && <p className="text-xs text-gray-500 mt-1">Último registro: {formatoFecha(ultimaFecha)}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
        <div className="space-y-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          <div className="space-y-9">
            {/* Barra de Pasos */}
            <div className={`rounded-3xl shadow-lg p-5 border border-gray-100
              ${pasoActual === 1 ? "bg-rose-50" : ""}
              ${pasoActual === 2 ? "bg-violet-50" : ""}
              ${pasoActual === 3 ? "bg-amber-50" : ""}
              ${pasoActual === 4 ? "bg-indigo-50" : ""}
              ${pasoActual === 5 ? "bg-sky-50" : ""}
              ${pasoActual === 6 ? "bg-green-50" : ""}
              ${pasoActual === 7 ? "bg-gray-50" : ""}
            `}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Paso {pasoActual}</span>
                <span>7 pasos</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="h-2 bg-emerald-400 transition-all" style={{ width: `${(pasoActual / 7) * 100}%` }} />
              </div>
            </div>

            {/* Contenido del Paso */}
            <div key={pasoActual} className={`animate-slideLeft rounded-3xl shadow-xl border border-gray-100 p-10 h-[420px] relative overflow-hidden flex flex-col justify-center
               ${pasoActual === 1 ? "bg-rose-50" : ""}
               ${pasoActual === 2 ? "bg-violet-50" : ""}
               ${pasoActual === 3 ? "bg-amber-50" : ""}
               ${pasoActual === 4 ? "bg-indigo-50" : ""}
               ${pasoActual === 5 ? "bg-sky-50" : ""}
               ${pasoActual === 6 ? "bg-green-50" : ""}
               ${pasoActual === 7 ? "bg-gray-50" : ""}
            `}>
              {pasoActual === 1 && (
                <PasoWrapper titulo="¿Cómo está tu estado de ánimo hoy?" contenido={renderOpciones("estadoAnimo", estadoAnimo, setEstadoAnimo)} />
              )}
              {pasoActual === 2 && (
                <PasoWrapper titulo="¿Cómo está tu mente?" contenido={renderOpciones("mente", mente, setMente)} />
              )}
              {pasoActual === 3 && (
                <PasoWrapper titulo="¿Qué nivel de energía sentís?" contenido={renderOpciones("energia", energia, setEnergia)} />
              )}
              {pasoActual === 4 && (
                <PasoWrapper titulo="¿Cuántas horas dormiste?">
                  <BarraProgreso valor={sueno} max={12} color="emerald" />
                  <HorasSelector sueno={sueno} setSueno={setSueno} />
                </PasoWrapper>
              )}
              {pasoActual === 5 && (
                <PasoWrapper titulo="¿Cuánta agua tomaste hoy?">
                  <BarraProgreso valor={aguaTomada} max={1000} color="blue" />
                  <AguaSelector aguaTomada={aguaTomada} setAguaTomada={setAguaTomada} />
                </PasoWrapper>
              )}
              {pasoActual === 6 && (
                <PasoWrapper titulo="¿Cómo estuvo tu vida social hoy?" contenido={renderOpciones("vidaSocial", vidaSocial, setVidaSocial)} />
              )}
              
              {/* INPUT CORREGIDO */}
              {pasoActual === 7 && (
                <PasoWrapper titulo="¿Querés agregar una nota opcional?">
                  <input
                    type="text"
                    value={notaOpcional}
                    onChange={(e) => setNotaOpcional(e.target.value)}
                    placeholder="Algo para recordar hoy..."
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-300 outline-none"
                    autoFocus
                  />
                </PasoWrapper>
              )}

              {pasoActual === "final" && (
                <FinalCard
                  estadoAnimo={estadoAnimo}
                  mente={mente}
                  energia={energia}
                  sueno={sueno}
                  aguaTomada={aguaTomada}
                  vidaSocial={vidaSocial}
                  notaOpcional={notaOpcional}
                  estresNivel={estresNivel}
                />
              )}

              {/* Navegación */}
              {pasoActual !== "final" && (
                <div className="pt-6 mt-auto border-t border-gray-100 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setPasoActual((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200 transition"
                  >
                    Anterior
                  </button>
                  {pasoActual < 7 ? (
                    <button
                      type="button"
                      onClick={() => setPasoActual((p) => Math.min(7, p + 1))}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!hayCambios()}
                      onClick={async () => {
                        await handleGuardar();
                      }}
                      className={`px-6 py-2 rounded-xl text-white font-medium transition ${hayCambios() ? "bg-emerald-500 hover:bg-emerald-600" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                      Guardar registro
                    </button>
                  )}
                </div>
              )}
              {guardado && <p className="text-emerald-600 font-semibold text-center mt-3">✔ Registro guardado correctamente</p>}
            </div>
            
            <div className="relative w-full space-y-2">
              {pasoActual !== "final" && (
                <div className="mt-4 p-4 w-full bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-emerald-800 font-semibold text-sm">Estrés estimado: {estresNivel}/10</p>
                    <div className="w-full bg-emerald-200/40 h-1.5 rounded-full mt-1">
                      <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${(estresNivel / 10) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">Basado en sueño, agua, ánimo, mente y energía</p>
                  </div>
                </div>
              )}
            </div>

            {/* Historial Timeline */}
            {historial.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Historial reciente</h3>
                  <span className="text-xs text-gray-400">Últimos 7 días</span>
                </div>
                <ul className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                  {historial.map((r, i) => {
                    return (
                      <li key={i} className="p-5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200 relative">
                        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-emerald-300" />
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center text-xl">📅</div>
                          <div>
                            <p className="font-semibold text-gray-800">{formatoFecha(r.fecha)}</p>
                            <p className="text-xs text-gray-500">Registro del día</p>
                          </div>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700"><FaSmile className="text-yellow-500" /> Ánimo:</p>
                            <div className="flex flex-wrap gap-2">{(r.estadoAnimo?.split(",") || []).map((item, idx) => <span key={idx} className="inline-block px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">{item.trim()}</span>)}</div>
                          </div>
                          <div>
                            <p className="flex items-center mb-3 gap-2 text-sm font-semibold text-gray-700"><FaBrain className="text-purple-500" /> Mente:</p>
                            <div className="flex flex-wrap gap-2">{(r.mente?.split(",") || []).map((item, idx) => <span key={idx} className="inline-block px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700 border border-sky-200">{item.trim()}</span>)}</div>
                          </div>
                          <div>
                            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700"><FaBolt className="text-yellow-500" /> Energía</p>
                            <div className="flex flex-wrap gap-2">{(r.energiaNivel?.split(",") || []).map((item, idx) => <span key={idx} className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200">{item.trim()}</span>)}</div>
                          </div>
                        </div>
                        {r.notaOpcional && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm max-w-[90%] mx-auto">
                            <div className="flex items-center gap-1 mb-1 text-[10px] uppercase font-semibold text-gray-400"><span>📝</span> Nota del día</div>
                            <p className="text-xs text-yellow-800 italic leading-relaxed">{r.notaOpcional}</p>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha (Gráficos) */}
        <div className="space-y-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700">Gráficos de bienestar</h3>
            <HistorialGraficos historial={historial} />
          </div>
        </div>
      </div>
    </Layout>
    </>
  );
}