import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  // Leer usuario actual y sesión
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          {/* LOGO */}
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 shadow-md">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welltrack</h1>
              <p className="text-sm text-gray-500">BienestarApp</p>
            </div>
          </div>

          {/* NAV OPCIONES */}
          <nav className="flex gap-8 text-gray-700 font-medium">
            <button
              onClick={() => navigate("/")}
              className="hover:text-green-600 transition"
            >
              Inicio
            </button>
            <button
              onClick={() => navigate("/notas")}
              className="hover:text-green-600 transition"
            >
              Planner
            </button>
            <button
              onClick={() => navigate("/perfil")}
              className="hover:text-green-600 transition"
            >
              Mi Panel
            </button>
          </nav>

          {/* BOTONES DERECHA */}
          <div className="flex items-center gap-5">
            {isLoggedIn && usuario ? (
              <>
                <div className="text-gray-700">
                  Hola, <span className="font-semibold">{usuario.nombreUsuario}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition transform"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-700 hover:text-green-600 transition"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition transform"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="w-full py-5 bg-white shadow-inner mt-10">
        <div className="max-w-7xl mx-auto px-10 text-center text-gray-600">
          Welltrack — 2025
        </div>
      </footer>
    </div>
  );
}
