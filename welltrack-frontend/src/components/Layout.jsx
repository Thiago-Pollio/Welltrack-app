import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, Home, Edit3, ListChecks, Calendar, Timer, Users, HelpCircle, User, LogOut } from "lucide-react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener usuario y token
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const token = localStorage.getItem("token");

  // 🌗 MODO OSCURO / CLARO
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Error cerrando sesión", error);
    } finally {
      localStorage.removeItem("usuarioActual");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#FCFAF4] dark:bg-[#121212] transition-all">

      {/* HEADER */}
      <header
        className="fixed top-4 left-1/2 transform -translate-x-1/2 
        w-[95%] max-w-7xl backdrop-blur-md 
        bg-[#FCFAF4]/80 dark:bg-[#1c1c1c]/80 
        border border-[#F1EADE] dark:border-[#3a3a3a]
        rounded-2xl shadow-sm z-50 py-4 transition-all"
      >
        <div className="flex items-center justify-between px-4">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#91B088]/20 shadow-sm">
              <span className="text-2xl">🌿</span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#3d3d3d] dark:text-white">Welltrack</h1>
              <p className="text-xs sm:text-sm text-[#6d6a68] dark:text-gray-300">BienestarApp</p>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="flex items-center gap-3">

            {/* BOTÓN DE TEMA */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-[#F1EADE]/50 dark:bg-[#1c1c1c]/50 backdrop-blur-lg
                        shadow-md hover:bg-[#91B088]/30 transition-all
                        focus:outline-none focus:ring-2 focus:ring-[#91B088]"
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-[#5A534A]" />
              ) : (
                <Moon className="w-5 h-5 text-yellow-200" />
              )}
              
            </button>
            
              <div className="w-12 h-12 rounded-full bg-[#F1EADE]/50 dark:bg-[#1c1c1c]/50
                              shadow-md backdrop-blur-lg cursor-pointer
                              hover:ring-2 hover:ring-[#91B088] transition-all flex items-center justify-center">
                {/* Placeholder para la foto del usuario */}
                <span className="text-[#5A534A] dark:text-white font-semibold">👤</span>
              </div>

            {/* BOTÓN MENÚ HAMBURGUESA */}
            <button
                onClick={() => setMenuOpen(true)}
                className="p-3 rounded-full bg-[#F1EADE]/50 dark:bg-[#1c1c1c]/50 backdrop-blur-lg
                          shadow-md hover:bg-[#91B088]/30 transition-all
                          focus:outline-none focus:ring-2 focus:ring-[#91B088]"
              >
                <Menu className="w-6 h-6 text-[#5A534A] dark:text-white" />
              </button>

          </div>
        </div>
      </header>

      {/* MENU HAMBURGUESA DESLIZANTE */}
<div
  className={`fixed inset-0 z-[9999] transition-all duration-300 ${
    menuOpen ? "bg-black/40 backdrop-blur-sm visible" : "bg-black/0 invisible"
  }`}
  onClick={() => setMenuOpen(false)}
>
  {/* SIDEBAR */}
 <div
  className={`absolute top-0 right-0 h-full w-80 
    bg-[#F1EADE]/90 backdrop-blur-xl
    border-l border-[#E8DCC9]
    shadow-xl p-6 flex flex-col gap-4
    transition-all duration-700 ease-[cubic-bezier(.25,.8,.25,1)]

    ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
  onClick={(e) => e.stopPropagation()}
>

  {/* Encabezado */}
  <div className="flex items-center justify-between mb-2">
    <h2 className="text-xl font-semibold text-[#5A534A]">Menú</h2>

    <button
      onClick={() => setMenuOpen(false)}
      className="p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-lg
                shadow-md hover:bg-[#91B088]/30 transition-all
                focus:outline-none focus:ring-2 focus:ring-[#91B088]"
    >
      <X className="w-5 h-5 text-[#5A534A] dark:text-white" />
    </button>

      </div>

      {/* Enlaces */}
      <button
        onClick={() => { navigate("/"); setMenuOpen(false); }}
        className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
      >
        <Home className="w-5 h-5" />
        Inicio
      </button>

      <button
        onClick={() => { navigate("/registro-diario"); setMenuOpen(false); }}
        className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
      >
        <Edit3 className="w-5 h-5" />
        Registro diario
      </button>

      <button
        onClick={() => { navigate("/habitosIntegrado"); setMenuOpen(false); }}
        className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
      >
        <ListChecks className="w-5 h-5" />
        Hábitos
      </button>

      <button
          onClick={() => { navigate("/planner"); setMenuOpen(false); }}
          className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                    text-[#5A534A] hover:bg-[#91B088]/20 transition"
        >
          <Calendar className="w-5 h-5" />
          Planner
        </button>

      <button
        onClick={() => { navigate("/pomodoro"); setMenuOpen(false); }}
        className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
      >
        <Timer className="w-5 h-5" />
        Pomodoro
      </button>


      <button
      onClick={() => { navigate("/comunidad"); setMenuOpen(false); }}
      className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                text-[#5A534A] hover:bg-[#91B088]/20 transition"
    >
      <Users className="w-5 h-5" />
      Comunidad
    </button>


      <button
      onClick={() => { navigate("/ayuda"); setMenuOpen(false); }}
      className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                text-[#5A534A] hover:bg-[#91B088]/20 transition"
    >
      <HelpCircle className="w-5 h-5" />
      Ayuda
    </button>


      <button
      onClick={() => { navigate("/perfil"); setMenuOpen(false); }}
      className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                text-[#5A534A] hover:bg-[#91B088]/20 transition"
    >
      <User className="w-5 h-5" />
      Mi Perfil
    </button>


        {/* Cerrar sesión */}
        <button
          onClick={() => { handleLogout(); setMenuOpen(false); }}
          className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                    text-red-700 hover:bg-red-300/20 transition"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>

        </div>
      </div>


      {/* CONTENIDO */}
      <main className="flex-1 pt-32 px-4 sm:px-6 transition-all">
        {children}
      </main>

      {/* FOOTER */}
      <footer
        className="w-full py-6 text-center text-[#6d6a68] dark:text-gray-300
        bg-[#FCFAF4]/80 dark:bg-[#1c1c1c]/80 
        backdrop-blur-md border-t border-[#F1EADE] dark:border-[#3a3a3a]"
      >
        Welltrack — 2025
      </footer>
    </div>
  );
}