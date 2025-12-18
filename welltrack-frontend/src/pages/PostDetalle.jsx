import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Heart, MessageSquare, ArrowLeft, Users } from "lucide-react";

export default function PostDetalle() {
  const { idPost } = useParams();
  const [post, setPost] = useState(null);
  const [comentario, setComentario] = useState("");

  // mismos “paneles” que en Comunidad
  const [preguntas, setPreguntas] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [activos, setActivos] = useState([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState([]);
  const [actividad, setActividad] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // -----------------------
  // 📌 CARGA DE DATOS
  // -----------------------

  const cargarPost = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/comunidad/posts/${idPost}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setPost(data);
  };

  const cargarPreguntas = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/comunidad/preguntas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPreguntas(await res.json());
  };

  const cargarTendencias = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/comunidad/tendencias", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTendencias(await res.json());
  };

  const cargarActivos = async () => {
    const res = await fetch(
      "http://127.0.0.1:8000/api/comunidad/usuarios-activos",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setActivos(await res.json());
  };

  const cargarUsuariosRecientes = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/comunidad/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsuariosRecientes(data.slice(-5).reverse());
  };

  const cargarActividad = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/comunidad/actividad", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    // acá el backend devuelve { posts_semana, comentarios_semana, likes_semana }
    setActividad(data);
  };

  // -----------------------
  // 📌 Cargar todo al entrar
  // -----------------------

  useEffect(() => {
    cargarPost();
    cargarPreguntas();
    cargarTendencias();
    cargarActivos();
    cargarUsuariosRecientes();
    cargarActividad();
  }, [idPost]);

  // -----------------------
  // 📌 Acciones
  // -----------------------

  const enviarComentario = async () => {
    if (!comentario.trim()) return;

    await fetch(
      `http://127.0.0.1:8000/api/comunidad/posts/${idPost}/comentarios`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contenido: comentario }),
      }
    );

    setComentario("");
    cargarPost();
  };

  const toggleLike = async () => {
    await fetch(
      `http://127.0.0.1:8000/api/comunidad/posts/${idPost}/like`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    cargarPost();
  };

  // ======================
  // PALETA TIERRA (Definición local)
  // ======================
  const COLORES = {
    fondoPagina: "#F7F5EF",
    textoTitulo: "#121F15", // Dark Jungle
    textoSubtitulo: "#866b46", // Khaki medium
    textoOscuro: "#463b20", // Khaki dark
    bordeSuave: "#dfd4b9", // Bone/Beige border
    
    // Acciones
    primario: "#58a774", // Jungle Green
    primarioHover: "#46865d",
    
    // Fondos
    bgCard: "#ffffff",
    bgInput: "#ffffff",
    bgActiveNav: "#eef6f1", // Usado para items de lista, fondos suaves
    bgHover: "#f7f4ee",
    
    // UI Elements
    avatarText: "#356445"
  };

  if (!post) {
    return <Layout>Cargando...</Layout>;
  }

  // -----------------------
  // 📌 LAYOUT
  // -----------------------

  return (
    <Layout>
      <div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-10"
        style={{ backgroundColor: COLORES.fondoPagina }}
      >
        {/* -------------------------------- */}
        {/* IZQUIERDA — igual espíritu que Comunidad */}
        {/* -------------------------------- */}
        <div className="hidden lg:flex flex-col gap-6 col-span-1">
          {/* Volver + título */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            {/* Botón mejorado (Estilos aplicados) */}
            <button
              onClick={() => navigate("/comunidad")}
              className="group w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm mb-4 hover:opacity-80"
              style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.primario }}
            >
              <ArrowLeft 
                size={18} 
                className="group-hover:-translate-x-1 transition-transform duration-300" 
              />
              Volver a la comunidad
            </button>

            <h3 className="font-semibold text-base" style={{ color: COLORES.textoTitulo }}>
              Más de la comunidad
            </h3>
            <p className="text-xs mt-1" style={{ color: COLORES.textoSubtitulo }}>
              Explorá otros temas y usuarios
            </p>
          </div>

          {/* Preguntas & Consejos */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-1" style={{ color: COLORES.textoTitulo }}>
              Preguntas y consejos
            </h3>
            <p className="text-xs mb-3" style={{ color: COLORES.textoSubtitulo }}>
              Dudas reales de otros usuarios
            </p>

            {preguntas.length === 0 && (
              <p className="text-sm" style={{ color: COLORES.textoSubtitulo }}>
                Aún no hay preguntas destacadas.
              </p>
            )}

            {preguntas.map((p) => (
              <div
                key={p.idPost}
                className="p-3 rounded-xl cursor-pointer text-sm mb-2 transition hover:opacity-90"
                style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.textoOscuro }}
                onClick={() => navigate(`/comunidad/posts/${p.idPost}`)}
              >
                {p.contenido.slice(0, 80)}...
              </div>
            ))}
          </div>

          {/* Tendencias */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-2" style={{ color: COLORES.textoTitulo }}>Tendencias</h3>
            <div className="flex flex-col gap-2">
              {tendencias.map((t) => (
                <div
                  key={t.idPost}
                  className="px-3 py-2 rounded-xl cursor-pointer flex justify-between text-sm transition hover:opacity-90"
                  style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.textoOscuro }}
                  onClick={() => navigate(`/comunidad/posts/${t.idPost}`)}
                >
                  <span>{t.contenido.slice(0, 40)}...</span>
                  <span className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
                    ❤️ {t.likes_count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comunidad activa */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-1" style={{ color: COLORES.textoTitulo }}>
              Comunidad activa
            </h3>
            <p className="text-xs mb-3" style={{ color: COLORES.textoSubtitulo }}>
              Usuarios con más movimiento esta semana
            </p>

            {activos.map((u) => (
              <div
                key={u.idUsuario}
                className="flex justify-between text-sm cursor-pointer py-1 transition hover:opacity-80"
                style={{ color: COLORES.textoOscuro }}
                onClick={() => navigate(`/comunidad/usuario/${u.idUsuario}`)}
              >
                <span>{u.nombreUsuario}</span>
                <span className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
                  {u.posts_count} posts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* -------------------------------- */}
        {/* CENTRO — POST + COMENTARIOS */}
        {/* -------------------------------- */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* CARD DEL POST */}
          <div 
            className="p-6 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            {/* Autor */}
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  navigate(`/comunidad/usuario/${post.idUsuario}`)
                }
              >
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-lg"
                  style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.primario }}
                >
                  {post.usuario.nombreUsuario.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: COLORES.textoTitulo }}>
                    {post.usuario.nombreUsuario}
                  </p>
                  <p className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del post */}
            <p className="mt-5 text-sm leading-relaxed whitespace-pre-line" style={{ color: COLORES.textoTitulo }}>
              {post.contenido}
            </p>

            {/* Likes / Comentarios resumen */}
            <div className="flex items-center gap-6 mt-5 text-sm" style={{ color: COLORES.textoSubtitulo }}>
              <button
                onClick={toggleLike}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart
                  size={18}
                  className={
                    post.likes.length ? "fill-red-500 text-red-500" : ""
                  }
                />
                <span>{post.likes.length}</span>
              </button>

              <div className="flex items-center gap-1">
                <MessageSquare size={18} />
                <span>{post.comentarios.length}</span>
              </div>
            </div>
          </div>

          {/* COMENTARIOS */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="text-base font-semibold mb-3" style={{ color: COLORES.primario }}>
              Comentarios ({post.comentarios.length})
            </h3>

            {post.comentarios.length === 0 && (
              <p className="text-sm mb-2" style={{ color: COLORES.textoSubtitulo }}>
                Nadie comentó todavía. ¡Sé el primero! 💬
              </p>
            )}

            <div className="flex flex-col gap-4 mb-4">
              {post.comentarios.map((c) => (
                <div
                  key={c.idComentario}
                  className="p-3 rounded-2xl border"
                  style={{ backgroundColor: COLORES.bgActiveNav, borderColor: COLORES.bordeSuave }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
                      style={{ backgroundColor: COLORES.bgCard, color: COLORES.primario }}
                    >
                      {c.usuario.nombreUsuario.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: COLORES.primario }}>
                        {c.usuario.nombreUsuario}
                      </p>
                      <p className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm ml-1" style={{ color: COLORES.textoOscuro }}>{c.contenido}</p>
                </div>
              ))}
            </div>

            {/* Nuevo comentario */}
            <div className="border-t pt-3" style={{ borderColor: COLORES.bordeSuave }}>
              <h4 className="text-sm font-semibold mb-2" style={{ color: COLORES.primario }}>
                Agregar comentario
              </h4>
              <textarea
                rows="3"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribí algo..."
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-1 text-sm"
                style={{ 
                  backgroundColor: COLORES.bgInput, 
                  borderColor: COLORES.bordeSuave, 
                  color: COLORES.textoOscuro,
                  '--tw-ring-color': COLORES.primario 
                }}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={enviarComentario}
                  className="text-white text-sm py-2 px-5 rounded-xl transition hover:opacity-90"
                  style={{ backgroundColor: COLORES.primario }}
                >
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------- */}
        {/* DERECHA — Tu actividad */}
        {/* -------------------------------- */}
        <div className="hidden lg:flex flex-col gap-6 col-span-1">
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-4 text-base flex items-center gap-2" style={{ color: COLORES.primario }}>
              <Users size={18} /> Tu actividad reciente
            </h3>

            {!actividad || Object.keys(actividad).length === 0 ? (
              <p className="text-sm" style={{ color: COLORES.textoSubtitulo }}>Cargando tu actividad...</p>
            ) : (
              <ul className="space-y-3 text-sm" style={{ color: COLORES.textoOscuro }}>
                <li className="flex justify-between pb-1 border-b" style={{ borderColor: COLORES.bgActiveNav }}>
                  <span>📝 Posts creados</span>
                  <span className="font-semibold" style={{ color: COLORES.primario }}>
                    {actividad.posts_semana ?? 0}
                  </span>
                </li>

                <li className="flex justify-between pb-1 border-b" style={{ borderColor: COLORES.bgActiveNav }}>
                  <span>💬 Comentarios</span>
                  <span className="font-semibold" style={{ color: COLORES.primario }}>
                    {actividad.comentarios_semana ?? 0}
                  </span>
                </li>

                <li className="flex justify-between">
                  <span>❤️ Likes dados</span>
                  <span className="font-semibold" style={{ color: COLORES.primario }}>
                    {actividad.likes_semana ?? 0}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-2" style={{ color: COLORES.textoTitulo }}>
              Pequeño recordatorio
            </h3>
            <p className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
              Responder con respeto y empatía hace que la comunidad se sienta
              más segura 💚
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}