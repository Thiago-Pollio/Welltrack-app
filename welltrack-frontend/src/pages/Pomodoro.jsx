import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Planta from "../components/Planta";

import ins1 from "../assets/insignias/insignia1.png";
import ins2 from "../assets/insignias/insignia2.png";
import ins3 from "../assets/insignias/insignia3.png";
import ins4 from "../assets/insignias/insignia4.png";
import ins5 from "../assets/insignias/insignia5.png";

const IMAGENES_INSIGNIAS = {
  1: ins1,
  2: ins2,
  3: ins3,
  4: ins4,
  5: ins5,
};

const API_URL = "http://127.0.0.1:8000/api";

// Modos y duraciones por defecto (en minutos)
const DEFAULT_CONFIG = {
  focus: 25,
  short_break: 5,
  long_break: 15,
  cycles: 4,
};

// Info visual por modo
const MODES = {
  focus: {
    id: "focus",
    label: "Foco",
    badge: "🎯 En foco",
    gradient: "from-red-500 to-orange-500",
  },
  short_break: {
    id: "short_break",
    label: "Descanso corto",
    badge: "☕ Break corto",
    gradient: "from-emerald-400 to-teal-500",
  },
  long_break: {
    id: "long_break",
    label: "Descanso largo",
    badge: "🌙 Descanso largo",
    gradient: "from-blue-500 to-indigo-500",
  },
};

// Lista de audios.
const AUDIO_TRACKS = [
  { id: "none", label: "Sin música", src: null },
  {
    id: "lofi1",
    label: "Lofi chill",
    src: "/sounds/lofi1.mp3",
  },
  {
    id: "lofi2",
    label: "Lofi suave",
    src: "/sounds/lofi2.mp3",
  },
  {
    id: "tranquila1",
    label: "Tranquila 1",
    src: "/sounds/Pulsar - The Grey Room _ Density & Time.mp3",
  },
  {
    id: "tranquila2",
    label: "Tranquila 2",
    src: "/sounds/Akatsuki Rising - The Mini Vandals.mp3",
  },
  {
    id: "lofi3",
    label: "Lofi Hip-Hop 1",
    src: "/sounds/On The Flip - The Grey Room _ Density & Time.mp3",
  },
  {
    id: "lofi4",
    label: "Lofi Hip-Hop 2",
    src: "/sounds/Twinkle - The Grey Room _ Density & Time.mp3",
  },
];

const INSIGNIAS = [
  "/Insignias/Planta1.png",
  "/Insignias/Planta2.png",
  "/Insignias/Planta3.png",
  "/Insignias/Planta4.png",
  "/Insignias/Planta5.png",
];

// Sonido de alerta al terminar una fase

const ALERT_SOUND_START = "/sounds/mixkit-service-bell-931.mp3";
const ALERT_SOUND_END = "/sounds/mixkit-racing-countdown-timer-1051.mp3";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroPage() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  const MODOS = {
    clasico: {
      nombre: "Clásico",
      foco: 25,
      corto: 5,
      largo: 15,
      cada: 4,
    },
    suave: {
      nombre: "Suave",
      foco: 15,
      corto: 5,
      largo: 10,
      cada: 4,
    },
    intenso: {
      nombre: "Intenso",
      foco: 50,
      corto: 10,
      largo: 30,
      cada: 2,
    },
    personalizado: {
      nombre: "Personalizado",
      foco: null,
      corto: null,
      largo: null,
      cada: null,
    },
  };

  const [modo, setModo] = useState("clasico");

  const [duracionFoco, setDuracionFoco] = useState(25);
  const [duracionCorto, setDuracionCorto] = useState(5);
  const [duracionLargo, setDuracionLargo] = useState(15);
  const [ciclosTotales, setCiclosTotales] = useState(4);

  const [ciclosCompletados, setCiclosCompletados] = useState(0);

  const [animarInsignia, setAnimarInsignia] = useState(false);

  const [animarNuevaInsignia, setAnimarNuevaInsignia] = useState(false);

  const [insigniasUsuario, setInsigniasUsuario] = useState([]);

  const seleccionarModo = (modo) => {
    setModo(modo);

    if (modo !== "personalizado") {
      setDuracionFoco(MODOS[modo].foco);
      setDuracionCorto(MODOS[modo].corto);
      setDuracionLargo(MODOS[modo].largo);
      setCiclosTotales(MODOS[modo].cada);
    }
  };

  const POMODORO_MODOS = {
    clasico: {
      id: "clasico",
      nombre: "Clásico",
      foco: 25,
      corto: 5,
      largo: 15,
      cada: 4,
    },
    suave: {
      id: "suave",
      nombre: "Suave",
      foco: 15,
      corto: 5,
      largo: 10,
      cada: 4,
    },
    intenso: {
      id: "intenso",
      nombre: "Intenso",
      foco: 50,
      corto: 10,
      largo: 30,
      cada: 2,
    },
    personalizado: {
      id: "personalizado",
      nombre: "Personalizado",
      foco: null,
      corto: null,
      largo: null,
      cada: null,
    },
  };

  const [pmFoco, setPmFoco] = useState(POMODORO_MODOS.clasico.foco);
  const [pmCorto, setPmCorto] = useState(POMODORO_MODOS.clasico.corto);
  const [pmLargo, setPmLargo] = useState(POMODORO_MODOS.clasico.largo);
  const [pmCiclos, setPmCiclos] = useState(POMODORO_MODOS.clasico.cada);

  const [modoPomodoro, setModoPomodoro] = useState("clasico");

  const [faseTerminada, setFaseTerminada] = useState(false);

  const [faseManejada, setFaseManejada] = useState(false);

  const seleccionarModoPomodoro = (id) => {
    setModoPomodoro(id);
    const m = POMODORO_MODOS[id];

    // Si no es personalizado, aplicar presets
    if (id !== "personalizado") {
      setPmFoco(m.foco);
      setPmCorto(m.corto);
      setPmLargo(m.largo);
      setPmCiclos(m.cada);

      // Actualizar configuracion del timer
      setConfig((prev) => ({
        ...prev,
        focusMinutes: m.foco,
        shortBreakMinutes: m.corto,
        longBreakMinutes: m.largo,
        totalCycles: m.cada,
      }));

      // Reiniciar duración en pantalla
      setMode("focus");
      setSecondsLeft(m.foco * 60);
    }
  };

  // Config del usuario
  const [config, setConfig] = useState({
    focusMinutes: DEFAULT_CONFIG.focus,
    shortBreakMinutes: DEFAULT_CONFIG.short_break,
    longBreakMinutes: DEFAULT_CONFIG.long_break,
    totalCycles: DEFAULT_CONFIG.cycles,
    audioSeleccionado: "none",
    volumen: 70,
  });

  // Estado del timer
  const [mode, setMode] = useState("focus"); // "focus" | "short_break" | "long_break"
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_CONFIG.focus * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeFlash, setMensajeFlash] = useState("");

  // Historial simple
  const [historial, setHistorial] = useState({
    totalFoco: 0,
    totalSesiones: 0,
    sesiones: [],
  });

  // Audio refs
  const audioRef = useRef(null);

  const previewRef = useRef(null);

  const playPreview = (src) => {
    if (!src) return;

    if (!previewRef.current) previewRef.current = new Audio();

    const preview = previewRef.current;
    preview.src = src;
    preview.volume = 0.6;
    preview.play();

    // Vista previa dura 2 segundos
    setTimeout(() => preview.pause(), 2000);
  };

  // Helpers de duración por modo
  const getModeDurationSeconds = (modeId) => {
    if (modeId === "focus") return config.focusMinutes * 60;
    if (modeId === "short_break") return config.shortBreakMinutes * 60;
    if (modeId === "long_break") return config.longBreakMinutes * 60;
    return config.focusMinutes * 60;
  };

  const getBackendFaseFromMode = (modeId) => {
    if (modeId === "focus") return "foco";
    if (modeId === "short_break") return "descanso_corto";
    if (modeId === "long_break") return "descanso_largo";
    return "foco";
  };

  // ======================
  // Música de fondo
  // ======================

  // Fade-in suave (0 → volumenFinal)
  const fadeIn = (audio, volumenFinal, duration = 800) => {
    audio.volume = 0;
    audio.play().catch(() => {});

    const steps = 20;
    const stepTime = duration / steps;
    let v = 0;

    const interval = setInterval(() => {
      v += volumenFinal / steps;
      audio.volume = Math.min(v, volumenFinal);
      if (v >= volumenFinal) clearInterval(interval);
    }, stepTime);
  };

  // Fade-out suave (volumen actual → 0)
  const fadeOut = (audio, duration = 700) => {
    if (!audio || audio.paused) return;

    const steps = 20;
    const stepTime = duration / steps;
    const initial = audio.volume;
    let v = initial;

    const interval = setInterval(() => {
      v -= initial / steps;
      audio.volume = Math.max(v, 0);
      if (v <= 0) {
        clearInterval(interval);
        audio.pause();
      }
    }, stepTime);
  };
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const selected = AUDIO_TRACKS.find(
      (a) => a.id === config.audioSeleccionado
    );

    if (!selected || !selected.src) {
      audioRef.current.pause();
      audioRef.current.src = "";
      return;
    }

    if (audioRef.current.src !== selected.src) {
      audioRef.current.src = selected.src;
    }

    audioRef.current.loop = true;

    if (isRunning) {
      audioRef.current
        .play()
        .catch(() => console.warn("No se pudo reproducir audio"));
    } else {
      audioRef.current.pause();
    }
  }, [config.audioSeleccionado, isRunning]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (config.volumen || 70) / 100;
    }
  }, [config.volumen]);

  // ======================
  // Lógica del timer
  // ======================
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Va a llegar a 0 → fase completada
          handlePhaseFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, secondsLeft]);

  // Manejo de fin de fase
  const handlePhaseFinished = async () => {
    setIsRunning(false);

    // Sonido de fin de fase
    try {
      const endSound = new Audio(ALERT_SOUND_END);
      endSound.volume = 0.5;
      endSound.play();
    } catch (e) {
      console.warn("No se pudo reproducir sonido de fin de fase");
    }

    // Duración planificada de esta fase
    const planned = getModeDurationSeconds(mode);

    // Avisar al backend que terminó esta fase
    if (sessionId && token) {
      try {
        await fetch(`${API_URL}/pomodoro/${sessionId}/actualizar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fase: getBackendFaseFromMode(mode),
            cicloActual: currentCycle,
            duracionReal: planned,
          }),
        });
      } catch (err) {
        console.error("Error al actualizar sesión:", err);
      }
    }

    // ================================
    //  LÓGICA SEGÚN LA FASE ACTUAL
    // ================================
    if (mode === "focus") {
      const nextCycle = currentCycle + 1;

      // usa el ciclo actual
      // Ej: currentCycle = 1 → completaste 1 foco
      const ciclosVisuales = Math.min(currentCycle, 5);
      setCiclosCompletados(ciclosVisuales);

      setAnimarInsignia(true);
      setTimeout(() => setAnimarInsignia(false), 400);

      // ¿Se completaron todos los ciclos?
      if (nextCycle > config.totalCycles) {
        setMensajeFlash("🎉 ¡Completaste todos los ciclos!");
        setTimeout(() => setMensajeFlash(""), 3000);

        // Finalizar sesión en backend
        if (sessionId && token) {
          try {
            const resFinal = await fetch(
              `${API_URL}/pomodoro/${sessionId}/finalizar`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ duracionReal: planned }),
              }
            );

            const data = await resFinal.json();

            if (data.nuevaInsignia) {
              setAnimarNuevaInsignia(true);
              setTimeout(() => setAnimarNuevaInsignia(false), 800);
            }

            // Registrar insignia
            try {
              await fetch(`${API_URL}/insignias/ganar`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
              });
            } catch (e) {
              console.error("No se pudo registrar la insignia:", e);
            }
          } catch (err) {
            console.error("Error al finalizar sesión:", err);
          }
        }

        // Pasar a descanso largo como cierre (sin auto-start)
        setMode("long_break");
        setSecondsLeft(getModeDurationSeconds("long_break"));
        setCurrentCycle(config.totalCycles);
        return;
      }

      //Todavía quedan ciclos → vamos a descanso corto y auto-iniciamos
      setMode("short_break");
      setSecondsLeft(getModeDurationSeconds("short_break"));
      setCurrentCycle(nextCycle);

      setTimeout(() => setIsRunning(true), 600);
    } else {
      // =========================
      // descanso
      // =========================
      // Vuelve a foco y auto-inicia
      setMode("focus");
      setSecondsLeft(getModeDurationSeconds("focus"));

      setTimeout(() => setIsRunning(true), 300);
    }
  };

  // ======================
  // Backend: iniciar sesión
  // ======================
  const iniciarSesionBackend = async (modoInicial) => {
    if (!token) return null;
    try {
      const fase = getBackendFaseFromMode(modoInicial);
      const duracionFase = getModeDurationSeconds(modoInicial); // en segundos

      const res = await fetch(`${API_URL}/pomodoro/iniciar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modo: modoPomodoro,
          fase,
          duracionFase,
          ciclosTotales: config.totalCycles,
          audioSeleccionado: config.audioSeleccionado,
          volumen: config.volumen,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.mensaje || data.error || "Error al iniciar sesión Pomodoro"
        );
      }

      return data.idSesion;
    } catch (err) {
      console.error(err);
      setMensajeError(err.message);
      return null;
    }
  };

  // ======================
  // Iniciar / Pausar / Reiniciar
  // ======================
  const handleStart = async () => {
    setMensajeError("");

    // Si todavía no hay sesión en backend → crear una
    let id = sessionId;
    if (!id) {
      setIsLoading(true);
      id = await iniciarSesionBackend(mode);
      setIsLoading(false);
      if (!id) return;
      setSessionId(id);
    }

    try {
      const startSound = new Audio(ALERT_SOUND_START);
      startSound.volume = 0.5;
      startSound.play();
    } catch (e) {
      console.warn("No se pudo reproducir sonido de inicio");
    }

    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionId(null);
    setCurrentCycle(1);
    setSecondsLeft(getModeDurationSeconds("focus"));
    setMode("focus");
    setCiclosCompletados(0);
  };

  const handleChangeMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(getModeDurationSeconds(newMode));
    setIsRunning(false);
  };

  // ======================
  // Cambios de configuración
  // ======================
  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyConfig = () => {
    // Recalcular segundos según modo actual
    setSecondsLeft(getModeDurationSeconds(mode));
    setMensajeFlash("✅ Configuración aplicada");
    setTimeout(() => setMensajeFlash(""), 2000);
  };

  // ======================
  // Historial (últimos 7 días)
  // ======================
  const fetchHistorial = async () => {
    if (!token) return;
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      const desdeDate = new Date();
      desdeDate.setDate(desdeDate.getDate() - 7);
      const desde = desdeDate.toISOString().slice(0, 10);

      const res = await fetch(
        `${API_URL}/pomodoro/historial?desde=${desde}&hasta=${hoy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al cargar historial");
      setHistorial(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsigniasUsuario = async () => {
    try {
      const res = await fetch(`${API_URL}/insignias/mis-insignias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return;

      setInsigniasUsuario(data.insignias || []);
    } catch (err) {
      console.error("Error al cargar insignias:", err);
    }
  };

  useEffect(() => {
    fetchInsigniasUsuario();
  }, [token]);

  useEffect(() => {
    fetchHistorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ======================
  // Datos derivados
  // ======================
  const totalSecondsCurrent = getModeDurationSeconds(mode);
  const progress =
    totalSecondsCurrent > 0
      ? ((totalSecondsCurrent - secondsLeft) / totalSecondsCurrent) * 100
      : 0;

  const currentModeInfo = MODES[mode];

  // ======================
  // DEFINICIÓN DE PALETA (Para uso interno en este archivo)
  // ======================
  const COLORES = {
    fondoPagina: "#F7F5EF",
    textoTitulo: "#121F15",
    textoSubtitulo: "#866b46",
    textoOscuro: "#463b20",
    bordeSuave: "#dfd4b9",

    // Acciones
    primario: "#58a774", // Jungle Green
    primarioHover: "#46865d",
    secundario: "#719966", // Muted Teal
    alerta: "#b38d4d", // Gold Earth (Para pausa)

    // Fondos
    bgCard: "#ffffff",
    bgInput: "#ffffff",
    bgActiveNav: "#eef6f1",

    // UI Elements
    focusRing: "#bcdcc7",
  };

  // ======================
  // UI
  // ======================
  if (!token) {
    return (
      <Layout>
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: COLORES.fondoPagina }}
        >
          <p style={{ color: COLORES.textoSubtitulo }}>
            Necesitás iniciar sesión para usar el Pomodoro.
          </p>
        </div>
      </Layout>
    );
  }

  //if (loading) return <Loader loading={true} />;

  return (
    <Layout>
      <div
        className="min-h-screen w-dvw flex flex-col items-center py-10 px-4 md:px-8"
        style={{ backgroundColor: COLORES.fondoPagina }}
      >
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          {/* 🎯 Panel principal */}
          <motion.section
            className="flex-1 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col items-center border"
            style={{
              backgroundColor: COLORES.bgCard,
              borderColor: COLORES.bordeSuave,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-full flex justify-between items-center mb-4">
              <h1
                className="text-2xl md:text-3xl font-bold"
                style={{ color: COLORES.textoTitulo }}
              >
                Pomodoro ⏱️
              </h1>
              {currentModeInfo && (
                <span
                  className="text-xs md:text-sm px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: COLORES.bgActiveNav,
                    borderColor: COLORES.focusRing,
                    color: COLORES.primario,
                  }}
                >
                  {currentModeInfo.badge}
                </span>
              )}
            </div>

            {/* Selector de modo */}
            <div className="flex gap-2 mb-6">
              {Object.values(MODES).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleChangeMode(m.id)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium border transition"
                  style={{
                    backgroundColor:
                      mode === m.id ? COLORES.primario : "transparent",
                    color: mode === m.id ? "#ffffff" : COLORES.primario,
                    borderColor:
                      mode === m.id ? COLORES.primario : COLORES.bordeSuave,
                    opacity: isRunning && mode !== m.id ? 0.5 : 1,
                  }}
                  disabled={isRunning}
                  title={
                    isRunning
                      ? "Pausá el temporizador para cambiar de modo"
                      : ""
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Opciones PERSONALIZADO */}
            {modoPomodoro === "personalizado" && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Foco */}
                <input
                  type="number"
                  className="border p-2 rounded focus:outline-none focus:ring-1"
                  style={{
                    borderColor: COLORES.bordeSuave,
                    color: COLORES.textoOscuro,
                    "--tw-ring-color": COLORES.primario,
                  }}
                  placeholder="Minutos de foco"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPmFoco(v);

                    setConfig((prev) => ({
                      ...prev,
                      focusMinutes: v,
                    }));

                    if (mode === "focus") setSecondsLeft(v * 60);
                  }}
                />

                {/* Pausa corta */}
                <input
                  type="number"
                  className="border p-2 rounded focus:outline-none focus:ring-1"
                  style={{
                    borderColor: COLORES.bordeSuave,
                    color: COLORES.textoOscuro,
                    "--tw-ring-color": COLORES.primario,
                  }}
                  placeholder="Pausa corta"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPmCorto(v);

                    setConfig((prev) => ({
                      ...prev,
                      shortBreakMinutes: v,
                    }));

                    if (mode === "short_break") setSecondsLeft(v * 60);
                  }}
                />

                {/* Pausa larga */}
                <input
                  type="number"
                  className="border p-2 rounded focus:outline-none focus:ring-1"
                  style={{
                    borderColor: COLORES.bordeSuave,
                    color: COLORES.textoOscuro,
                    "--tw-ring-color": COLORES.primario,
                  }}
                  placeholder="Pausa larga"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPmLargo(v);

                    setConfig((prev) => ({
                      ...prev,
                      longBreakMinutes: v,
                    }));

                    if (mode === "long_break") setSecondsLeft(v * 60);
                  }}
                />

                {/* Ciclos */}
                <input
                  type="number"
                  className="border p-2 rounded focus:outline-none focus:ring-1"
                  style={{
                    borderColor: COLORES.bordeSuave,
                    color: COLORES.textoOscuro,
                    "--tw-ring-color": COLORES.primario,
                  }}
                  placeholder="Ciclos totales"
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPmCiclos(v);

                    setConfig((prev) => ({
                      ...prev,
                      totalCycles: v,
                    }));
                  }}
                />
              </div>
            )}

            {/* Indicador visual con plantas */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`
        w-20 h-20 rounded-full border-2 flex items-center justify-center
        transition-all duration-300
        ${animarInsignia && ciclosCompletados - 1 === i ? "insignia-pop" : ""}
      `}
                  style={{
                    borderColor:
                      ciclosCompletados > i
                        ? COLORES.primario
                        : COLORES.bordeSuave,
                    backgroundColor:
                      ciclosCompletados > i
                        ? COLORES.bgActiveNav
                        : "rgba(255,255,255,0.6)",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={INSIGNIAS[i]}
                    alt={`Insignia nivel ${i + 1}`}
                    className={`
          w-16 h-16 object-contain transition-all duration-300
          ${
            ciclosCompletados > i
              ? "opacity-100 scale-100"
              : "opacity-40 scale-90"
          }
        `}
                  />
                </div>
              ))}
            </div>

            {/* Timer */}
            <motion.div
              className="relative w-56 h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-xl mb-6"
              style={{
                background: `linear-gradient(135deg, ${COLORES.bgActiveNav} 0%, ${COLORES.bordeSuave} 100%)`,
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div
                className="w-44 h-44 md:w-52 md:h-52 rounded-full flex flex-col items-center justify-center shadow-inner"
                style={{ backgroundColor: "#ffffff" }}
              >
                <p
                  className="text-4xl md:text-5xl font-mono"
                  style={{ color: COLORES.textoTitulo }}
                >
                  {formatTime(secondsLeft)}
                </p>
                <p
                  className="mt-1 text-xs md:text-sm"
                  style={{ color: COLORES.textoSubtitulo }}
                >
                  Ciclo {currentCycle} / {config.totalCycles}
                </p>
              </div>

              {/* Anillo de progreso simple */}
              <div
                className="absolute inset-2 rounded-full border-4"
                style={{
                  borderColor: COLORES.bgActiveNav,
                  background: `conic-gradient(${COLORES.primario} ${progress}%, transparent ${progress}%)`,
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent 70%, #000 71%)",
                  mask: "radial-gradient(farthest-side, transparent 70%, #000 71%)",
                }}
              ></div>
            </motion.div>

            {/* Controles */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex gap-3 mb-6">
                {Object.keys(MODOS).map((key) => {
                  const isActive = (-modo === key + modoPomodoro) === key; // Lógica original mantenida
                  return (
                    <button
                      key={key}
                      onClick={() => seleccionarModoPomodoro(key)}
                      className="px-4 py-2 rounded-lg border transition"
                      style={{
                        backgroundColor: isActive
                          ? COLORES.secundario
                          : COLORES.bgCard,
                        color: isActive ? "#ffffff" : COLORES.textoOscuro,
                        borderColor: isActive
                          ? COLORES.secundario
                          : COLORES.bordeSuave,
                      }}
                    >
                      {MODOS[key].nombre}
                    </button>
                  );
                })}
              </div>

              {/* Duraciones cuando NO es personalizado */}
              {modoPomodoro !== "personalizado" && (
                <p
                  className="text-sm mb-4"
                  style={{ color: COLORES.textoSubtitulo }}
                >
                  Foco: {pmFoco} min · Pausa corta: {pmCorto} min · Pausa larga:{" "}
                  {pmLargo} min · Cada {pmCiclos} ciclos
                </p>
              )}
              <div className="flex gap-3">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-full font-semibold shadow transition disabled:opacity-60 text-white"
                    style={{ backgroundColor: COLORES.primario }}
                  >
                    {sessionId ? "Reanudar" : "Iniciar"}
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="px-6 py-2 rounded-full text-white font-semibold shadow transition"
                    style={{ backgroundColor: COLORES.alerta }}
                  >
                    Pausar
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-full text-sm border transition"
                  style={{
                    backgroundColor: COLORES.bgActiveNav,
                    color: COLORES.textoOscuro,
                    borderColor: COLORES.bordeSuave,
                  }}
                >
                  Reiniciar
                </button>
              </div>
              {mensajeFlash && (
                <p
                  className="text-sm font-semibold"
                  style={{ color: COLORES.primario }}
                >
                  {mensajeFlash}
                </p>
              )}
              {mensajeError && (
                <p className="text-xs mt-1 text-red-500">{mensajeError}</p>
              )}
            </div>
          </motion.section>

          {/* Panel lateral: Config - música - historial */}
          <section className="w-full md:w-80 flex flex-col gap-6">
            {/* Configuración */}
            <motion.div
              className="bg-white border rounded-3xl shadow p-4"
              style={{ borderColor: COLORES.bordeSuave }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2
                className="text-lg font-semibold mb-3"
                style={{ color: COLORES.primario }}
              >
                Configuración ⚙️
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: COLORES.textoSubtitulo }}
                  >
                    Foco (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={config.focusMinutes}
                    onChange={(e) =>
                      handleConfigChange(
                        "focusMinutes",
                        Number(e.target.value) || 1
                      )
                    }
                    className="w-full border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1"
                    style={{
                      borderColor: COLORES.bordeSuave,
                      color: COLORES.textoOscuro,
                      "--tw-ring-color": COLORES.primario,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: COLORES.textoSubtitulo }}
                  >
                    Break corto (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={config.shortBreakMinutes}
                    onChange={(e) =>
                      handleConfigChange(
                        "shortBreakMinutes",
                        Number(e.target.value) || 1
                      )
                    }
                    className="w-full border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1"
                    style={{
                      borderColor: COLORES.bordeSuave,
                      color: COLORES.textoOscuro,
                      "--tw-ring-color": COLORES.primario,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: COLORES.textoSubtitulo }}
                  >
                    Break largo (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={config.longBreakMinutes}
                    onChange={(e) =>
                      handleConfigChange(
                        "longBreakMinutes",
                        Number(e.target.value) || 1
                      )
                    }
                    className="w-full border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1"
                    style={{
                      borderColor: COLORES.bordeSuave,
                      color: COLORES.textoOscuro,
                      "--tw-ring-color": COLORES.primario,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs mb-1"
                    style={{ color: COLORES.textoSubtitulo }}
                  >
                    Ciclos de foco
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={config.totalCycles}
                    onChange={(e) =>
                      handleConfigChange(
                        "totalCycles",
                        Number(e.target.value) || 1
                      )
                    }
                    className="w-full border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1"
                    style={{
                      borderColor: COLORES.bordeSuave,
                      color: COLORES.textoOscuro,
                      "--tw-ring-color": COLORES.primario,
                    }}
                  />
                </div>
              </div>
              <button
                onClick={applyConfig}
                className="mt-3 w-full py-1.5 rounded-lg text-white text-sm font-semibold transition"
                style={{ backgroundColor: COLORES.primario }}
              >
                Aplicar cambios
              </button>
            </motion.div>

            {/* Música */}
            <motion.div
              className="bg-white border rounded-3xl shadow p-4"
              style={{ borderColor: COLORES.bordeSuave }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2
                className="text-lg font-semibold mb-3"
                style={{ color: COLORES.primario }}
              >
                Ambiente sonoro 🎧
              </h2>
              <label
                className="block text-xs mb-1"
                style={{ color: COLORES.textoSubtitulo }}
              >
                Música lo-fi
              </label>

              <select
                value={config.audioSeleccionado}
                onChange={(e) => {
                  const newId = e.target.value;
                  handleConfigChange("audioSeleccionado", newId);
                  const track = AUDIO_TRACKS.find((a) => a.id === newId);
                  if (track?.src) playPreview(track.src);
                }}
                className="w-full border rounded-lg px-2 py-1 text-sm mb-3 focus:outline-none"
                style={{
                  borderColor: COLORES.bordeSuave,
                  color: COLORES.textoOscuro,
                }}
              >
                {AUDIO_TRACKS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>

              <label
                className="block text-xs mb-1"
                style={{ color: COLORES.textoSubtitulo }}
              >
                Volumen ({config.volumen}%)
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={config.volumen}
                onChange={(e) =>
                  handleConfigChange("volumen", Number(e.target.value))
                }
                className="w-full"
                style={{ accentColor: COLORES.primario }}
              />
            </motion.div>

            {/* 🏅 Mis insignias */}
            <motion.div
              className="bg-white border rounded-3xl shadow p-4"
              style={{ borderColor: COLORES.bordeSuave }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2
                className="text-lg font-semibold mb-3"
                style={{ color: COLORES.primario }}
              >
                Mis insignias 🌱
              </h2>

              {insigniasUsuario.length === 0 ? (
                <p
                  className="text-xs"
                  style={{ color: COLORES.textoSubtitulo }}
                >
                  Aún no ganaste insignias.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {insigniasUsuario.map((ins, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      {/* ICONO */}
                      <div
                        className={`
            w-[80px] h-[80px] rounded-full bg-transparent border-2 
            flex items-center justify-center shadow 
            transition-all duration-300
            ${
              animarNuevaInsignia && idx === insigniasUsuario.length - 1
                ? "insignia-pop"
                : ""
            }
          `}
                        style={{ borderColor: COLORES.focusRing }}
                      >
                        <img
                          src={IMAGENES_INSIGNIAS[ins.insignia.nivel]}
                          alt={`Insignia nivel ${ins.insignia.nivel}`}
                          className="w-[78px] h-[78px] object-contain"
                        />
                      </div>

                      {/* TEXTO */}
                      <p
                        className="text-xs font-semibold mt-1 text-center"
                        style={{ color: COLORES.primario }}
                      >
                        {ins.insignia.titulo}
                      </p>

                      <p
                        className="text-[10px] text-center"
                        style={{ color: COLORES.textoSubtitulo }}
                      >
                        {ins.insignia.requisito_ciclos} ciclos
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div> 

            {/* Historial */}
            <motion.div
              className="bg-white border rounded-3xl shadow p-4"
              style={{ borderColor: COLORES.bordeSuave }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-lg font-semibold mb-2" style={{ color: COLORES.primario }}>
                Últimos días 📊
              </h2>
              <p className="text-sm mb-1" style={{ color: COLORES.textoOscuro }}>
                Tiempo total en foco:{" "}
                <span className="font-semibold" style={{ color: COLORES.primario }}>
                  {Math.round((historial.totalFoco || 0) / 60)} min
                </span>
              </p>
              <p className="text-xs mb-3" style={{ color: COLORES.textoSubtitulo }}>
                Sesiones registradas:{" "}
                <span className="font-semibold">
                  {historial.totalSesiones || 0}
                </span>
              </p>

              <div className="max-h-40 overflow-y-auto space-y-1 text-xs nice-scrollbar">
                {historial.sesiones && historial.sesiones.length > 0 ? (
                  historial.sesiones.slice(0, 10).map((s) => (
                    <div
                      key={s.idSesion}
                      className="flex justify-between border-b pb-1"
                      style={{ borderColor: COLORES.bordeSuave }}
                    >
                      <span style={{ color: COLORES.textoSubtitulo }}>
                        {new Date(s.inicio).toLocaleString()}
                      </span>
                      <span className="font-semibold" style={{ color: COLORES.primario }}>
                        {Math.round((s.duracionReal || 0) / 60)} min
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="italic" style={{ color: "#a0a0a0" }}>
                    Todavía no hay sesiones registradas.
                  </p>
                )}
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
