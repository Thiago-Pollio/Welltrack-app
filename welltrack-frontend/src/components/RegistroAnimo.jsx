import React, { useState, useEffect } from "react";

export default function RegistroAnimo({ onClose, cerrar }) {
  // si el parent usa "cerrar" o "onClose", usamos el primero disponible
  const handleClose = onClose || cerrar || (() => {});

  const [estadoAnimo, setEstadoAnimo] = useState([]);
  const [mente, setMente] = useState([]);
  const [energia, setEnergia] = useState([]);
  const [sueno, setSueno] = useState("");
  const [vidaSocial, setVidaSocial] = useState([]);
  const [aguaTomada, setAguaTomada] = useState(0);
  const [estresNivel, setEstresNivel] = useState(5);
  const [notaOpcional, setNotaOpcional] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [ultimaFecha, setUltimaFecha] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("registroAnimo");
    if (data) {
      const parsed = JSON.parse(data);
      setEstadoAnimo(parsed.estadoAnimo || []);
      setMente(parsed.mente || []);
      setEnergia(parsed.energia || []);
      setSueno(parsed.sueno || "");
      setVidaSocial(parsed.vidaSocial || []);
      setAguaTomada(parsed.aguaTomada || 0);
      setEstresNivel(parsed.estresNivel || 5);
      setNotaOpcional(parsed.notaOpcional || "");
      setUltimaFecha(parsed.fecha || null);
    }
  }, []);

  const toggleSeleccion = (valor, setValor, listaActual) => {
    if (listaActual.includes(valor)) {
      setValor(listaActual.filter((v) => v !== valor));
    } else {
      setValor([...listaActual, valor]);
    }
  };

  const handleGuardar = () => {
    const registro = {
      estadoAnimo,
      mente,
      energia,
      sueno,
      vidaSocial,
      aguaTomada,
      estresNivel,
      notaOpcional,
      fecha: new Date().toISOString(),
    };

    localStorage.setItem("registroAnimo", JSON.stringify(registro));
    setGuardado(true);
    setUltimaFecha(registro.fecha);

    setTimeout(() => {
      setGuardado(false);
      handleClose();
    }, 1200);
  };

  // opciones (idénticas a las que tenías)
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
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-lg overflow-y-auto max-h-[90vh]">
        {/* Botón de cierre */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Registro de ánimo 🧠
        </h2>

        {ultimaFecha && (
          <p className="text-sm text-gray-500 text-center mb-4">
            Último registro: {formatoFecha(ultimaFecha)}
          </p>
        )}

        <div className="space-y-5">
          <div>
            <p className="font-semibold text-gray-600 mb-1">Estado de ánimo</p>
            {renderOpciones("estadoAnimo", estadoAnimo, setEstadoAnimo)}
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Mente</p>
            {renderOpciones("mente", mente, setMente)}
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Nivel de energía</p>
            {renderOpciones("energia", energia, setEnergia)}
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Horas de sueño</p>
            <input
              type="number"
              min="0"
              max="24"
              value={sueno}
              onChange={(e) => setSueno(e.target.value)}
              className="border p-2 rounded-lg w-24 text-center"
            />{" "}
            h
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Vida social</p>
            {renderOpciones("vidaSocial", vidaSocial, setVidaSocial)}
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Agua</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAguaTomada((prev) => Math.max(0, prev - 50))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>💧 {aguaTomada} ml</span>
              <button
                type="button"
                onClick={() => setAguaTomada((prev) => prev + 50)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Nivel de estrés</p>
            <input
              type="range"
              min="1"
              max="10"
              value={estresNivel}
              onChange={(e) => setEstresNivel(e.target.value)}
              className="w-full accent-green-400"
            />
            <div className="text-right text-gray-500 text-sm">
              {estresNivel}/10
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-600 mb-1">Nota opcional</p>
            <textarea
              value={notaOpcional}
              onChange={(e) => setNotaOpcional(e.target.value)}
              placeholder="Escribe algo extra..."
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              rows={3}
            />
          </div>

          <button
            type="button"
            onClick={handleGuardar}
            className="w-full mt-2 bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
          >
            Guardar
          </button>

          {guardado && (
            <p className="text-green-600 font-semibold mt-3 text-center">
              ✅ ¡Registro guardado correctamente!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
