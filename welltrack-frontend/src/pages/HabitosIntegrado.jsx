import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ResumenHabitos from "../components/ResumenHabitos";
import PanelNotas from "../components/PanelNotas";


const lanzarConfeti = () => {
  const emojis = ["🎉", "🌿", "💪", "✨", "🌞"];
  for (let i = 0; i < 25; i++) {
    const span = document.createElement("span");
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.position = "fixed";
    span.style.left = Math.random() * 100 + "vw";
    span.style.top = "-10px";
    span.style.fontSize = "1.5rem";
    span.style.zIndex = 9999;
    span.style.animation = `caer ${3 + Math.random() * 2}s linear forwards`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 4000);
  }
};

export default function HabitosPage2() {
  const token = localStorage.getItem("token");
  const [usuario, setUsuario] = useState(null);
  const [habitos, setHabitos] = useState([]);
  const [habitoSeleccionado, setHabitoSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoHabito, setNuevoHabito] = useState({
    nombre: "",
    descripcion: "",
    frecuencia: "diario",
    meta: "",
    unidad: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [felicitacion, setFelicitacion] = useState("");
  const [rachaGlobal, setRachaGlobal] = useState({
    actual: 0,
    maxima: 0,
  });

  const [panelAbierto, setPanelAbierto] = useState(false);

  function normalizarFecha(fechaString) {
    // Forzamos a interpretar la fecha como LOCAL, no UTC
    const [y, m, d] = fechaString.split("-");
    return new Date(y, m - 1, d) // <-- new Date(año, mesIndex, día)
      .toLocaleDateString("en-CA"); // lo convierte a YYYY-MM-DD
  }

  const seleccionarHabito = async (h) => {
    setHabitoSeleccionado(null); // Limpia antes de recargar

    try {
      // 📊 Obtener progreso de hoy
      const resProg = await fetch(
        `http://127.0.0.1:8000/api/habitos/${h.idHabito}/hoy`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const prog = await resProg.json();

      // 📅 Obtener historial
      const resHist = await fetch(
        `http://127.0.0.1:8000/api/habitos/${h.idHabito}/historial`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const dataHist = await resHist.json();

      // 🧠 NUEVO BLOQUE: verificar si el hábito es de hoy
      const hoy = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
      const ultimaFecha = h.fechaUltimoRegistro
        ? normalizarFecha(h.fechaUltimoRegistro)
        : null;
      const esDeHoy = ultimaFecha === hoy;

      // Si el hábito no es de hoy → reset visual
      const progresoFinal = esDeHoy
        ? prog
        : {
            valorHoy: 0,
            cumplido: false,
            meta: h.meta,
            unidad: h.unidad,
          };

      // 🔁 Aplicar todo al estado
      setHabitoSeleccionado({
        ...h,
        progreso: progresoFinal,
        historial: dataHist.historial || [],
        // rachaActual: esDeHoy ? h.rachaActual : 0,
        rachaActual: h.rachaActual
      });
    } catch (err) {
      console.error("Error al cargar hábito:", err);
    }
  };

  // 🧩 Obtener hábitos
  useEffect(() => {
    const fetchHabitos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/habitos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.mensaje || "Error al obtener hábitos");

        // 🟢 Traer racha global
        const resRacha = await fetch(
          "http://127.0.0.1:8000/api/racha-global/hoy",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataRacha = await resRacha.json();

        setRachaGlobal({
          actual: dataRacha.rachaActual,
          maxima: dataRacha.rachaMaxima,
        });

        // 🧠 1) Traer progreso de HOY para cada hábito
        const habitosConProgreso = await Promise.all(
          data.registros.map(async (h) => {
            try {
              const resp = await fetch(
                `http://127.0.0.1:8000/api/habitos/${h.idHabito}/hoy`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const prog = await resp.json();
              console.log("DEBUG FECHAS:", {
                original: h.fechaUltimoRegistro,
                parsed: new Date(h.fechaUltimoRegistro),
                local: new Date(h.fechaUltimoRegistro).toLocaleDateString(
                  "en-CA"
                ),
                hoy: new Date().toLocaleDateString("en-CA"),
              });
              return resp.ok
                ? {
                    ...h,
                    progreso: {
                      valorHoy: prog.valorHoy ?? 0,
                      cumplido: prog.cumplido ?? false,
                      meta: h.meta,
                      unidad: h.unidad,
                    },
                  }
                : {
                    ...h,
                    progreso: {
                      valorHoy: 0,
                      cumplido: false,
                      meta: h.meta,
                      unidad: h.unidad,
                    },
                  };
            } catch {
              return {
                ...h,
                progreso: {
                  valorHoy: 0,
                  cumplido: false,
                  meta: h.meta,
                  unidad: h.unidad,
                },
              };
            }
          })
        );

        // 🗓️ 2) Obtener historial de los últimos 7 días
        // const habitosConProgresoEHistorial = await Promise.all(
        //   habitosConProgreso.map(async (h) => {
        //     try {
        //       const qDesde = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        //         .toISOString()
        //         .slice(0, 10);
        //       const qHasta = new Date().toISOString().slice(0, 10);
        //       const url = `http://127.0.0.1:8000/api/registro-habito/${h.idHabito}?desde=${qDesde}&hasta=${qHasta}`;

        //       const resp = await fetch(url, {
        //         headers: { Authorization: `Bearer ${token}` },
        //       });
        //       const hist = await resp.json();

        //       return resp.ok
        //         ? { ...h, historial7d: hist.historial || [] }
        //         : { ...h, historial7d: [] };
        //     } catch {
        //       return { ...h, historial7d: [] };
        //     }
        //   })
        // );

        // 🌅 3) Reset visual si el último registro no es de hoy
        const hoy = new Date().toLocaleDateString("en-CA");

        const habitosConProgresoNormalizado = habitosConProgreso.map((h) => {
          const ultimaFecha = h.fechaUltimoRegistro
            ? normalizarFecha(h.fechaUltimoRegistro)
            : null;
          const esDeHoy = ultimaFecha === hoy;

          // 🔥 Si no es de hoy, se fuerza un "reset visual"
          return {
            ...h,
            progreso: {
              valorHoy: esDeHoy ? h.progreso?.valorHoy ?? 0 : 0,
              cumplido: esDeHoy ? h.progreso?.cumplido ?? false : false,
              meta: h.meta,
              unidad: h.unidad,
              // 👇 Agregamos explícitamente la fecha dentro del progreso (opcional pero útil)
              fechaUltimoRegistro: h.fechaUltimoRegistro,
            },
            rachaActual: h.rachaActual,
            rachaMaxima: h.rachaMaxima,
          };
        });

        console.log("🔍 Normalizados:", habitosConProgresoNormalizado);

        setHabitos(habitosConProgresoNormalizado);

        // Si el usuario ya tiene un hábito seleccionado, actualizalo también
        setHabitoSeleccionado((prev) => {
          if (!prev) return prev;
          const actualizado = habitosConProgresoNormalizado.find(
            (h) => h.idHabito === prev.idHabito
          );
          return actualizado || prev;
        });

        // ✅ 4) Guardar en estado
        // setHabitos(habitosConProgresoNormalizado);
        console.log("📊 Hábitos cargados:", habitosConProgresoNormalizado);
      } catch (err) {
        setMensaje(err.message);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchHabitos();
  }, [token]);

  // 🔁 Cada vez que se recarga la página, mostrar el progreso de hoy correctamente
  useEffect(() => {
    if (habitos.length > 0) {
      console.log(
        "✅ Progreso restaurado al recargar:",
        habitos.map((h) => ({
          nombre: h.nombre,
          valorHoy: h.progreso?.valorHoy,
          cumplido: h.progreso?.cumplido,
        }))
      );
    }
  }, [habitos]);

  // ➕ Crear / Editar hábito
  const guardarHabito = async () => {
    try {
      const url = modoEdicion
        ? `http://127.0.0.1:8000/api/habitos/${nuevoHabito.idHabito}`
        : "http://127.0.0.1:8000/api/habitos";
      const method = modoEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoHabito),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al guardar hábito");

      if (modoEdicion) {
        setHabitos((prev) =>
          prev.map((h) =>
            h.idHabito === nuevoHabito.idHabito ? data.habito : h
          )
        );
      } else {
        setHabitos((prev) => [...prev, data.habito]);
      }

      setMostrarFormulario(false);
      setModoEdicion(false);
      setNuevoHabito({
        nombre: "",
        descripcion: "",
        frecuencia: "diario",
        meta: "",
        unidad: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // 🗑️ Eliminar hábito
  const eliminarHabito = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este hábito?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/habitos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text(); // <- primero leemos como texto

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Respuesta no JSON del servidor:", text);
        throw new Error("El servidor devolvió HTML o un error inesperado.");
      }

      if (!res.ok) throw new Error(data.mensaje || "Error al eliminar hábito");

      setHabitos((prev) => prev.filter((h) => h.idHabito !== id));
      if (habitoSeleccionado?.idHabito === id) setHabitoSeleccionado(null);

      alert("✅ Hábito eliminado correctamente");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // ✅ Guardar progreso del día
  const guardarProgreso = async () => {
    try {
      const valor = Number(habitoSeleccionado.valorTemp);
      if (!valor || valor <= 0)
        return alert("Ingresá un valor válido para tu progreso.");

      // 📤 Enviar progreso
      const res = await fetch(
        `http://127.0.0.1:8000/api/habitos/${habitoSeleccionado.idHabito}/registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ valor }),
        }
      );

      const data = await res.json();

      console.log("🔙 registrar() responde:", data);
      if (!res.ok) throw new Error(data.mensaje || "Error al guardar progreso");

      const resHist = await fetch(
        `http://127.0.0.1:8000/api/habitos/${habitoSeleccionado.idHabito}/historial`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const dataHist = await resHist.json();

      // setHabitoSeleccionado((prev) => ({
      //   ...prev,
      //   historial: dataHist.historial,
      // }));

      

      // ✅ Actualizar hábito seleccionado
      setHabitoSeleccionado((prev) => ({
        ...prev,
        progreso: {
          valorHoy: data.valorHoy,
          cumplido: data.cumplido,
          meta: prev.meta,
          unidad: prev.unidad,
        },
        rachaActual: data.rachaActual ?? prev.rachaActual,
        rachaMaxima: data.rachaMaxima ?? prev.rachaMaxima,
        rachaGlobalActual: data.rachaGlobalActual ?? prev.rachaGlobalActual,
        rachaGlobalMaxima: data.rachaGlobalMaxima ?? prev.rachaGlobalMaxima,
        fechaUltimoRegistro: new Date().toISOString().slice(0, 10),
        historial: dataHist.historial || [],
        valorTemp: "",
      }));

      // ✅ Actualizar lista
      setHabitos((prev) =>
        prev.map((h) =>
          h.idHabito === habitoSeleccionado.idHabito
            ? {
                ...h,
                progreso: {
                  valorHoy: data.valorHoy,
                  cumplido: data.cumplido,
                  meta: h.meta,
                  unidad: h.unidad,
                },
                rachaActual: data.rachaActual ?? h.rachaActual,
                rachaMaxima: data.rachaMaxima ?? h.rachaMaxima,
                rachaGlobalActual:
                  data.rachaGlobalActual ?? h.rachaGlobalActual,
                rachaGlobalMaxima:
                  data.rachaGlobalMaxima ?? h.rachaGlobalMaxima,
                  fechaUltimoRegistro: new Date().toISOString().slice(0, 10),
              }
            : h
        )
      );

      // ✅ Actualizar racha global (independiente del hábito)
      setRachaGlobal({
        actual: data.rachaGlobalActual ?? 0,
        maxima: data.rachaGlobalMaxima ?? 0,
      });
      console.log(
        " Nueva racha global:",
        data.rachaGlobalActual,
        data.rachaGlobalMaxima
      );

      // 🎉 Mensaje visual (en lugar del alert)
      if (data.cumplido) {
        setFelicitacion("🎉 ¡Objetivo cumplido!");
      } else {
        setFelicitacion("💪 Progreso actualizado");
      }

      setTimeout(() => setFelicitacion(""), 3000);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // 🔥 Simulación de racha (por ahora aleatoria)
  //   const obtenerRacha = (h) => {
  //     return h.racha || Math.floor(Math.random() * 8);
  //   };

  //   useEffect(() => {
  //     if (habitos.length === 0) return;

  //     const todosCompletos =
  //       habitos.length > 0 &&
  //       habitos.every((h) => h.progreso && h.progreso.cumplido);

  //     if (todosCompletos) {
  //       setFelicitacion("🌞 ¡Completaste todos tus hábitos del día!");
  //       // 💫 (opcional) activar confeti visual
  //       lanzarConfeti();

  //       // Ocultar mensaje luego de 4s
  //       setTimeout(() => setFelicitacion(""), 4000);
  //     }
  //   }, [habitos]);

  // 🎉 Overlay de felicitación global (centrado)
  //   const OverlayFelicitacion = () => (
  //     <AnimatePresence>
  //       {felicitacion && felicitacion.includes("todos") && (
  //         <motion.div
  //           className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]"
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           exit={{ opacity: 0 }}
  //           transition={{ duration: 0.4 }}
  //         >
  //           <motion.div
  //             className="bg-white/90 text-green-800 rounded-3xl shadow-2xl p-10 text-center max-w-md mx-4 border border-green-200"
  //             initial={{ scale: 0.8, opacity: 0 }}
  //             animate={{ scale: 1, opacity: 1 }}
  //             exit={{ scale: 0.8, opacity: 0 }}
  //             transition={{ duration: 0.4 }}
  //           >
  //             <h2 className="text-3xl font-bold mb-4">🌞 ¡Día completado!</h2>
  //             <p className="text-lg mb-2">
  //               ¡Completaste todos tus hábitos de hoy! 🌿💪
  //             </p>
  //             <p className="text-sm text-gray-500 italic">
  //               Seguí así, tu constancia te acerca a tus metas ✨
  //             </p>
  //           </motion.div>
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //   );

  if (loading) return <Loader loading={true} />;

  return (

    <>
        <PanelNotas
            abierto={panelAbierto}
            usuario={usuario}
            token={token}
            onToggle={() => setPanelAbierto(!panelAbierto)}
          />
<Layout>
      <div className="min-h-screen w-full p-4 md:p-8">
          
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* 📋 Lista de hábitos */}
        <aside className="w-full md:w-1/3 p-6 border-r border-[#E8DCC9] rounded-3xl bg-white/60 backdrop-blur-sm shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#121F15]">
              Mis hábitos 🌱
            </h2>
            <button
              onClick={() => {
                setModoEdicion(false);
                setNuevoHabito({
                  nombre: "",
                  descripcion: "",
                  frecuencia: "diario",
                  meta: "",
                  unidad: "",
                });
                setMostrarFormulario(true);
              }}
              className="bg-[#58a774] text-white px-3 py-1 rounded-lg hover:bg-[#46865d] transition"
            >
              + Nuevo
            </button>
          </div>

          {habitos.length === 0 ? (
            <p className="text-[#866b46] italic">Aún no tenés hábitos.</p>
          ) : (
            <ul className="space-y-3">
              {habitos.map((h) => (
                <li
                  key={h.idHabito}
                  onClick={() => seleccionarHabito(h)}
                  className={`p-4 rounded-xl shadow-sm cursor-pointer border flex justify-between items-center transition 
  ${
    habitoSeleccionado?.idHabito === h.idHabito
      ? "bg-[#eef6f1] border-[#58a774]"
      : "bg-white hover:bg-[#f7f4ee] border-[#E8DCC9]"
  }`}
                >
                  <div>
                    <p className={`font-semibold ${habitoSeleccionado?.idHabito === h.idHabito ? 'text-[#121F15]' : 'text-[#463b20]'}`}>{h.nombre}</p>
                    <p className="text-sm text-[#866b46]">
                      Meta: {h.meta} {h.unidad}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNuevoHabito(h);
                        setModoEdicion(true);
                        setMostrarFormulario(true);
                      }}
                      className="text-[#58a774] hover:text-[#46865d] text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarHabito(h.idHabito);
                      }}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* 🌞 Resumen diario de progreso */}
        {habitos.length > 0 && (
          <div className="bg-white border border-[#E8DCC9] shadow-sm rounded-2xl py-5 px-8 mb-8 flex flex-col items-center gap-8 md:gap-10">
            {/* {(() => {
              const completados = habitos.filter(
                (h) => h.progreso?.cumplido
              ).length;
              const total = habitos.length;
              const porcentaje = Math.round((completados / total) * 100);

              return (
                <>
                  <p className="text-lg text-green-800 font-semibold">
                    {completados} de {total} hábitos completados hoy
                  </p>
                  <div className="w-64 bg-green-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-700"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 italic">
                    Progreso general del día: {porcentaje}% 🌞
                  </p>
                </>
              );
            })()} */}
            {(() => {
              const hoy = new Date().toISOString().slice(0, 10);
              const completados = habitos.filter((h) => {
                const fecha = h.fechaUltimoRegistro
                  ? new Date(h.fechaUltimoRegistro).toISOString().slice(0, 10)
                  : null;
                return h.progreso?.cumplido && fecha === hoy;
              }).length;

              const total = habitos.length;
              const porcentaje = Math.round((completados / total) * 100);

              console.log(habitos);

              return (
                <>
                  <p className="text-lg text-[#121F15] font-semibold">
                    {completados} de {total} hábitos completados hoy
                  </p>
                  
                  
                </>
              );
            })()}
            <ResumenHabitos habitos={habitos} />

            <div className="text-center mt-6">
              <p className="text-[#121F15] font-semibold mb-2">
                🌎 Racha global
              </p>

              <div className="flex justify-center gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-md ${
                      i < (rachaGlobal.actual || 0)
                        ? "bg-[#58a774]"
                        : "bg-[#e0e0e0]"
                    }`}
                  ></div>
                ))}
              </div>

              <p className="text-xs text-[#866b46] mt-2">
                {rachaGlobal.actual} / {rachaGlobal.maxima} días seguidos 🔥
              </p>
            </div>
          </div>
        )}

        {/* 🧠 Panel derecho */}
        <main className="flex-grow p-10 mr-4 rounded-3xl" style={{ backgroundColor: "transparent" }}>
          {!habitoSeleccionado ? (
            <div className="text-center text-[#866b46] mt-10">
              Seleccioná un hábito para ver su progreso 🌿
            </div>
          ) : (
            <>
              {console.log(
                " Render habit:",
                habitoSeleccionado.nombre,

                habitoSeleccionado.progreso
              )}
              <motion.div
                key={habitoSeleccionado.idHabito}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl shadow-lg p-10 max-w-2xl mx-auto border border-[#E8DCC9]"
              >
                {/* 🏷️ Encabezado */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-[#121F15] flex items-center gap-2">
                    🌿 {habitoSeleccionado.nombre}
                  </h3>
                  <span
                    className="text-sm px-3 py-1 bg-[#eef6f1] text-[#356445] rounded-full border border-[#bcdcc7]"
                    title="Frecuencia"
                  >
                    {habitoSeleccionado.frecuencia === "diario"
                      ? "🗓️ Diario"
                      : habitoSeleccionado.frecuencia === "semanal"
                      ? "📆 Semanal"
                      : "🌙 Mensual"}
                  </span>
                </div>

                {/* 📝 Descripción */}
                {habitoSeleccionado.descripcion && (
                  <p className="text-[#463b20] mb-6 leading-relaxed">
                    {habitoSeleccionado.descripcion}
                  </p>
                )}

                {/* 🎯 Meta */}
                <div className="bg-[#F7F5EF] border border-[#E8DCC9] rounded-xl p-4 mb-6">
                  <p className="text-[#121F15] font-semibold">
                    🎯 Meta diaria: {habitoSeleccionado.meta}{" "}
                    <span className="text-[#58a774]">
                      {habitoSeleccionado.unidad}
                    </span>
                  </p>
                </div>

                {/* 📈 Barra de progreso */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[#121F15] mb-2">
                    Progreso de hoy
                  </h4>
                  <div className="w-full bg-[#eef6f1] rounded-full h-4 overflow-hidden shadow-inner">
                    <motion.div
                      className="bg-gradient-to-r from-[#58a774] to-[#719966] h-4"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          ((habitoSeleccionado.progreso?.valorHoy || 0) /
                            habitoSeleccionado.meta) *
                            100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="text-sm text-[#866b46] mt-2 text-center">
                    {habitoSeleccionado.progreso?.valorHoy || 0} /{" "}
                    {habitoSeleccionado.meta} {habitoSeleccionado.unidad}
                  </p>
                </div>

                {/* 🔥 Racha */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-[#121F15] mb-2">
                    Racha actual 🔥
                  </h4>
                  {/* <div className="flex gap-1 justify-center">
                  {habitoSeleccionado.historial &&
                    habitoSeleccionado.historial.map((d, i) => (
                      <div
                        key={i}
                        title={d.fecha}
                        className={`w-6 h-6 rounded-md transition ${
                          d.cumplido ? "bg-green-500" : "bg-green-100"
                        }`}
                      ></div>
                    ))}
                </div> */}

                  {/* 🔥 Cuadraditos de racha (últimos 7 días) */}
                  <div className="flex gap-1 justify-center mt-3">
                    {(() => {
                      // Últimos 7 días (de más antiguo a más reciente)
                      const hoy = new Date();
                      hoy.setHours(0, 0, 0, 0);
                      const ultimos7 = Array.from({ length: 7 }).map((_, i) => {
                        const d = new Date(hoy);
                        d.setDate(hoy.getDate() - (6 - i));
                        return d.toISOString().slice(0, 10);
                      });

                      // Generar los cuadrados (🟩 cumplido, ⬜ no cumplido)
                      return ultimos7.map((fecha, i) => {
                        const diaHist = habitoSeleccionado.historial?.find(
                          (d) => d.fecha === fecha
                        );
                        const cumplido = diaHist?.cumplido ?? false;
                        return (
                          <div
                            key={i}
                            title={fecha}
                            className={`w-6 h-6 rounded-md border transition ${
                              cumplido
                                ? "bg-[#58a774] border-[#46865d]"
                                : "bg-[#e0e0e0] border-[#dcdcdc]"
                            }`}
                          ></div>
                        );
                      });
                    })()}
                  </div>
                  {/* <p className="text-sm text-gray-500 mt-1 text-center">
                    {habitoSeleccionado.rachaActual ?? 0} días seguidos 🌿
                  </p> */}

                  <p className="text-sm text-[#866b46] mt-1 text-center">
                    {habitoSeleccionado.rachaActual !== undefined ? habitoSeleccionado.rachaActual : 0}{" "} días seguidos 🌿
                  </p>


                  <p className="mt-3 text-xs text-[#866b46] text-center opacity-70">
                    Mejor racha: {habitoSeleccionado.rachaMaxima ?? 0} 🔥
                  </p>
                </div>

                {/* 📊 Input de progreso */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="number"
                    placeholder="Ingresá tu progreso de hoy"
                    className="border rounded-xl px-4 py-2 flex-grow focus:ring-2 focus:ring-[#bcdcc7] outline-none"
                    style={{ borderColor: "#E8DCC9" }}
                    value={habitoSeleccionado.valorTemp || ""}
                    onChange={(e) =>
                      setHabitoSeleccionado({
                        ...habitoSeleccionado,
                        valorTemp: e.target.value,
                      })
                    }
                  />
                  <span className="text-[#866b46] text-sm">
                    {habitoSeleccionado.unidad}
                  </span>
                </div>

                {/* 🧩 Botón de acción */}
                <button
                  onClick={guardarProgreso}
                  className="w-full mt-2 text-white py-3 rounded-xl hover:scale-[1.03] transition font-semibold shadow-sm"
                  style={{ backgroundColor: "#58a774" }}
                >
                  Guardar progreso
            
                </button>

                {/* 🎉 Mensaje de felicitación */}
                {felicitacion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 text-[#356445] font-semibold text-center py-3 px-4 rounded-xl shadow-sm"
                    style={{ backgroundColor: "#eef6f1" }}
                  >
                    {felicitacion}
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </main>

        {/* ➕ Modal */}
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-[#121F15]/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 14,
                }}
                className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 md:p-8 relative border border-[#E8DCC9]"
              >
                {/* ✖ Cerrar */}
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                  ✖
                </button>

                {/* 🌿 Título */}
                <h3
                  className="text-2xl font-bold mb-5 text-center"
                  style={{ color: modoEdicion ? "#3b82f6" : "#121F15" }}
                >
                  {modoEdicion ? "Editar hábito ✏️" : "Nuevo hábito 🌱"}
                </h3>

                {/* Nombre */}
                <input
                  type="text"
                  placeholder="Nombre del hábito"
                  value={nuevoHabito.nombre}
                  onChange={(e) =>
                    setNuevoHabito({ ...nuevoHabito, nombre: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2"
                  style={{ borderColor: "#E8DCC9", "--tw-ring-color": "#bcdcc7" }}
                />

                {/* Descripción */}
                <textarea
                  placeholder="Descripción (opcional)"
                  value={nuevoHabito.descripcion}
                  onChange={(e) =>
                    setNuevoHabito({
                      ...nuevoHabito,
                      descripcion: e.target.value,
                    })
                  }
                  className="border rounded-lg px-4 py-2 w-full mb-4 resize-none h-20 focus:outline-none focus:ring-2"
                  style={{ borderColor: "#E8DCC9", "--tw-ring-color": "#bcdcc7" }}
                />

                {/* Frecuencia */}
                <div className="mb-4">
                  <label className="text-[#866b46] text-sm font-medium block mb-1">
                    Frecuencia
                  </label>
                  <select
                    value={nuevoHabito.frecuencia}
                    onChange={(e) =>
                      setNuevoHabito({
                        ...nuevoHabito,
                        frecuencia: e.target.value,
                      })
                    }
                    className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
                    style={{ borderColor: "#E8DCC9", "--tw-ring-color": "#bcdcc7" }}
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>

                {/* Meta y unidad */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    placeholder="Meta (ej: 2000)"
                    value={nuevoHabito.meta}
                    onChange={(e) =>
                      setNuevoHabito({ ...nuevoHabito, meta: e.target.value })
                    }
                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2"
                    style={{ borderColor: "#E8DCC9", "--tw-ring-color": "#bcdcc7" }}
                  />

                  <select
                    value={nuevoHabito.unidad}
                    onChange={(e) =>
                      setNuevoHabito({ ...nuevoHabito, unidad: e.target.value })
                    }
                    className="border rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2"
                    style={{ borderColor: "#E8DCC9", "--tw-ring-color": "#bcdcc7" }}
                  >
                    <option value="">Seleccionar unidad</option>
                    <option value="ml">Mililitros (ml)</option>
                    <option value="pasos">Pasos</option>
                    <option value="min">Minutos</option>
                    <option value="horas">Horas</option>
                    <option value="páginas">Páginas</option>
                    <option value="repeticiones">Repeticiones</option>
                    <option value="km">Kilómetros</option>
                  </select>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setMostrarFormulario(false)}
                    className="px-4 py-2 rounded-lg transition"
                    style={{ backgroundColor: "#eef6f1", color: "#463b20" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={guardarHabito}
                    className="px-4 py-2 rounded-lg text-white hover:brightness-110 transition"
                    style={{ backgroundColor: "#58a774" }}
                  >
                    Guardar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
      {/* <OverlayFelicitacion /> */}
    </Layout>
    </>
  );
}
