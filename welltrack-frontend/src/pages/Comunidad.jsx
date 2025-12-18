import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Heart, MessageSquare, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Comunidad() {
  const [posts, setPosts] = useState([]);
  const [nuevoPost, setNuevoPost] = useState("");

  const [preguntas, setPreguntas] = useState([]);
  const [tendencias, setTendencias] = useState([]);
  const [activos, setActivos] = useState([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState([]);
  const [actividad, setActividad] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const cargarPosts = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/comunidad/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(await res.json());
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
    const res = await fetch("http://127.0.0.1:8000/api/comunidad/usuarios-activos", {
      headers: { Authorization: `Bearer ${token}` },
    });
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

  console.log("ACTIVIDAD BACKEND:", data); 

  setActividad(data); 
};


  useEffect(() => {
    cargarPosts();
    cargarPreguntas();
    cargarTendencias();
    cargarActivos();
    cargarUsuariosRecientes();
    cargarActividad();
  }, []);

  const crearPost = async () => {
    if (!nuevoPost.trim()) return;

    await fetch("http://127.0.0.1:8000/api/comunidad/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contenido: nuevoPost }),
    });

    setNuevoPost("");
    cargarPosts();
  };


  const toggleLike = async (idPost) => {
    await fetch(`http://127.0.0.1:8000/api/comunidad/posts/${idPost}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    cargarPosts();
  };

  const COLORES = {
    fondoPagina: "#F7F5EF",
    textoTitulo: "#121F15", 
    textoSubtitulo: "#866b46",
    textoOscuro: "#463b20",
    bordeSuave: "#dfd4b9",
    primario: "#58a774", 
    primarioHover: "#46865d",
    bgCard: "#ffffff",
    bgInput: "#ffffff",
    bgActiveNav: "#eef6f1",
    bgHover: "#f7f4ee",
    avatarText: "#356445"
  };

  return (
    <Layout>
      <div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-10"
        
      >

        <div className="hidden lg:flex flex-col gap-6 col-span-1">

          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-1" style={{ color: COLORES.textoTitulo }}>Nuevos miembros</h3>
            <p className="text-xs mb-4" style={{ color: COLORES.textoSubtitulo }}>¡Dales la bienvenida!</p>

            <ul className="space-y-4">
              {usuariosRecientes.map((u) => (
                <li
                  key={u.idUsuario}
                  className="flex items-center gap-3 cursor-pointer transition hover:opacity-80"
                  onClick={() => navigate(`/comunidad/usuario/${u.idUsuario}`)}
                >
                  <div 
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.primario }}
                  >
                    {u.nombreUsuario.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm" style={{ color: COLORES.textoOscuro }}>{u.nombreUsuario}</span>
                    
                    <span className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
                      Se unió recientemente
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-1" style={{ color: COLORES.textoTitulo }}>Preguntas y consejos</h3>
            <p className="text-xs mb-4" style={{ color: COLORES.textoSubtitulo }}>Explorá dudas y experiencias</p>

            {preguntas.length === 0 && (
              <p className="text-sm" style={{ color: COLORES.textoSubtitulo }}>Aún no hay preguntas.</p>
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

          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-3" style={{ color: COLORES.textoTitulo }}>Tendencias</h3>

            <div className="flex flex-col gap-2">
              {tendencias.map((t) => (
                <div
                  key={t.idPost}
                  className="px-3 py-2 rounded-xl cursor-pointer flex justify-between text-sm transition hover:opacity-90"
                  style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.textoOscuro }}
                  onClick={() => navigate(`/comunidad/posts/${t.idPost}`)}
                >
                  <span>{t.contenido.slice(0, 40)}...</span>
                  <span className="text-xs" style={{ color: COLORES.textoSubtitulo }}>❤️ {t.likes_count}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-1" style={{ color: COLORES.textoTitulo }}>Comunidad activa</h3>
            <p className="text-xs mb-3" style={{ color: COLORES.textoSubtitulo }}>Usuarios con más actividad esta semana</p>

            {activos.map((u) => (
              <div
                key={u.idUsuario}
                className="flex justify-between text-sm cursor-pointer py-1 transition hover:opacity-80"
                style={{ color: COLORES.textoOscuro }}
                onClick={() => navigate(`/comunidad/usuario/${u.idUsuario}`)}
              >
                <span>{u.nombreUsuario}</span>
                <span className="text-xs" style={{ color: COLORES.textoSubtitulo }}>{u.posts_count} posts</span>
              </div>
            ))}
          </div>

        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-3" style={{ color: COLORES.textoTitulo }}>Crear post</h3>

            <div className="flex gap-3 items-start">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.primario }}
              >
                U
              </div>

              <textarea
                className="w-full p-3 border rounded-2xl resize-none focus:outline-none focus:ring-1"
                style={{ 
                  backgroundColor: COLORES.bgInput, 
                  borderColor: COLORES.bordeSuave, 
                  color: COLORES.textoOscuro,
                  '--tw-ring-color': COLORES.primario
                }}
                placeholder="¿Qué querés compartir hoy?"
                rows="2"
                value={nuevoPost}
                onChange={(e) => setNuevoPost(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={crearPost}
                className="px-5 py-2 rounded-xl text-white transition hover:opacity-90"
                style={{ backgroundColor: COLORES.primario }}
              >
                Publicar
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <div
              key={post.idPost}
              className="p-5 rounded-3xl shadow-sm border hover:shadow-md cursor-pointer transition-shadow"
              style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
              onClick={() => navigate(`/comunidad/posts/${post.idPost}`)}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer"
                  style={{ backgroundColor: COLORES.bgActiveNav, color: COLORES.primario }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/comunidad/usuario/${post.idUsuario}`);
                  }}
                >
                  {post.usuario?.nombreUsuario.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold" style={{ color: COLORES.textoTitulo }}>
                    {post.usuario?.nombreUsuario}
                  </p>
                  <p className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <p className="mt-4 text-sm" style={{ color: COLORES.textoOscuro }}>{post.contenido}</p>

              {/* Footer */}
              <div className="flex items-center gap-6 mt-4 text-sm" style={{ color: COLORES.textoSubtitulo }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(post.idPost);
                  }}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart size={18} />
                  <span>{post.likes?.length}</span>
                </button>

                <div className="flex items-center gap-1">
                  <MessageSquare size={18} />
                  <span>{post.comentarios?.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex flex-col gap-6 col-span-1">

          {/* Actividad reciente */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-4" style={{ color: COLORES.textoTitulo }}>Actividad reciente</h3>

            {!actividad || Object.keys(actividad).length === 0 ? (
              <p className="text-sm" style={{ color: COLORES.textoSubtitulo }}>Cargando...</p>
            ) : (
              <ul className="space-y-3 text-sm" style={{ color: COLORES.textoOscuro }}>
                <li className="flex justify-between">
                  <span>📝 Posts creados</span>
                  <span className="font-semibold" style={{ color: COLORES.primario }}>
                    {actividad.posts_semana}
                  </span>
                </li>

                <li className="flex justify-between">
                  <span>💬 Comentarios realizados</span>
                  <span className="font-semibold" style={{ color: COLORES.primario }}>
                    {actividad.comentarios_semana}
                  </span>
                </li>

                <li className="flex justify-between">
                  <span>❤️ Likes dados</span>
                  <span className="font-semibold" style={{ color: COLORES.primario }}>
                    {actividad.likes_semana}
                  </span>
                </li>
              </ul>
            )}
          </div>

          {/* recordatorio */}
          <div 
            className="p-5 rounded-3xl shadow-sm border"
            style={{ backgroundColor: COLORES.bgCard, borderColor: COLORES.bordeSuave }}
          >
            <h3 className="font-semibold mb-2" style={{ color: COLORES.textoTitulo }}>Pequeño recordatorio</h3>
            <p className="text-xs" style={{ color: COLORES.textoSubtitulo }}>
              Compartí algo hoy. Tus experiencias pueden ayudar a otros 💚
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
