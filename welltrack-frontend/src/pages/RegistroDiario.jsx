// src/pages/RegistroDiario.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import HistorialGraficos from "../components/HistorialGraficos";

export default function RegistroDiario() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

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

  const opciones = {
    estadoAnimo: [
      { emoji: "😊", texto: "Feliz" },
      { emoji: "🙂", texto: "Bien" },
      { emoji: "😐", texto: "Indiferente" },
      { emoji: "😢", texto: "Triste" },
      { emoji: "😠", texto: "Enojo" },
      { emoji: "😰", texto: "Ansiedad" },
      { emoji: "😴", texto: "Apática" },
      { emoji: "🤔", texto: "Insegura" },
      { emoji: "😒", texto: "Irritable" },
      { emoji: "😌", texto: "Seguridad" },
      { emoji: "🤩", texto: "Entusiasmo" },
      { emoji: "😔", texto: "Sensible" },
    ],
    mente: [
      { emoji: "💭", texto: "Tranquilidad" },
      { emoji: "😵‍💫", texto: "Niebla mental" },
      { emoji: "🧘‍♀️", texto: "Concentración" },
      { emoji: "😩", texto: "Estrés" },
      { emoji: "🎨", texto: "Creatividad" },
      { emoji: "🚫", texto: "Sin motivación" },
      { emoji: "⚡", texto: "Motivación" },
      { emoji: "💤", texto: "Poca memoria" },
      { emoji: "😶‍🌫️", texto: "Distracción" },
    ],
    energia: [
      { emoji: "😫", texto: "Agotamiento" },
      { emoji: "😴", texto: "Cansancio" },
      { emoji: "🙂", texto: "Ok" },
      { emoji: "⚡", texto: "Vitalidad" },
      { emoji: "🔥", texto: "Alto rendimiento" },
    ],
    vidaSocial: [
      { emoji: "🗣️", texto: "Sociable" },
      { emoji: "🤝", texto: "Apoyo" },
      { emoji: "🤐", texto: "Introversión" },
      { emoji: "💢", texto: "Conflicto" },
    ],
  };

  const toggleSeleccion = (valor, setValor, listaActual) => {
    if (listaActual.includes(valor)) {
      setValor(listaActual.filter((v) => v !== valor));
    } else {
      setValor([...listaActual, valor]);
    }
  };

  // useEffect(() => {
  //   if (estadoAnimo.includes("Triste") || estadoAnimo.includes("Ansiedad") || estadoAnimo.includes("Enojo")) {
  //     setEstresNivel(8);
  //   } else if (estadoAnimo.includes("Indiferente") || estadoAnimo.includes("Irritable")) {
  //     setEstresNivel(6);
  //   } else if (estadoAnimo.includes("Feliz") || estadoAnimo.includes("Bien") || estadoAnimo.includes("Seguridad") || estadoAnimo.includes("Entusiasmo")) {
  //     setEstresNivel(3);
  //   } else {
  //     setEstresNivel(5);
  //   }
  // }, [estadoAnimo]);

  const calcularEstres = () => {
    let nivel = 5;

    if (["Triste", "Ansiedad", "Enojo"].some((e) => estadoAnimo.includes(e)))
      nivel += 3;

    if (["Indiferente", "Irritable"].some((e) => estadoAnimo.includes(e)))
      nivel += 1;

    if (
      ["Feliz", "Bien", "Seguridad", "Entusiasmo"].some((e) =>
        estadoAnimo.includes(e)
      )
    )
      nivel -= 2;

    if (sueno <= 4) nivel += 3;
    else if (sueno <= 6) nivel += 1;
    else if (sueno >= 8) nivel -= 1;

    if (energia.includes("Muy Baja") || energia.includes("Agotamiento"))
      nivel += 3;
    else if (energia.includes("Cansancio")) nivel += 1;
    else if (
      energia.includes("Vitalidad") ||
      energia.includes("Alto Rendimiento")
    )
      nivel -= 1;

    return Math.max(0, Math.min(10, nivel));
  };

  useEffect(() => {
    setEstresNivel(calcularEstres());
  }, [estadoAnimo, mente, energia, sueno, aguaTomada, vidaSocial]);

  // Cargar último registro e historial
  useEffect(() => {
    if (!token) return;

    const fetchUltimo = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/registro-diario/ultimo",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.registro) {
          const r = data.registro;
          const nuevoRegistro = {
            estadoAnimo: r.estadoAnimo
              ? Array.isArray(r.estadoAnimo)
                ? r.estadoAnimo
                : r.estadoAnimo.split(",")
              : [],
            mente: r.mente
              ? Array.isArray(r.mente)
                ? r.mente
                : r.mente.split(",")
              : [],
            energiaNivel: r.energiaNivel
              ? Array.isArray(r.energiaNivel)
                ? r.energiaNivel
                : r.energiaNivel.split(",")
              : [],
            horasSueño: r.horasSueño || 0,
            vidaSocial: r.vidaSocial
              ? Array.isArray(r.vidaSocial)
                ? r.vidaSocial
                : r.vidaSocial.split(",")
              : [],
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

  // Comprobar cambios
  const hayCambios = () => {
    if (!registroOriginal) return true;

    const originalEstado = Array.isArray(registroOriginal.estadoAnimo)
      ? registroOriginal.estadoAnimo
      : registroOriginal.estadoAnimo
      ? registroOriginal.estadoAnimo.split(",")
      : [];
    const originalMente = Array.isArray(registroOriginal.mente)
      ? registroOriginal.mente
      : registroOriginal.mente
      ? registroOriginal.mente.split(",")
      : [];
    const originalEnergia = Array.isArray(registroOriginal.energiaNivel)
      ? registroOriginal.energiaNivel
      : registroOriginal.energiaNivel
      ? registroOriginal.energiaNivel.split(",")
      : [];
    const originalVida = Array.isArray(registroOriginal.vidaSocial)
      ? registroOriginal.vidaSocial
      : registroOriginal.vidaSocial
      ? registroOriginal.vidaSocial.split(",")
      : [];

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

    const hoyAR = new Date()
      .toLocaleDateString("es-AR", {
        timeZone: "America/Argentina/Buenos_Aires",
      })
      .split("/")
      .reverse()
      .join("-");

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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      setHistorial([
        registro,
        ...historial.filter((r) => r.fecha !== registro.fecha),
      ]);
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
            valores.includes(op.texto)
              ? "bg-green-300 border-green-500"
              : "bg-white border-gray-300 hover:bg-green-100"
          }`}
        >
          <span className="text-2xl">{op.emoji}</span>
          <span className="text-sm">{op.texto}</span>
        </button>
      ))}
    </div>
  );

  const formatoFecha = (fechaISO) => {
    const [y, m, d] = fechaISO.split("-");
    return `${d}/${m}/${y}`;
  };

  // Tarjeta genérica para pasos con opciones (ánimo, mente, energía, vida social)
  // const PasoCard = ({ titulo, contenido, ilustracion, colorFondo  }) => {
  const PasoWrapper = ({ titulo, ilustracion, contenido, children }) => {
    return (
      <div className="space-y-4  p-1 rounded-3xl">
        {/* {ilustracion && (
        <img
          src={ilustracion}
          alt="ilustración paso"
          className="w-32 mx-auto drop-shadow-sm"
        />
      )} */}
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

  // Barra de progreso reutilizable para sueño / agua
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

  // Selector de horas de sueño (1 a 12), misma lógica que tenías antes
  // const HorasSelector = ({ sueno, setSueno }) => {
  //   return (
  //     <div className="flex gap-2 justify-center mt-3">
  //       {Array.from({ length: 12 }).map((_, i) => (
  //         <button
  //           type="button"
  //           key={i}
  //           onClick={() => setSueno(i + 1)}
  //           className={`w-6 h-6 rounded-full cursor-pointer transition border
  //           ${
  //             sueno > i
  //               ? "bg-emerald-300 border-emerald-500"
  //               : "bg-gray-100 border-gray-200"
  //           }
  //         `}
  //         />
  //       ))}
  //     </div>
  //   );
  // };

  const HorasSelector = ({ sueno, setSueno }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-xs mx-auto">
        {Array.from({ length: 12 }).map((_, i) => {
          const active = sueno >= i + 1;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSueno(i + 1)}
              className={`
    w-12 h-12 flex items-center justify-center rounded-xl transition
    backdrop-blur-sm 
    ${active ? "bg-blue-200/40" : "bg-white/20"}
  `}
            >
              <img
                src="/public/Iconos/Luna.png" // ← poné tu ruta acá
                alt="hora de sueño"
                // className={`w-7 h-7 transition-all ${active ? "opacity-100" : "opacity-60"}`}
                className="min-w-[32px] min-h-[32px] w-8 h-8 object-contain"
              />
            </button>
          );
        })}
      </div>
    );
  };

  // Selector de agua (100ml a 1000ml), misma lógica
  const AguaSelector = ({ aguaTomada, setAguaTomada }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-xs mx-auto">
        {Array.from({ length: 10 }).map((_, i) => {
          const value = (i + 1) * 100;
          const active = aguaTomada >= value;

          return (
            <button
              key={i}
              onClick={() => setAguaTomada(value)}
              className={`
    w-12 h-12 flex items-center justify-center rounded-xl transition
    backdrop-blur-sm 
    ${active ? "bg-blue-200/40" : "bg-white/20"}
  `}
            >
              <img
                src="/public/Iconos/Agua.png"
                className="min-w-[32px] min-h-[32px] w-8 h-8 object-contain"
              />
            </button>
          );
        })}
      </div>
    );
  };

  // Pantalla final de resumen, misma info que antes + botón de reinicio
  const FinalCard = ({
    estadoAnimo,
    mente,

    energia,
    sueno,
    aguaTomada,
    vidaSocial,
    notaOpcional,
    estresNivel,
  }) => {
    return (
      <div className="animate-fadeIn mx-auto 1 bg-white p-6 rounded-3xl shadow-lg text-center space-y-4">
        <div className="text-4xl"></div>

        <h3 className="text-xl font-bold text-gray-700">
          ¡Registro completo!🎉
        </h3>

        <p className="text-gray-500 text-sm">
          Gracias por compartir cómo te sentiste hoy.
        </p>

        {/* Resumen */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left space-y-1">
          <p>
            <strong>Ánimo:</strong> {estadoAnimo.join(", ") || "-"}
          </p>
          <p>
            <strong>Mente:</strong> {mente.join(", ") || "-"}
          </p>
          <p>
            <strong>Energía:</strong> {energia.join(", ") || "-"}
          </p>
          <p>
            <strong>Sueño:</strong> {sueno} horas
          </p>
          <p>
            <strong>Agua:</strong> {aguaTomada} ml
          </p>
          <p>
            <strong>Vida social:</strong> {vidaSocial.join(", ") || "-"}
          </p>

          {notaOpcional && (
            <p>
              <strong>Nota:</strong> {notaOpcional}
            </p>
          )}

          <p>
            <strong>Estrés estimado:</strong> {estresNivel}/10
          </p>
        </div>

        {/* Botón */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
        >
          Volver al inicio
        </button>
      </div>
    );
  };

  return (
    <Layout>
      {/* ===== HEADER PRINCIPAL ==== */}
      {/* <div className="bg-gradient-to-b from-emerald-100 to-white border-b border-emerald-200 py-8 mb-8"> */}
      <div className="bg-[#F7F5EF] border-b border-[#C2A377]/40 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <h1 className="text-4xl font-bold text-[#121F15]">
            Registro diario ✨
          </h1>
          <p className="text-gray-600 mt-1">
            Contá cómo te sentís hoy completando cada paso.
          </p>

          {ultimaFecha && (
            <p className="text-xs text-gray-500 mt-1">
              Último registro: {formatoFecha(ultimaFecha)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto  grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* le saque p-6 */}
        <div className="space-y-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
          {/* 

============================================
          ⭐ COLUMNA IZQUIERDA — WIZARD
      ============================================ */}

          <div className="space-y-9">
            {/* ===== Barra de Progreso ===== */}
            <div
              className={`rounded-3xl shadow-lg p-5 border border-gray-100
          ${pasoActual === 1 ? "bg-rose-50" : ""}
  ${pasoActual === 2 ? "bg-violet-50" : ""}
  ${pasoActual === 3 ? "bg-amber-50" : ""}
  ${pasoActual === 4 ? "bg-indigo-50" : ""}
  ${pasoActual === 5 ? "bg-sky-50" : ""}
  ${pasoActual === 6 ? "bg-green-50" : ""}
  ${pasoActual === 7 ? "bg-gray-50" : ""}
          `}
            >
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Paso {pasoActual}</span>
                <span>7 pasos</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-emerald-400 transition-all"
                  style={{ width: `${(pasoActual / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* ===== Tarjeta del paso actual ===== */}
            <div
              key={pasoActual}
              className={`animate-slideLeft rounded-3xl shadow-xl border border-gray-100 p-10 h-[420px] relative overflow-hidden  flex flex-col justify-center
          ${pasoActual === 1 ? "bg-rose-50" : ""}
  ${pasoActual === 2 ? "bg-violet-50" : ""}
  ${pasoActual === 3 ? "bg-amber-50" : ""}
  ${pasoActual === 4 ? "bg-indigo-50" : ""}
  ${pasoActual === 5 ? "bg-sky-50" : ""}
  ${pasoActual === 6 ? "bg-green-50" : ""}
  ${pasoActual === 7 ? "bg-gray-50" : ""}
          `}
            >
              {/* ==== PASOS ==== */}
              {pasoActual === 1 && (
                <PasoWrapper
                  titulo="¿Cómo está tu estado de ánimo hoy?"
                  // ilustracion={ilustracionAnimo}
                  colorFondo="bg-rose-50"
                  contenido={renderOpciones(
                    "estadoAnimo",
                    estadoAnimo,
                    setEstadoAnimo
                  )}
                />
              )}

              {pasoActual === 2 && (
                <PasoWrapper
                  titulo="¿Cómo está tu mente?"
                  colorFondo="bg-violet-50"
                  contenido={renderOpciones("mente", mente, setMente)}
                />
              )}

              {pasoActual === 3 && (
                <PasoWrapper
                  titulo="¿Qué nivel de energía sentís?"
                  colorFondo="bg-amber-50"
                  contenido={renderOpciones("energia", energia, setEnergia)}
                />
              )}

              {/* Sueño */}
              {pasoActual === 4 && (
                <PasoWrapper
                  titulo="¿Cuántas horas dormiste?"
                  // ilustracion="/img/pasos/sueno.png"
                  colorFondo="bg-indigo-50"
                >
                  <BarraProgreso valor={sueno} max={12} color="emerald" />

                  <HorasSelector sueno={sueno} setSueno={setSueno} />
                </PasoWrapper>
              )}

              {/* Agua */}
              {pasoActual === 5 && (
                <PasoWrapper
                  titulo="¿Cuánta agua tomaste hoy?"
                  // ilustracion="/img/pasos/sueno.png"
                  colorFondo="bg-indigo-50"
                >
                  <BarraProgreso valor={aguaTomada} max={1000} color="blue" />

                  <AguaSelector
                    aguaTomada={aguaTomada}
                    setAguaTomada={setAguaTomada}
                  />
                </PasoWrapper>
              )}

              {/* Vida social */}

              {pasoActual === 6 && (
                <PasoWrapper
                  titulo="¿Cómo estuvo tu vida social hoy?"
                  colorFondo="bg-green-50"
                  contenido={renderOpciones(
                    "vidaSocial",
                    vidaSocial,
                    setVidaSocial
                  )}
                />
              )}

              {/* Nota */}
              {pasoActual === 7 && (
                <PasoWrapper
                  titulo="¿Querés agregar una nota opcional?"
                  // ilustracion="/img/pasos/nota.png"
                  colorFondo="bg-gray-50"
                >
                  <textarea
                    value={notaOpcional}
                    onChange={(e) => setNotaOpcional(e.target.value)}
                    placeholder="Algo para recordar hoy..."
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-300"
                    rows={4}
                  />
                </PasoWrapper>
              )}

              {/* FINAL */}
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

              {/* ==== NAVEGACIÓN ==== */}
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

                        setPasoActual("final");
                      }}
                      className={`px-6 py-2 rounded-xl text-white font-medium transition
                    ${
                      hayCambios()
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }
                  `}
                    >
                      Guardar registro
                    </button>
                  )}
                </div>
              )}

              {guardado && (
                <p className="text-emerald-600 font-semibold text-center mt-3">
                  ✔ Registro guardado correctamente
                </p>
              )}
            </div>

            <div className="relative w-full space-y-2">
              {/* Badge flotante de estrés */}
              {pasoActual !== "final" && (
                <div
                  className="mt-4 p-4 w-full bg-emerald-50 border border-emerald-200 
                  rounded-2xl shadow-sm flex items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="text-emerald-800 font-semibold text-sm">
                      Estrés estimado: {estresNivel}/10
                    </p>

                    <div className="w-full bg-emerald-200/40 h-1.5 rounded-full mt-1">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${(estresNivel / 10) * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-emerald-700 mt-1">
                      Basado en sueño, agua, ánimo, mente y energía
                    </p>
                  </div>
                </div>
              )}

              {/* {pasoActual !== "final" && (
  <div className="mt-4 p-5 w-full bg-white border border-emerald-200 
                  rounded-2xl shadow-sm flex justify-between items-center">

    <div className="flex-1 mr-4">
      <p className="text-xs text-gray-500">Estrés</p>

      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div
          className="bg-emerald-400 h-2 rounded-full"
          style={{ width: `${estresNivel * 10}%` }}
        />
      </div>
    </div>

    <p className="text-emerald-700 text-xl font-bold">{estresNivel}/10</p>
  </div>
)} */}
            </div>
            {historial.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Historial reciente
                  </h3>
                  <span className="text-xs text-gray-400">Últimos 7 días</span>
                </div>

                {/* Timeline */}
                <ul className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
                  {historial.map((r, i) => {
                    const hoyAR = new Date()
                      .toLocaleDateString("es-AR", {
                        timeZone: "America/Argentina/Buenos_Aires",
                      })
                      .split("/")
                      .reverse()
                      .join("-");

                    // const fechaRegistro = new Date(r.fecha).toLocaleDateString("es-AR", {
                    //   timeZone: "America/Argentina/Buenos_Aires",
                    // }).split("/").reverse().join("-");

                    const fechaRegistro = r.fecha;

                    const isHoy = r.fecha === hoyAR;

                    return (
                      //     <li
                      //       key={i}
                      //       className={`p-4 rounded-xl border shadow-sm transition
                      //   ${
                      //     isHoy
                      //       ? "bg-emerald-50 border-emerald-300"
                      //       : "bg-gray-50 border-gray-200"
                      //   }
                      // `}
                      //     >
                      //       <div className="flex justify-between text-sm">
                      //         <span className="font-medium text-gray-700">
                      //           {formatoFecha(r.fecha)}
                      //         </span>
                      //         {isHoy && (
                      //           <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-1 rounded-full">
                      //             Hoy
                      //           </span>
                      //         )}
                      //       </div>

                      //       <p className="text-gray-600 text-sm mt-1">
                      //         Ánimo: {r.estadoAnimo || "-"}
                      //       </p>
                      //       <p className="text-gray-600 text-sm">
                      //         Mente: {r.mente || "-"}
                      //       </p>
                      //       <p className="text-gray-600 text-sm">
                      //         Energía: {r.energiaNivel || "-"}
                      //       </p>
                      //       <p className="text-gray-600 text-sm">
                      //         Social: {r.vidaSocial || "-"}
                      //       </p>

                      //       {r.notaOpcional && (
                      //         <p className="text-xs text-gray-500 italic mt-2">
                      //           “{r.notaOpcional}”
                      //         </p>
                      //       )}
                      //     </li>

                      //                   <li className="pl-4 border-l-4 border-emerald-300 bg-gray-100 backdrop-blur-sm rounded-xl p-3 shadow-sm">

                      //   <div className="flex justify-between">
                      //     <span className="font-semibold text-gray-700">
                      //       {formatoFecha(r.fecha)}
                      //     </span>

                      //     {isHoy && (
                      //       <span className="text-xs text-emerald-600 font-medium">Hoy</span>
                      //     )}
                      //   </div>

                      //   <p className="text-gray-600 text-sm mt-1">
                      //     Ánimo: {r.estadoAnimo || "-"}
                      //   </p>
                      //   <p className="text-gray-600 text-sm">Mente: {r.mente || "-"}</p>
                      //   <p className="text-gray-600 text-sm">Energía: {r.energiaNivel || "-"}</p>
                      //   <p className="text-gray-600 text-sm">Social: {r.vidaSocial || "-"}</p>

                      //   {r.notaOpcional && (
                      //     <p className="text-xs text-gray-500 italic mt-2">
                      //       "{r.notaOpcional}"
                      //     </p>
                      //   )}
                      // </li>

                      <li className="p-5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-200 relative">
                        {/* Línea lateral */}
                        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-emerald-300" />

                        {/* Fecha */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center text-xl">
                            📅
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {formatoFecha(r.fecha)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Registro del día
                            </p>
                          </div>
                        </div>

                        {/* === FUNCION PARA RENDERIZAR ETIQUETAS === */}
                        <div className="space-y-3 text-sm">
                          {/* ÁNIMO */}
                          <div>
                            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                              <span>😊</span> Ánimo:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(r.estadoAnimo?.split(",") || []).map(
                                (item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  >
                                    {item.trim()}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {/* MENTE */}
                          <div>
                            <p className="flex items-center mb-3 gap-2 text-sm font-semibold text-gray-700">
                              <span>🧠</span> Mente:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(r.mente?.split(",") || []).map((item, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-700 border border-sky-200"
                                >
                                  {item.trim()}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* ENERGIA */}
                          <div>
                            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                              <span className="text-lg">⚡</span>
                              Energía
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {(r.energiaNivel?.split(",") || []).map(
                                (item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200"
                                  >
                                    {item.trim()}
                                  </span>
                                )
                              )}
                            </div>
                          </div>

                          {/* SOCIAL */}
                          <div>
                            <p className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                              <span>🤝</span> Social:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(r.vidaSocial?.split(",") || []).map(
                                (item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-700 border border-violet-200"
                                  >
                                    {item.trim()}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {r.notaOpcional && (
                          <div
                            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm max-w-[90%] mx-auto
"
                          >
                            <div className="flex items-center gap-1 mb-1 text-[10px] uppercase font-semibold text-gray-400">
                              <span>📝</span> Nota del día
                            </div>
                            <p className="text-xs text-yellow-800 italic leading-relaxed">
                              {r.notaOpcional}
                            </p>
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

        {/* ============================================
          ⭐ COLUMNA DERECHA — HISTORIAL + GRÁFICOS
      ============================================ */}
        <div className="space-y-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700">
              Gráficos de bienestar
            </h3>
            <HistorialGraficos historial={historial} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
