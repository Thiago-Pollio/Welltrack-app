import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaGlobe,
  FaGithub,
} from "react-icons/fa6";
import FAQSection from "../components/FAQSection";
import TestimoniosSection from "../components/TestimoniosSection";
import BotonVolverArriba from "../components/BotonVolerArriba";

export default function Landing() {
  const navigate = useNavigate();
  const [frase, setFrase] = useState("");
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Inicializar AOS
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  // Simular datos fijos
  useEffect(() => {
    setTimeout(() => {
      setFrase("Cada día es una nueva oportunidad 🌞");
      setEstadisticas({
        usuarios: 4821,
        habitos: 15432,
        registros_habito: 92387,
      });
      setLoading(false);
    }, 800);
  }, []);

  // Loader
  // Dentro de Landing.jsx (antes del return principal)

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 flex flex-col justify-center items-center bg-gradient-to-b from-green-100 to-white text-green-800 z-[9999] overflow-hidden"
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="flex flex-col items-center"
          >
            <motion.img
              src="/src/assets/logo-solo.png"
              alt="Logo Welltrack"
              className="w-20 h-20 mb-6"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            />
            <motion.p
              className="text-lg font-semibold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Cargando bienestar... 🌿
            </motion.p>
          </motion.div>

          {/* 🍃🌿🍂 Hojas mixtas cayendo con viento */}
          {Array.from({ length: 18 }).map((_, i) => {
            const emojis = ["🍃", "🌿", "🍂"];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            const colorSet = [
              "#65a30d",
              "#4ade80",
              "#16a34a",
              "#d97706",
              "#b45309",
            ];

            return (
              <motion.div
                key={`leaf-${i}-${Math.random()}`}
                className="absolute select-none"
                initial={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 100}px`,
                  rotate: Math.random() * 360,
                  opacity: 0.9,
                }}
                animate={{
                  y: ["0vh", "120vh"],
                  x: [0, Math.random() * 180 - 90, Math.random() * 120 - 60],
                  rotate: [0, 90, 180, 270, 360],
                  opacity: [0.9, 0.7, 0.9],
                }}
                transition={{
                  duration: 1 + Math.random() * 1.5, // 🌪️ caída rápida (1–2.5s)
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 1,
                  ease: "easeInOut",
                }}
                style={{
                  fontSize: `${20 + Math.random() * 14}px`,
                  color: colorSet[Math.floor(Math.random() * colorSet.length)],
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.15))",
                }}
              >
                {emoji}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white text-[#14532D] font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <header className="flex justify-between items-center py-5 px-8 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <h1 className="text-2xl font-bold text-green-700">🌿 Welltrack</h1>
        <div className="flex gap-4">
          {token ? (
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Ir al inicio
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-green-700 font-medium hover:underline"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => navigate("/registro")}
                className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </header>

      {/* HERO */}
      <motion.section
        className="pt-40 text-center bg-gradient-to-b from-green-600 via-green-200 to-white pb-24 px-6"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        id="inicio"
      >
        <motion.h2
          className="text-5xl font-extrabold text-green-900 mb-6"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          
        >
          Tu bienestar, cada día más simple
        </motion.h2>

        <motion.p
          className="text-lg text-gray-700 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Organizá tus hábitos, planificá tu día y registrá tu estado de ánimo
          con una interfaz moderna e intuitiva.
        </motion.p>

        {estadisticas && (
          <motion.div
            className="flex justify-center gap-10 mb-6 text-green-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold">
                <CountUp end={estadisticas.usuarios} duration={3} suffix="+" />
              </p>
              <p className="text-sm text-green-800">Usuarios activos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                <CountUp end={estadisticas.habitos} duration={3} suffix="+" />
              </p>
              <p className="text-sm text-green-800">Hábitos registrados</p>
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => navigate(token ? "/home" : "/register")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-800 transition"
          >
            {token ? "Ir al inicio" : "Comenzar ahora"}
          </motion.button>

          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition"
          >
            Ver demo
          </motion.button>
        </motion.div>

        <motion.p
          className="italic text-green-900 mt-10 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          “{frase}”
        </motion.p>
      </motion.section>

      {/* BLOQUES CON ANIMACIONES DISTINTAS */}
      {[
        {
          titulo: "Registro diario de bienestar",
          texto:
            "Anotá cómo te sentís y qué te gustaría mejorar. Welltrack te ayuda a mantener una visión clara de tu bienestar general.",
          color: "bg-green-50",
          img: "📘",
          anim: "fade-right",
        },
        {
          titulo: "Planner inteligente",
          texto:
            "Planificá tus metas y eventos con un calendario dinámico y flexible. Mantené el equilibrio entre productividad y bienestar.",
          color: "bg-white",
          img: "📅",
          anim: "zoom-in",
        },
        {
          titulo: "Seguimiento de hábitos",
          texto:
            "Medí tu progreso y mantené la constancia con estadísticas, rachas y recordatorios motivacionales.",
          color: "bg-green-50",
          img: "🌿",
          anim: "fade-left",
        },
      ].map((b, i) => (
        <motion.section
          key={i}
          data-aos={b.anim}
          className={`grid md:grid-cols-2 gap-10 items-center px-10 py-20 ${b.color}`}
          id="funciones"
        >
          {/* alternar orden según par/impar */}
          <div className={`${i % 2 === 1 ? "md:order-2" : ""}`}>
            <h3 className="text-3xl font-bold mb-4">{b.titulo}</h3>
            <p className="text-gray-700 leading-relaxed">{b.texto}</p>
          </div>
          <div
            className={`flex justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-80 h-56 rounded-2xl shadow-inner flex items-center justify-center bg-green-200 text-green-900 font-bold text-3xl"
            >
              {b.img}
            </motion.div>
          </div>
        </motion.section>
      ))}

      <section
        className="py-20 bg-gradient-to-b from-white to-green-50 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          Usá Welltrack donde quieras 🌍
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-10">
          Tu bienestar te acompaña a todos lados. Accedé desde cualquier
          dispositivo, sin descargas.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md w-48 hover:scale-105 transition">
            <img
              src="/src/assets/devices/phone.png"
              alt="Celular"
              className="mx-auto w-12 mb-2"
            />
            <p className="text-green-700 font-semibold">Celular</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-48 hover:scale-105 transition">
            <img
              src="/src/assets/devices/tablet.png"
              alt="Tablet"
              className="mx-auto w-12 mb-2"
            />
            <p className="text-green-700 font-semibold">Tablet</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-48 hover:scale-105 transition">
            <img
              src="/src/assets/devices/laptop.png"
              alt="Notebook"
              className="mx-auto w-12 mb-2"
            />
            <p className="text-green-700 font-semibold">Notebook</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md w-48 hover:scale-105 transition">
            <img
              src="/src/assets/devices/desktop.png"
              alt="PC"
              className="mx-auto w-12 mb-2"
            />
            <p className="text-green-700 font-semibold">PC</p>
          </div>
        </div>
      </section>

      <motion.section
        className="text-center py-16 bg-gradient-to-r from-green-600 to-green-400 text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-3xl font-bold mb-4">¿Listo para empezar?</h3>
        <p className="mb-6 text-lg">
          Registrate gratis y empezá a construir tus hábitos hoy mismo.
        </p>
        <button
          onClick={() => navigate(token ? "/home" : "/register")}
          className="bg-white text-green-700 px-10 py-3 rounded-full font-semibold hover:bg-green-100 transition"
        >
          Crear cuenta
        </button>
      </motion.section>

      <BotonVolverArriba />

      {/* SOBRE NOSOTROS */}
      <motion.section
        className="px-10 py-20 bg-gradient-to-b from-green-100 to-white text-center md:text-left"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        id="sobre-nosotros"
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Fotos */}
          <motion.div
            data-aos="zoom-in-up"
            className="flex justify-center md:justify-start gap-6"
          >
            {/* Integrante 1 */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center group relative"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-green-200 transition-all duration-300 group-hover:shadow-[0_0_25px_5px_rgba(34,197,94,0.5)]">
                <img
                  src="/src/assets/logo.png" // 🖼️ reemplazá con tu imagen
                  alt="Thiago"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay con redes */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4 text-white text-2xl">
                    <a
                      href="https://www.instagram.com/tlp15tm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-300 transition"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/thiagopollio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-300 transition"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
              <motion.p
                className="mt-3 text-green-900 font-semibold text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Thiago Pollio
              </motion.p>
              <p className="text-gray-600 text-sm">
                Desarrollador & Diseñador UX
              </p>
            </motion.div>

            {/* Integrante 2 */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center group relative"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-green-200 transition-all duration-300 group-hover:shadow-[0_0_25px_5px_rgba(34,197,94,0.5)]">
                <img
                  src="/src/assets/logo.png" // 🖼️ reemplazá con tu imagen
                  alt="Sol"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay con redes */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4 text-white text-2xl">
                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-300 transition"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-300 transition"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
              <motion.p
                className="mt-3 text-green-900 font-semibold text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Sol Salgado
              </motion.p>
              <p className="text-gray-600 text-sm">
                Diseñadora & Gestora de Contenido
              </p>
            </motion.div>
          </motion.div>

          {/* Texto */}
          <motion.div
            data-aos="fade-left"
            className="flex flex-col justify-center text-green-900"
          >
            <h3 className="text-3xl font-bold mb-4">Quiénes somos 🌿</h3>
            <p className="text-gray-700 mb-3 leading-relaxed">
              Somos{" "}
              <span className="font-semibold text-green-700">Thiago y Sol</span>
              , dos personas apasionadas por el bienestar, la organización y la
              tecnología. Creamos{" "}
              <span className="font-semibold text-green-700">Welltrack</span>{" "}
              con la idea de hacer más fácil cuidar de uno mismo cada día.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nuestro objetivo es ofrecer una experiencia simple, moderna y
              motivadora, ayudando a cada usuario a construir hábitos positivos
              y seguir su progreso de forma clara y equilibrada.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <section className="px-6 py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-green-800 text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ¿Quiénes somos? 🌿
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Miembro 1 */}
            <motion.div
              className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="\src\assets\logo.png"
                  alt="Integrante 1"
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800">Thiago</h3>
                  <p className="text-sm text-green-700/80">
                    Frontend & UI—creo experiencias limpias y útiles.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Apasionado por la intersección entre bienestar y tecnología. En
                Welltrack cuido la estética, la accesibilidad y la performance.
              </p>

              <div className="flex items-center gap-4 text-green-700">
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaXTwitter className="text-2xl" />
                </a>
                <a
                  href="https://welltrack.app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaGlobe className="text-2xl" />
                </a>
              </div>
            </motion.div>

            {/* Miembro 2 */}
            <motion.div
              className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/src/assets/logo.png"
                  alt="Integrante 2"
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-green-800">Sol</h3>
                  <p className="text-sm text-green-700/80">
                    Backend & Producto—datos, APIs y foco en el valor.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Me encanta transformar ideas en funcionalidades simples y
                estables. Trabajo en autenticación, planner y métricas de
                hábitos.
              </p>

              <div className="flex items-center gap-4 text-green-700">
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaXTwitter className="text-2xl" />
                </a>
                <a
                  href="https://welltrack.app"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-green-500"
                >
                  <FaGlobe className="text-2xl" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQSection  />

      <TestimoniosSection />

      {/* CTA FINAL */}
      <motion.section
        className="text-center py-16 bg-gradient-to-r from-green-600 to-green-400 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold mb-4">Empezá gratis hoy</h3>
        <p className="mb-8 text-lg">
          Creá tu cuenta en minutos y descubrí todas las funciones de Welltrack.
        </p>
        <button
          onClick={() => navigate(token ? "/home" : "/registro")}
          className="bg-white text-green-700 px-10 py-3 rounded-full font-semibold hover:bg-green-100 transition"
        >
          Crear cuenta
        </button>
      </motion.section>

      <motion.footer
        className="text-center text-sm text-gray-500 py-4 bg-white border-t"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        © 2025 Welltrack — Todos los derechos reservados 🌿
      </motion.footer>

      <motion.footer
        className="bg-green-700 text-white py-10 px-6 mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Columna 1 */}
          <div>
            <h3 className="text-2xl font-bold mb-3">🌿 Welltrack</h3>
            <p className="text-green-100 text-sm leading-relaxed">
              Tu espacio para mejorar tu bienestar, organizar tus días y
              alcanzar tus metas personales.
              <br />
              Crecé un poco más cada día 🌱
            </p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Enlaces útiles</h4>
            <ul className="space-y-2 text-green-100">
              <li>
                <a href="#funciones" className="hover:text-white transition">
                  Funciones
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a
                  href="#sobre-nosotros"
                  className="hover:text-white transition"
                >
                  Quiénes somos
                </a>
              </li>
              <li>
                <a href="#inicio" className="hover:text-white transition">
                  Volver arriba
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Seguinos</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="mailto:contacto@welltrack.com"
                className="hover:scale-110 transition-transform"
              >
                
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-transform"
              >
                <FaGithub size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-500 mt-8 pt-4 text-sm text-center text-green-200">
          © 2025 Welltrack — Desarrollado por Thiago & Sol 💚
        </div>
      </motion.footer>
    </div>
  );
}
