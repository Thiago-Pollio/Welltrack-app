import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Menu,
  X,
  Home,
  Edit3,
  ListChecks,
  Calendar,
  Timer,
  Users,
  HelpCircle,
  User,
  LogOut,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaGlobe,
  FaGithub,
  FaEnvelope
} from "react-icons/fa6";

import logoIcono from "../assets/Welltrack-logo-solo.png";
import logoTexto from "../assets/Welltrack-logo-Texto.png";
import logoIconoTexto from "../assets/Welltrack-logo.png";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener usuario y token
  // const usuarioGuardado = localStorage.getItem("usuarioActual");
  // const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuarioActual");
    return guardado ? JSON.parse(guardado) : null;
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Error al obtener usuario");
        })
        .then((data) => {
          setUsuario(data); // Actualizamos el estado con la data real de la BD
          // Opcional: Actualizar también el localStorage para futuras cargas
          localStorage.setItem("usuarioActual", JSON.stringify(data));
        })
        .catch((err) => console.error("Error actualizando info de usuario:", err));
    }
  }, [token]);

  // Helper para armar la URL de la imagen (igual que en tu perfil)
const getAvatarUrl = (avatar) => {
    if (!avatar) return "https://cdn-icons-png.flaticon.com/512/847/847969.png"; 
    // Si empieza con http o https, es una URL externa (como Google o CDN)
    if (avatar.startsWith("http")) return avatar;
    // Si viene del backend storage
    if (avatar.startsWith("/storage")) return `http://127.0.0.1:8000${avatar}`;
    // Si es una ruta relativa (ej: /avatars/Avatar1.png)
    return avatar; 
  };

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
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            {/* 1. Icono (Círculo) */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#91B088]/20 shadow-sm overflow-hidden">
              <img
                src={logoIcono}
                alt="Logo Icono"
                className="w-full h-full object-contain "
              />
            </div>

            {/* 2. Nombre (Horizontal) */}
            <div className="flex items-center">
              <img
                src={logoTexto}
                alt="Welltrack"
                // Ajusta 'h-8' o 'h-10' según el tamaño que prefieras para el texto
                className="h-10 w-auto object-contain transition-all"
              />
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

            <div
              onClick={() => navigate("/perfil")}
              className="w-12 h-12 rounded-full bg-[#F1EADE]/50 dark:bg-[#1c1c1c]/50
                         shadow-md backdrop-blur-lg cursor-pointer overflow-hidden
                         hover:ring-2 hover:ring-[#91B088] transition-all flex items-center justify-center"
            >
              {usuario ? (
                <img 
                  src={getAvatarUrl(usuario.avatar)} 
                  alt="Perfil"
                  className="w-full h-full rounded-full border-2 border-[#719966] object-cover" // object-cover es CLAVE para que no se deforme
                  onError={(e) => {
                    // Fallback por si la imagen falla al cargar
                    e.target.onerror = null; 
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                  }}
                />
              ) : (
                <span className="text-[#5A534A] dark:text-white font-semibold text-xl">
                  👤
                </span>
              )}
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
          menuOpen
            ? "bg-black/40 backdrop-blur-sm visible"
            : "bg-black/0 invisible"
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
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <Home className="w-5 h-5" />
            Inicio
          </button>

          <button
            onClick={() => {
              navigate("/registro-diario");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <Edit3 className="w-5 h-5" />
            Registro diario
          </button>

          <button
            onClick={() => {
              navigate("/habitosIntegrado");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <ListChecks className="w-5 h-5" />
            Hábitos
          </button>

          <button
            onClick={() => {
              navigate("/planner");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                    text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <Calendar className="w-5 h-5" />
            Planner
          </button>

          <button
            onClick={() => {
              navigate("/pomodoro");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                  text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <Timer className="w-5 h-5" />
            Pomodoro
          </button>

          <button
            onClick={() => {
              navigate("/comunidad");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <Users className="w-5 h-5" />
            Comunidad
          </button>

          <button
            onClick={() => {
              navigate("/ayuda");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <HelpCircle className="w-5 h-5" />
            Ayuda
          </button>

          <button
            onClick={() => {
              navigate("/perfil");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left px-4 py-2 rounded-xl 
                text-[#5A534A] hover:bg-[#91B088]/20 transition"
          >
            <User className="w-5 h-5" />
            Mi Perfil
          </button>

          {/* Cerrar sesión */}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
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
      {/* <motion.footer
        className="text-center text-sm text-gray-500 py-4 bg-white border-t"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        © 2025 Welltrack — Todos los derechos reservados 🌿
      </motion.footer> */}

      
      {/* Footer estándar sin propiedades de animación */}
      {/* FOOTER CORREGIDO */}
      {/* Quitamos 'fixed bottom-0 left-0 z-40'. 
          Ahora es un bloque normal que va AL FINAL del scroll. */}
      {/* FOOTER CON TU PALETA DE COLORES */}
      <footer className="bg-[#F1EADE] text-[#5A534A] py-10 px-6 mt-auto w-full transition-colors z-50">
        
        {/* Usamos Flex para poner la imagen a la izquierda y el resto a la derecha en PC */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          
          {/* --- IZQUIERDA: Imagen Grande --- */}
          {/* 'flex-shrink-0' evita que la imagen se aplaste */}
          <div className="flex-shrink-0">
              <img
                src={logoIconoTexto} // Asegúrate de tener esta importación
                alt="Welltrack"
                // Aumenté el tamaño a h-24 (mobile) y h-32 (PC) para que se vea grande
                className="h-24 md:h-32 w-auto object-contain transition-all"
              />
          </div>

          {/* --- DERECHA: El resto del contenido en 3 columnas --- */}
          {/* 'flex-grow' hace que ocupe el espacio restante. Mantenemos el grid interno. */}
          <div className="flex-grow grid md:grid-cols-3 gap-8 text-center md:text-left w-full">
            
            {/* Columna 1: Descripción */}
            <div>
              {/* Eliminé la imagen pequeña de aquí porque ya está grande a la izquierda */}
              <h3 className="text-xl font-bold mb-3">¿Que es Welltrack?</h3>
              <p className="text-[#5A534A] text-sm leading-relaxed">
                Tu espacio para mejorar tu bienestar, organizar tus días y
                alcanzar tus metas personales.
                <br />
                <span className="font-semibold italic">Crecé un poco más cada día </span>
              </p>
            </div>

            {/* Columna 2: Enlaces */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Enlaces útiles</h4>
              {/* ATENCIÓN: He dejado el color exacto que me pasaste: text-[#F1EADE].
                  Como el fondo también es #F1EADE, este texto será INVISIBLE hasta pasar el mouse.
              */}
              <ul className="space-y-2 text-[#F1EADE]">
                <li>
                  <a href="/Registro-Diario" className="hover:text-[#5A534A] transition-colors">
                    Registro Diario
                  </a>
                </li>
                <li>
                  <a href="/habitosIntegrado" className="hover:text-[#5A534A] transition-colors">
                    Habitos
                  </a>
                </li>
                <li>
                  <a href="/planner" className="hover:text-[#5A534A] transition-colors">
                    Planner
                  </a>
                </li>
                <li>
                  <a href="/pomodoro" className="hover:text-[#5A534A] transition-colors">
                    Pomodoro
                  </a>
                </li>
                <li>
                  <a href="/comunidad" className="hover:text-[#5A534A] transition-colors">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 3: Redes */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Seguinos</h4>
              <div className="flex justify-center md:justify-start gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  // Restaurados tus estilos originales
                  className="hover:scale-110 hover:text-[#5A534A] transition-all"
                >
                  <FaInstagram size={22} />
                </a>
                <a
                  href="mailto:contacto@welltrack.com"
                  // Restaurados tus estilos originales
                  className="hover:scale-110 hover:text-[#5A534A] transition-all"
                >
                  <FaEnvelope size={22} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  // Restaurados tus estilos originales
                  className="hover:scale-110 hover:text-[#5A534A] transition-all"
                >
                  <FaGithub size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Copyright (Colores originales restaurados) */}
        <div className="border-t border-[#91B088] mt-8 pt-4 text-sm text-center text-[#5A534A]">
          © 2025 Welltrack — Desarrollado por Thiago & Sol 💚
        </div>
      </footer>
    
    </div>
  );
}
