import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import MiniChart from "../components/MiniChart";

// --- PALETA DE COLORES "EARTH" (Blindada) ---
const COLORES = {
  fondoPagina: "#F7F5EF", // Porcelain/Cream
  textoTitulo: "#121F15", // Dark Jungle
  textoSubtitulo: "#866b46", // Khaki medium
  textoOscuro: "#463b20", // Khaki dark
  bordeSuave: "#dfd4b9", // Bone/Beige border

  // Acciones
  primario: "#58a774", // Jungle Green (Botones, links activos)
  primarioHover: "#46865d",
  secundario: "#719966", // Muted Teal

  // Fondos suaves
  bgCard: "#ffffff",
  bgInputRead: "#f7f4ee", // Fondo input lectura
  bgActiveNav: "#eef6f1", // Fondo link activo
  bgQuote: "#f0e8db", // Fondo frase

  // Elementos UI
  avatarBorder: "#bcdcc7",
  focusRing: "#bcdcc7",
};

export default function PerfilUsuario() {
  const [seccion, setSeccion] = useState("perfil");
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [frase, setFrase] = useState("Cargando afirmación...");

  const [mostrarGaleria, setMostrarGaleria] = useState(false);

  const token = localStorage.getItem("token");

  const insignias = import.meta.glob("/src/assets/insignias/*.png", {
    eager: true,
    import: "default",
  });

  const [historicoSueno, setHistoricoSueno] = useState([]);
  const [historicoAgua, setHistoricoAgua] = useState([]);
  const [historicoEstres, setHistoricoEstres] = useState([]);
  const [pomodorosSemana, setPomodorosSemana] = useState([]);
  const [statsSemana, setStatsSemana] = useState({});
  const [rachaActual, setRachaActual] = useState(0);
  const [bienestarPromedio, setBienestarPromedio] = useState(0);

  useEffect(() => {
    // 👉 Traer usuario autenticado
    fetch("http://127.0.0.1:8000/api/usuario", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsuario(data))
      .catch(() => setUsuario(null));

    // 👉 Frase motivacional
    fetch("http://127.0.0.1:8000/api/afirmacion")
      .then((res) => res.json())
      .then((data) => setFrase(data.traduccion))
      .catch(() => setFrase("Hoy es un gran día para mejorar 🌞"));
  }, []);

  // 👉 Guardar cambios del usuario (PUT sin ID)
  const handleGuardar = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/usuario", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(usuario),
    });

    const data = await res.json();
    setUsuario(data);
    setEditando(false);
  };

  useEffect(() => {
  
  // 📌 Datos registro diario (últimos 7 días)
  fetch("http://127.0.0.1:8000/api/usuario/registro-historico", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      setHistoricoSueno(data.map(d => ({ fecha: d.fecha, valor: d.sueño })));
      setHistoricoAgua(data.map(d => ({ fecha: d.fecha, valor: d.agua })));
      setHistoricoEstres(data.map(d => ({ fecha: d.fecha, valor: d.estres })));
    });

  // 📌 Pomodoros totales
  fetch("http://127.0.0.1:8000/api/usuario/pomodoros", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setPomodorosSemana(data.totalPomodoros));

  // 📌 Stats semanales (promedios)
  fetch("http://127.0.0.1:8000/api/usuario/stats", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      setStatsSemana(data);
      setBienestarPromedio(data.promedio_estres);
    });

}, []);


  // 👉 Subir avatar (POST sin ID)
  const handleAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("http://127.0.0.1:8000/api/usuario/avatar", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    setUsuario((prev) => ({ ...prev, avatar: data.avatar }));
  };

  const seleccionarAvatar = async (archivo) => {
    const res = await fetch("http://127.0.0.1:8000/api/usuario/avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatarPreset: archivo }),
    });

    const data = await res.json();

    setUsuario((prev) => ({ ...prev, avatar: data.avatar }));
    setMostrarGaleria(false);
  };

  if (!usuario)
    return (
      <Layout>
        <p
          className="text-center mt-10"
          style={{ color: COLORES.textoSubtitulo }}
        >
          Cargando perfil...
        </p>
      </Layout>
    );

  console.log("USUARIO:", usuario);

  return (
    <Layout>
      <div className="flex max-w-6xl mx-auto gap-6 mt-10 p-4">
        {/* SIDEBAR */}
        <div
          className="w-64 rounded-3xl shadow-sm p-4 border"
          style={{
            backgroundColor: COLORES.bgCard,
            borderColor: COLORES.bordeSuave,
          }}
        >
          <h3
            className="text-sm font-semibold px-2 mb-3"
            style={{ color: COLORES.textoSubtitulo }}
          >
            Cuenta
          </h3>

          <nav className="space-y-2">
            {[
              { id: "perfil", label: "Perfil" },
              { id: "insignias", label: "Insignias & Logros" },
              { id: "estadisticas", label: "Estadísticas" },
              { id: "preferencias", label: "Preferencias" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSeccion(item.id)}
                className="w-full text-left px-4 py-3 rounded-xl transition font-medium"
                style={{
                  backgroundColor:
                    seccion === item.id ? COLORES.bgActiveNav : "transparent",
                  color:
                    seccion === item.id
                      ? COLORES.primario
                      : COLORES.textoOscuro,
                }}
                onMouseEnter={(e) => {
                  if (seccion !== item.id)
                    e.target.style.backgroundColor = "#f7f4ee";
                }}
                onMouseLeave={(e) => {
                  if (seccion !== item.id)
                    e.target.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* PANEL PRINCIPAL */}
        <div
          className="flex-1 rounded-3xl shadow-sm border p-8"
          style={{
            backgroundColor: COLORES.bgCard,
            borderColor: COLORES.bordeSuave,
          }}
        >
          {/* ---- PERFIL ---- */}
          {seccion === "perfil" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: COLORES.textoTitulo }}
                >
                  Tu perfil
                </h2>

                {editando ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditando(false)}
                      className="px-4 py-2 rounded-xl transition hover:opacity-80"
                      style={{
                        backgroundColor: COLORES.bgInputRead,
                        color: COLORES.textoOscuro,
                        border: `1px solid ${COLORES.bordeSuave}`,
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={handleGuardar}
                      className="px-5 py-2 rounded-xl text-white shadow-sm transition hover:opacity-90"
                      style={{ backgroundColor: COLORES.primario }}
                    >
                      Guardar cambios
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditando(true)}
                    className="px-5 py-2 rounded-xl text-white shadow-sm transition hover:opacity-90"
                    style={{ backgroundColor: COLORES.primario }}
                  >
                    Editar perfil
                  </button>
                )}
              </div>

              {/* FOTO + FRASE */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {/* FOTO */}
                  <img
                    src={
                      usuario.avatar?.startsWith("/storage")
                        ? `http://127.0.0.1:8000${usuario.avatar}`
                        : usuario.avatar
                        ? usuario.avatar
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    className="w-28 h-28 rounded-full border-4 object-cover"
                    style={{ borderColor: COLORES.avatarBorder }}
                  />

                  {/* BOTONES SOLO EN MODO EDICIÓN */}
                  {editando && (
                    <div className="flex flex-col gap-2 mt-3">
                      {/* SUBIR FOTO PROPIA */}
                      <label
                        className="px-4 py-1 rounded-xl text-sm cursor-pointer shadow text-center text-white transition hover:opacity-90"
                        style={{ backgroundColor: COLORES.primario }}
                      >
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleAvatar(e.target.files[0])}
                        />
                        Subir foto
                      </label>

                      {/* ELEGIR AVATAR */}
                      <button
                        onClick={() => setMostrarGaleria(true)}
                        className="px-4 py-1 rounded-xl transition text-sm shadow"
                        style={{
                          backgroundColor: COLORES.bgActiveNav,
                          color: COLORES.primarioHover,
                          border: `1px solid ${COLORES.avatarBorder}`,
                        }}
                      >
                        Elegir avatar
                      </button>
                    </div>
                  )}
                </div>

                {/* USUARIO + FRASE */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: COLORES.primario }}
                    ></span>
                    <h1
                      className="text-3xl md:text-4xl font-semibold tracking-tight"
                      style={{ color: "#23432e" }}
                    >
                      {usuario.nombreUsuario}
                    </h1>
                  </div>

                  <div
                    className="p-6 rounded-3xl border w-96"
                    style={{
                      backgroundColor: COLORES.bgActiveNav,
                      borderColor: COLORES.avatarBorder,
                    }}
                  >
                    <p className="italic" style={{ color: COLORES.textoMedio }}>
                      {frase}
                    </p>
                  </div>
                </div>
              </div>

              {/* GALERÍA MODAL */}
              {mostrarGaleria && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div
                    className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full border"
                    style={{ borderColor: COLORES.bordeSuave }}
                  >
                    <h3
                      className="text-xl font-bold mb-4 text-center"
                      style={{ color: COLORES.textoTitulo }}
                    >
                      Elegí tu avatar
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      {[
                        "Avatar1.png",
                        "Avatar2.png",
                        "Avatar3.png",
                        "Avatar4.png",
                      ].map((img) => (
                        <img
                          key={img}
                          src={`/avatars/${img}`}
                          onClick={() => seleccionarAvatar(`/avatars/${img}`)}
                          className="cursor-pointer rounded-full w-24 h-24 transition object-cover border-4 border-transparent hover:scale-105"
                          style={{ borderColor: "transparent" }}
                          onMouseEnter={(e) =>
                            (e.target.style.borderColor = COLORES.primario)
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.borderColor = "transparent")
                          }
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setMostrarGaleria(false)}
                      className="mt-6 w-full py-2 rounded-xl transition"
                      style={{
                        backgroundColor: COLORES.bgInputRead,
                        color: COLORES.textoOscuro,
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              {/* DATOS EDITABLES */}
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Nombre completo"
                  value={usuario.nombreApellido}
                  editando={editando}
                  onChange={(v) =>
                    setUsuario({ ...usuario, nombreApellido: v })
                  }
                />

                <Input
                  label="Email"
                  value={usuario.email}
                  editando={editando}
                  onChange={(v) => setUsuario({ ...usuario, email: v })}
                />

                <Input
                  label="Nombre de usuario"
                  value={usuario.nombreUsuario}
                  editando={editando}
                  onChange={(v) => setUsuario({ ...usuario, nombreUsuario: v })}
                />

                <Input
                  label="Fecha de nacimiento"
                  value={
                    usuario.fechaNac
                      ? new Date(usuario.fechaNac).toISOString().split("T")[0]
                      : ""
                  }
                  type="date"
                  editando={editando}
                  onChange={(v) => setUsuario({ ...usuario, fechaNac: v })}
                />
              </div>
            </>
          )}

          {/* ---- INSIGNIAS ---- */}
          {seccion === "insignias" && (
            <div className="space-y-8">
              {/* TÍTULO */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Insignias & Logros
                </h2>
                <p className="text-gray-500 mt-1">
                  Tu progreso dentro de Welltrack 🌱
                </p>
              </div>

              {/* RESUMEN */}
              <div className="bg-[#F7F5EF] border border-[#E8E0D2] p-5 rounded-3xl shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-[#3B7A55]">
                    {usuario.insignias?.length || 0} insignias obtenidas
                  </p>
                  <p className="text-sm text-[#6C6657]">
                    ¡Seguí acumulando logros!
                  </p>
                </div>

                <div className="text-4xl">🏅</div>
              </div>

              {/* INSIGNIAS */}
              {usuario.insignias?.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Tus insignias
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {usuario.insignias.map((i) => (
                      <div
                        key={i.idInsignia}
                        className="flex flex-col items-center text-center"
                      >
                        {/* Imagen */}
                        <img
                          src={
                            insignias[
                              `/src/assets/insignias/${i.insignia.imagen}`
                            ]
                          }
                          alt={i.insignia.titulo}
                          className="w-24 h-24 object-cover rounded-3xl shadow border border-gray-200 bg-white"
                        />

                        {/* Nombre */}
                        <p className="mt-2 text-sm font-medium text-gray-800">
                          {i.insignia.titulo}
                        </p>

                        {/* Descripción */}
                        <p className="text-xs text-gray-500">
                          {i.insignia.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Todavía no obtuviste insignias. ¡Pronto llegarán! 🎯
                </p>
              )}

              {/* FUTURAS INSIGNIAS (opcional si querés usarlo más adelante) */}
              {/* 
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Próximos logros</h3>
      <p className="text-gray-500 text-sm">Estamos preparando nuevas insignias para vos 🌟</p>
    </div> 
    */}
            </div>
          )}

          {/* ---- ESTADÍSTICAS ---- */}
          {seccion === "estadisticas" && (
            <div className="space-y-8">
              {/* --- Tarjetas rápidas --- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat
                  title="Pomodoros Totales"
                  icon="🍅"
                  value={usuario.totalPomodoros ?? 0}
                />
                <QuickStat
                  title="Minutos esta semana"
                  icon="⏱️"
                  value={statsSemana.minutos}
                />
                <QuickStat title="Racha actual" icon="🔥" value={rachaActual} />
                <QuickStat
                  title="Bienestar"
                  icon="🌿"
                  value={bienestarPromedio}
                />
              </div>

              {/* --- Mini gráficos --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-2xl border shadow-sm">
                  <h4 className="text-gray-700 font-semibold mb-3">Sueño</h4>
                  <MiniChart data={historicoSueno} color="#6ab7ff" />
                </div>

                <div className="bg-white p-4 rounded-2xl border shadow-sm">
                  <h4 className="text-gray-700 font-semibold mb-3">Agua</h4>
                  <MiniChart data={historicoAgua} color="#4dd4ac" />
                </div>

                <div className="bg-white p-4 rounded-2xl border shadow-sm">
                  <h4 className="text-gray-700 font-semibold mb-3">Estrés</h4>
                  <MiniChart data={historicoEstres} color="#ff8a80" />
                </div>
              </div>

              {/* --- Gráfico semanal de pomodoro --- */}
              <div className="bg-white p-6 rounded-3xl border shadow-sm">
                <h4 className="text-gray-700 font-semibold mb-3">
                  Pomodoro (últimos 7 días)
                </h4>
                <MiniChart data={pomodorosSemana} color="#34d399" />
              </div>
            </div>
          )}

          {seccion === "preferencias" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Preferencias
              </h2>

              {/* PRIVACIDAD */}
              <div className="bg-white p-6 rounded-2xl border shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Privacidad</h3>

                <Toggle
                  label="Perfil público"
                  checked={usuario.perfilPublico}
                  onChange={(v) => setUsuario({ ...usuario, perfilPublico: v })}
                />

                <Toggle
                  label="Mostrar insignias"
                  checked={usuario.mostrarInsignias}
                  onChange={(v) =>
                    setUsuario({ ...usuario, mostrarInsignias: v })
                  }
                />

                <Toggle
                  label="Mostrar estadísticas"
                  checked={usuario.mostrarEstadisticas}
                  onChange={(v) =>
                    setUsuario({ ...usuario, mostrarEstadisticas: v })
                  }
                />
              </div>

              {/* APARIENCIA */}
              <div className="bg-white p-6 rounded-2xl border shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">Apariencia</h3>

                <select
                  value={usuario.tema ?? "sistema"}
                  onChange={(e) =>
                    setUsuario({ ...usuario, tema: e.target.value })
                  }
                  className="border rounded-lg p-2"
                >
                  <option value="claro">Tema Claro</option>
                  <option value="oscuro">Tema Oscuro</option>
                  <option value="sistema">Usar el sistema</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between py-2">
    <span className="text-gray-700">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);

const QuickStat = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col">
    <span className="text-2xl mb-2">{icon}</span>
    <h4 className="text-gray-600 text-sm">{title}</h4>
    <p className="text-2xl font-bold text-emerald-700 mt-1">{value}</p>
  </div>
);

/* COMPONENTE INPUT CON ESTILOS INLINE */
const Input = ({ label, value, onChange, type = "text", editando }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm" style={{ color: COLORES.textoSubtitulo }}>
      {label}
    </label>

    {editando ? (
      <input
        type={type}
        className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2"
        style={{
          borderColor: COLORES.bordeSuave,
          color: COLORES.textoOscuro,
          "--tw-ring-color": COLORES.focusRing,
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p
        className="px-2 py-2 border rounded-xl"
        style={{
          backgroundColor: COLORES.bgInputRead,
          borderColor: COLORES.bordeSuave,
          color: COLORES.textoOscuro,
        }}
      >
        {value}
      </p>
    )}
  </div>
);
