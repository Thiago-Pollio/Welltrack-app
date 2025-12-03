import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function PerfilPublico() {

  const { idUsuario } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const insignias = import.meta.glob("/src/assets/insignias/*.png", {
  eager: true,
  import: "default"
});

  useEffect(() => {
    const cargarPerfil = async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/comunidad/usuarios/${idUsuario}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      setUsuario(data.usuario);  // <— este es el usuario
      setPosts(data.posts);      // <— estos son sus posts
    };

    cargarPerfil();
  }, [idUsuario]);

  if (!usuario) return <Layout>Cargando...</Layout>;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-10 bg-[#f3f7f5]">

        {/* -------------------------------- */}
        {/* IZQUIERDA */}
        {/* -------------------------------- */}
        <div className="hidden lg:flex flex-col gap-6 col-span-1">

          {/* Volver */}
          <button
            onClick={() => navigate("/comunidad")}
            className="text-emerald-700 hover:underline"
          >
            ← Volver
          </button>

          {/* CARD: Datos del Usuario */}
          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="text-gray-800 font-semibold text-lg">Perfil de usuario</h3>
            <p className="text-xs text-gray-500 mb-4">Información pública</p>

            <div className="flex items-center gap-4 mt-3">
              <div className="w-14 h-14 rounded-full bg-emerald-200 text-emerald-700 font-bold text-xl flex items-center justify-center">
                {usuario.nombreUsuario.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold text-emerald-700 text-lg">
                  {usuario.nombreUsuario}
                </p>
                <p className="text-xs text-gray-500">
                  Miembro desde{" "}
                  {new Date(usuario.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>


{usuario.insignias?.length > 0 && (
  <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
    <h3 className="text-gray-800 font-semibold mb-3">Insignias</h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {usuario.insignias.map((i) => (
        <div
          key={i.idInsignia}
          className="flex flex-col items-center text-center"
        >
          {/* Imagen de la insignia */}
          <img
            src={insignias[`/src/assets/insignias/${i.insignia.imagen}`]}
            alt={i.insignia.titulo}
            className="w-20 h-20 object-cover rounded-2xl shadow-sm border border-gray-200"
          />

          {/* Título */}
          <p className="text-sm font-medium text-gray-700 mt-2">
            {i.insignia.titulo}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

{/* Insignias
{usuario.insignias?.length > 0 && (
  <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
    <h3 className="text-gray-800 font-semibold mb-3">Insignias</h3>

    <div className="flex flex-col gap-3">
      {usuario.insignias.map((i) => (
        <div
          key={i.idInsignia}
          className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl"
        >
          <img
            src={insignias[`/src/assets/insignias/${i.insignia.imagen}`]}
            alt={i.insignia.titulo}
            className="w-10 h-10 object-contain"
          />

          <span className="text-sm text-gray-700 font-semibold">
            {i.insignia.titulo}
          </span>
        </div>
      ))}
    </div>
  </div>
)} */}

{/* Insignias */}
{/* {usuario.insignias?.length > 0 && (
  <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
    <h3 className="text-gray-800 font-semibold mb-3">Insignias</h3>

    <div className="grid grid-cols-2 gap-3">
      {usuario.insignias.map((i) => (
        <div
          key={i.idInsignia}
          className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl"
        >
          <img
            src={insignias[`/src/assets/insignias/${i.insignia.imagen}`]}
            alt={i.insignia.titulo}
            className="w-10 h-10 object-contain"
          />

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-emerald-700">
              {i.insignia.titulo}
            </span>
            <span className="text-xs text-gray-600">
              {i.insignia.requisito_ciclos} ciclos
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)} */}

{/* Insignias */}
{/* {usuario.insignias?.length > 0 && (
  <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
    <h3 className="text-gray-800 font-semibold mb-3">Insignias</h3>

    <div className="flex flex-col gap-3">
      {usuario.insignias.map((i) => (
        <div
          key={i.idInsignia}
          className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl"
        >
          <img
            src={insignias[`/src/assets/insignias/${i.insignia.imagen}`]}
            alt={i.insignia.titulo}
            className="w-10 h-10 object-contain"
          />

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              {i.insignia.titulo}
            </p>
            <p className="text-xs text-gray-500">
              Requiere {i.insignia.requisito_ciclos} ciclos
            </p>
          </div>
        </div>
      ))}
    </div>
  </div> 
)}*/}

        </div>


        {/* -------------------------------- */}
        {/* CENTRO — Posts del usuario */}
        {/* -------------------------------- */}
        <div className="col-span-1 lg:col-span-2 space-y-6">

          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">

            <h3 className="font-semibold text-gray-800 mb-4">
              Publicaciones de {usuario.nombreUsuario}
            </h3>

            {posts.length === 0 && (
              <p className="text-gray-500">Aún no publicó nada.</p>
            )}

            <div className="flex flex-col gap-6">
              {posts.map((p) => (
                <div
                  key={p.idPost}
                  className="bg-white p-5 rounded-3xl shadow border cursor-pointer hover:shadow-lg"
                  onClick={() => navigate(`/comunidad/posts/${p.idPost}`)}
                >
                  {/* HEADER */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-700">
                      {usuario.nombreUsuario.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {usuario.nombreUsuario}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* CONTENIDO */}
                  <p className="mt-4 text-gray-800 text-sm">{p.contenido}</p>

                  {/* FOOTER */}
                  <div className="flex items-center gap-6 mt-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      ❤️ {p.likes_count}
                    </div>
                    <div className="flex items-center gap-1">
                      💬 {p.comentarios_count}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>


        {/* -------------------------------- */}
        {/* DERECHA */}
        {/* -------------------------------- */}
        <div className="hidden lg:flex flex-col gap-6 col-span-1">

          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">
              Sobre este usuario
            </h3>

            <p className="text-sm text-gray-600">
              📝 Publicaciones totales:{" "}
              <span className="font-semibold text-emerald-700">
                {posts.length}
              </span>
            </p>

            <p className="text-sm text-gray-600 mt-2">
              🏅 Insignias:{" "}
              <span className="font-semibold text-emerald-700">
                {usuario.insignias?.length ?? 0}
              </span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">Consejo</h3>
            <p className="text-xs text-gray-600">
              Seguí explorando la comunidad. Podés descubrir gente parecida a vos 💚
            </p>
          </div>

        </div>

      </div>
    </Layout>
  );
}