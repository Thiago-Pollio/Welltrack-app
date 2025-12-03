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

  if (!post) {
    return <Layout>Cargando...</Layout>;
  }

  // -----------------------
  // 📌 LAYOUT
  // -----------------------

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-10 bg-[#f3f7f5]">
        {/* -------------------------------- */}
        {/* IZQUIERDA — igual espíritu que Comunidad */}
        {/* -------------------------------- */}
        <div className="hidden lg:flex flex-col gap-6 col-span-1">
          {/* Volver + título */}
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <button
              onClick={() => navigate("/comunidad")}
              className="flex items-center text-emerald-700 text-sm mb-2 hover:underline"
            >
              <ArrowLeft size={16} className="mr-1" />
              Volver a la comunidad
            </button>
            <h3 className="font-semibold text-gray-800 text-base">
              Más de la comunidad
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Explorá otros temas y usuarios
            </p>
          </div>

          {/* Preguntas & Consejos */}
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">
              Preguntas y consejos
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Dudas reales de otros usuarios
            </p>

            {preguntas.length === 0 && (
              <p className="text-sm text-gray-500">
                Aún no hay preguntas destacadas.
              </p>
            )}

            {preguntas.map((p) => (
              <div
                key={p.idPost}
                className="p-3 bg-emerald-50 rounded-xl text-gray-700 hover:bg-emerald-100 cursor-pointer text-sm mb-2"
                onClick={() => navigate(`/comunidad/posts/${p.idPost}`)}
              >
                {p.contenido.slice(0, 80)}...
              </div>
            ))}
          </div>

          {/* Tendencias */}
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">Tendencias</h3>
            <div className="flex flex-col gap-2">
              {tendencias.map((t) => (
                <div
                  key={t.idPost}
                  className="px-3 py-2 bg-emerald-50 text-gray-700 hover:bg-emerald-100 rounded-xl cursor-pointer flex justify-between text-sm"
                  onClick={() => navigate(`/comunidad/posts/${t.idPost}`)}
                >
                  <span>{t.contenido.slice(0, 40)}...</span>
                  <span className="text-xs text-gray-500">
                    ❤️ {t.likes_count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comunidad activa */}
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-1">
              Comunidad activa
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Usuarios con más movimiento esta semana
            </p>

            {activos.map((u) => (
              <div
                key={u.idUsuario}
                className="flex justify-between text-gray-700 text-sm cursor-pointer hover:text-purple-600 py-1"
                onClick={() => navigate(`/comunidad/usuario/${u.idUsuario}`)}
              >
                <span>{u.nombreUsuario}</span>
                <span className="text-xs text-gray-500">
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
          <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
            {/* Autor */}
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  navigate(`/comunidad/usuario/${post.idUsuario}`)
                }
              >
                <div className="w-11 h-11 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center font-semibold text-lg">
                  {post.usuario.nombreUsuario.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.usuario.nombreUsuario}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido del post */}
            <p className="mt-5 text-gray-900 text-sm leading-relaxed whitespace-pre-line">
              {post.contenido}
            </p>

            {/* Likes / Comentarios resumen */}
            <div className="flex items-center gap-6 mt-5 text-gray-700 text-sm">
              <button
                onClick={toggleLike}
                className="flex items-center gap-1 hover:text-red-500"
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
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="text-base font-semibold text-emerald-800 mb-3">
              Comentarios ({post.comentarios.length})
            </h3>

            {post.comentarios.length === 0 && (
              <p className="text-sm text-gray-500 mb-2">
                Nadie comentó todavía. ¡Sé el primero! 💬
              </p>
            )}

            <div className="flex flex-col gap-4 mb-4">
              {post.comentarios.map((c) => (
                <div
                  key={c.idComentario}
                  className="bg-gray-50 border border-gray-100 p-3 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center font-semibold text-sm">
                      {c.usuario.nombreUsuario.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        {c.usuario.nombreUsuario}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-800 ml-1">{c.contenido}</p>
                </div>
              ))}
            </div>

            {/* Nuevo comentario */}
            <div className="border-t border-gray-200 pt-3">
              <h4 className="text-sm font-semibold text-emerald-700 mb-2">
                Agregar comentario
              </h4>
              <textarea
                rows="3"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribí algo..."
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={enviarComentario}
                  className="bg-emerald-600 text-white text-sm py-2 px-5 rounded-xl hover:bg-emerald-700 transition"
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
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold mb-4 text-emerald-700 text-base flex items-center gap-2">
              <Users size={18} /> Tu actividad reciente
            </h3>

            {!actividad || Object.keys(actividad).length === 0 ? (
              <p className="text-sm text-gray-500">Cargando tu actividad...</p>
            ) : (
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex justify-between pb-1 border-b border-gray-200">
                  <span>📝 Posts creados esta semana</span>
                  <span className="font-semibold text-emerald-700">
                    {actividad.posts_semana ?? 0}
                  </span>
                </li>

                <li className="flex justify-between pb-1 border-b border-gray-200">
                  <span>💬 Comentarios realizados</span>
                  <span className="font-semibold text-emerald-700">
                    {actividad.comentarios_semana ?? 0}
                  </span>
                </li>

                <li className="flex justify-between">
                  <span>❤️ Likes que diste</span>
                  <span className="font-semibold text-emerald-700">
                    {actividad.likes_semana ?? 0}
                  </span>
                </li>
              </ul>
            )}
          </div>

          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">
              Pequeño recordatorio
            </h3>
            <p className="text-xs text-gray-600">
              Responder con respeto y empatía hace que la comunidad se sienta
              más segura 💚
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}