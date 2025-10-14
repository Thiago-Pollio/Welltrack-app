import { useState, useEffect } from "react";

export default function PanelNotas() {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userKey = usuario ? `notas_${usuario.nombreUsuario}` : null;

  const [abierto, setAbierto] = useState(false);
  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");

  useEffect(() => {
    if (isLoggedIn && userKey) {
      const notasGuardadas = JSON.parse(localStorage.getItem(userKey)) || [];
      setNotas(notasGuardadas);
    }
  }, [isLoggedIn, userKey]);

  const agregarNota = () => {
    if (!nuevaNota.trim()) return;
    const nuevasNotas = [...notas, { id: Date.now(), contenido: nuevaNota }];
    setNotas(nuevasNotas);
    localStorage.setItem(userKey, JSON.stringify(nuevasNotas));
    setNuevaNota("");
  };

  const eliminarNota = (id) => {
    const nuevasNotas = notas.filter((n) => n.id !== id);
    setNotas(nuevasNotas);
    localStorage.setItem(userKey, JSON.stringify(nuevasNotas));
  };

  if (!isLoggedIn || !usuario) return null;

  return (
    <div className="relative flex h-full">
      {/* 🔹 Barra delgada para abrir */}
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="flex-shrink-0 w-6 bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition z-20"
        >
          ❯
        </button>
      )}

      {/* 🔹 Panel lateral */}
      <aside
        className={`flex-shrink-0 w-80 bg-white border-r shadow-lg transition-transform duration-300 flex flex-col h-full ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del panel */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-800">Mis notas</h3>
          <button
            onClick={() => setAbierto(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>

        {/* Formulario */}
        <div className="p-4 flex gap-2 border-b">
          <input
            type="text"
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            placeholder="Escribe una nota..."
            className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            onClick={agregarNota}
            className="bg-green-400 text-white px-3 py-2 rounded-lg hover:bg-green-500 transition"
          >
            +
          </button>
        </div>

        {/* Lista de notas */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {notas.length === 0 && (
            <p className="text-gray-500 text-sm text-center">
              No hay notas todavía.
            </p>
          )}

          {notas.map((n) => (
            <div
              key={n.id}
              className="group bg-gradient-to-br from-yellow-100 via-green-50 to-purple-100 p-3 rounded-xl shadow-md relative"
            >
              <p className="text-gray-800 whitespace-pre-wrap break-words text-sm">
                {n.contenido}
              </p>
              <button
                onClick={() => eliminarNota(n.id)}
                className="absolute bottom-1 right-2 opacity-0 group-hover:opacity-100 transition text-gray-700 hover:text-gray-900 font-bold text-xs"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
