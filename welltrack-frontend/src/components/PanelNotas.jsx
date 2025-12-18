// // src/components/PanelNotas.jsx
// import { useState, useEffect } from "react";
// import { StickyNote } from "lucide-react";
// import { useQuill } from "react-quilljs";
// import "quill/dist/quill.snow.css";

// export default function PanelNotas({ abierto, usuario, token }) {
//   const [notas, setNotas] = useState([]);
//   const [mensaje, setMensaje] = useState("");
//   const { quill, quillRef } = useQuill({
//     theme: "snow",
//     modules: {
//       toolbar: [
//         ["bold", "italic", "underline"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         ["clean"],
//       ],
//     },
//   });

//   // Cargar notas del backend
//   useEffect(() => {
//     if (!abierto || !token) return;

//     const fetchNotas = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/nota", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         if (data.notas) setNotas(data.notas);
//       } catch (err) {
//         console.error("Error al cargar notas:", err);
//       }
//     };

//     fetchNotas();
//   }, [abierto, token]);

//   // Agregar nota
//   const agregarNota = async () => {
//     if (!quill) return;
//     const contenido = quill.root.innerHTML;
//     const palabras = quill.getText().trim().split(/\s+/).filter(Boolean).length;
//     if (!contenido.trim()) return;
//     if (palabras > 200) {
//       setMensaje("⚠️ Máximo 200 palabras permitidas.");
//       return;
//     }

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/nota", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ contenido, estadoNota: "activa" }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setNotas((prev) => [data.nota, ...prev]);
//         quill.root.innerHTML = "";
//         setMensaje("✅ Nota agregada correctamente.");
//       } else {
//         setMensaje("❌ Error al agregar nota.");
//       }
//     } catch (err) {
//       console.error("Error al agregar nota:", err);
//       setMensaje("❌ Error al conectar con el servidor.");
//     }
//   };

//   // Favorito
//   const destacarNota = async (id) => {
//     await fetch(`http://127.0.0.1:8000/api/nota/${id}/destacar`, {
//       method: "PATCH",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setNotas((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, destacada: !n.destacada } : n))
//     );
//   };

//   // Archivar
//   const archivarNota = async (id) => {
//     await fetch(`http://127.0.0.1:8000/api/nota/${id}/archivar`, {
//       method: "PATCH",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setNotas((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, archivada: !n.archivada } : n))
//     );
//   };

//   // Eliminar
//   const eliminarNota = async (id) => {
//     if (!window.confirm("¿Seguro que querés eliminar esta nota?")) return;
//     await fetch(`http://127.0.0.1:8000/api/nota/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setNotas((prev) => prev.filter((n) => n.id !== id));
//   };

//   return (
//     <div
//       className={`fixed top-[80px] left-0 h-full z-50 transition-all duration-500 overflow-y-auto 
//         backdrop-blur-lg bg-white/70 border-r border-white/50 shadow-2xl
//         ${abierto ? "w-[340px] opacity-100" : "w-0 opacity-0"}`}
//       style={{ pointerEvents: abierto ? "auto" : "none" }}
//     >
//       {abierto && (
//         <div className="flex flex-col gap-5 p-6 animate-fadeIn">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
//               <StickyNote className="w-6 h-6 text-green-600" />
//               Notas de {usuario.nombreUsuario}
//             </h2>
//           </div>

//           <div className="bg-white/60 border border-green-100 rounded-2xl p-2 shadow-sm">
//             <div ref={quillRef} style={{ height: "150px" }} />
//             <button
//               onClick={agregarNota}
//               className="mt-3 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-xl text-sm font-medium hover:scale-105 transition"
//             >
//               +
//             </button>
//             {mensaje && <p className="mt-2 text-sm text-center">{mensaje}</p>}
//           </div>

//           <div className="flex flex-col gap-3 mt-1">
//             {notas.length === 0 ? (
//               <p className="text-gray-400 text-sm text-center italic">Sin notas aún... 🌱</p>
//             ) : (
//               notas.map((n) => (
//                 <div
//                   key={n.idNota}
//                   className={`group relative p-4 rounded-2xl border border-green-100 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all`}
//                 >
//                   <div className="flex justify-between items-center">
//                     <small className="text-gray-500">
//                       📅 {new Date(n.created_at).toLocaleDateString("es-AR")}
//                     </small>
//                     <div className="space-x-2">
//                       <button
//                         onClick={() => destacarNota(n.idNota)}
//                         title="Favorita"
//                         className={`${n.destacada ? "text-yellow-400" : "text-gray-400"} hover:text-yellow-500`}
//                       >
//                         ★
//                       </button>
//                       <button
//                         onClick={() => archivarNota(n.idNota)}
//                         title={n.archivada ? "Restaurar" : "Archivar"}
//                         className="text-blue-400 hover:text-blue-600"
//                       >
//                         {n.archivada ? "📤" : "📥"}
//                       </button>
//                       <button
//                         onClick={() => eliminarNota(n.idNota)}
//                         title="Eliminar"
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </div>
//                   <div
//                     className="mt-2 prose dark:prose-invert max-w-none"
//                     dangerouslySetInnerHTML={{ __html: n.contenido }}
//                   />
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Archive, Star, X, RotateCcw } from "lucide-react";

export default function PanelNotas({ abierto, usuario, token, onToggle }) {
  const [notasActivas, setNotasActivas] = useState([]);
  const [notasArchivadas, setNotasArchivadas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");
  const [mostrarArchivadas, setMostrarArchivadas] = useState(false);

  useEffect(() => {
    if (!abierto || !token) return;

    const fetchNotas = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/nota", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar notas");
        const data = await res.json();

        if (data.notas) {
          const activas = data.notas.filter(
            (n) => n.estadoNota === "activa" || n.estadoNota === "destacada"
          );
          const archivadas = data.notas.filter((n) => n.estadoNota === "archivada");

          activas.sort((a, b) => {
            if (a.estadoNota === "destacada" && b.estadoNota !== "destacada") return -1;
            if (a.estadoNota !== "destacada" && b.estadoNota === "destacada") return 1;
            return new Date(b.updated_at) - new Date(a.updated_at);
          });

          setNotasActivas(activas);
          setNotasArchivadas(archivadas);
        }
      } catch (err) {
        console.error("Error al cargar notas:", err);
      }
    };

    fetchNotas();
  }, [abierto, token]);

  const agregarNota = async () => {
    if (!nuevaNota.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/nota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenido: nuevaNota, estadoNota: "activa" }),
      });

      const data = await res.json();
      if (res.ok) {
        setNotasActivas((prev) => [data.nota, ...prev]);
        setNuevaNota("");
      } else {
        alert(data.mensaje || "Error al crear nota");
      }
    } catch (err) {
      console.error("Error al agregar nota:", err);
    }
  };

  const cambiarEstado = async (id, accion) => {
    let endpoint = "";
    let method = "PATCH";

    if (accion === "eliminar") {
      endpoint = `http://127.0.0.1:8000/api/nota/${id}`;
      method = "DELETE";
    } else {
      endpoint = `http://127.0.0.1:8000/api/nota/${id}/${accion}`;
    }

    try {
      const res = await fetch(endpoint, { method, headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) {
        alert(data.mensaje || `Error al ${accion} nota`);
        return;
      }

      const notaActualizada = data.nota;

      setNotasActivas((prev) => prev.filter((n) => n.idNota !== id));
      setNotasArchivadas((prev) => prev.filter((n) => n.idNota !== id));

      if (notaActualizada.estadoNota === "archivada") {
        setNotasArchivadas((prev) => [notaActualizada, ...prev]);
      } else if (
        notaActualizada.estadoNota === "activa" ||
        notaActualizada.estadoNota === "destacada"
      ) {
        setNotasActivas((prev) =>
          [notaActualizada, ...prev].sort((a, b) => {
            if (a.estadoNota === "destacada" && b.estadoNota !== "destacada") return -1;
            if (a.estadoNota !== "destacada" && b.estadoNota === "destacada") return 1;
            return new Date(b.updated_at) - new Date(a.updated_at);
          })
        );
      }
    } catch (err) {
      console.error(`Error al ${accion} nota:`, err);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const notasAMostrar = mostrarArchivadas ? notasArchivadas : notasActivas;

  return (
    <>
      {/* Botón lateral */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 transform -translate-y-1/2 z-[60]
          bg-white/80 shadow-md border border-green-100 rounded-r-2xl p-2 transition-all duration-300 hover:bg-green-50`}
        style={{ left: abierto ? "360px" : "0" }}
      >
        {abierto ? (
          <X className="text-green-700 w-5 h-5" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-green-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-screen z-[999] transition-all duration-500 overflow-y-auto 
          backdrop-blur-lg bg-white/70 border-r border-white/50 shadow-2xl`}
        style={{ width: abierto ? "360px" : "0", pointerEvents: abierto ? "auto" : "none" }}
      >
        {abierto && (
          <div className="flex flex-col gap-5 p-6 animate-fadeIn transition-all duration-300">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
                Notas de {usuario.nombreUsuario}
              </h2>

              <Archive
                className={`ml-12 w-6 h-6 cursor-pointer transition-colors duration-300 ${
                  mostrarArchivadas
                    ? "text-green-600 hover:text-green-800"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setMostrarArchivadas(!mostrarArchivadas)}
                title={mostrarArchivadas ? "Volver a notas activas" : "Ver archivadas"}
              />
            </div>

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
                className="bg-[#57A773] hover:bg-[#91B088] text-white px-3 py-1 rounded-xl text-sm font-medium hover:scale-105 transition"
              >
                +
              </button>
            </div>

            {/* Contenedor de notas */}
            <div className="flex flex-col gap-3 mt-2 transition-all duration-500">
              {mostrarArchivadas && notasArchivadas.length === 0 && (
                <p className="text-gray-500 text-sm text-center mt-2">
                  No hay notas archivadas
                </p>
              )}

              {notasAMostrar.map((n) => (
                <div
                  key={n.idNota}
                  className={`p-4 rounded-2xl border shadow-md transition-all duration-300 transform hover:scale-[1.01]
                    ${
                      n.estadoNota === "destacada"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-green-100 bg-white/70"
                    }`}
                >
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {n.contenido}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatFecha(n.fechaCreacionNota)}
                  </p>

                  <div className="flex justify-center gap-4 mt-1">
                    {!mostrarArchivadas ? (
                      <>
                        <Star
                          className={`w-4 h-4 cursor-pointer ${
                            n.estadoNota === "destacada"
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-400"
                          }`}
                          onClick={() => cambiarEstado(n.idNota, "destacar")}

                        />
                        <Archive
                          className="w-4 h-4 text-gray-400 cursor-pointer"
                          onClick={() => cambiarEstado(n.idNota, "archivar")}
                        />
                        <X
                          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
                          onClick={() => cambiarEstado(n.idNota, "eliminar")}
                        />
                      </>
                    ) : (
                      <>
                        <RotateCcw
                          onClick={() => cambiarEstado(n.idNota, "restaurar")}
                          title="Restaurar"
                          className="w-4 h-4 text-green-500 cursor-pointer hover:text-green-700"
                        />
                        <X
                          onClick={() => cambiarEstado(n.idNota, "eliminar")}
                          title="Eliminar"
                          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
