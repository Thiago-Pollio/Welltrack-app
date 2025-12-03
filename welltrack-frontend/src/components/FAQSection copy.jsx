import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaChevronDown, FaLeaf, FaHeart } from "react-icons/fa6";


export default function FAQSection2() {
  const preguntas = [
    {
      q: "¿Welltrack es gratis?",
      a: "Sí 🌿. Podés registrarte y usar las funciones principales sin costo: planner, hábitos y registro diario.",
    },
    {
      q: "¿Puedo usar Welltrack desde el celular?",
      a: "Totalmente. Está diseñada para adaptarse a cualquier dispositivo, sea móvil, tablet o computadora.",
    },
    {
      q: "¿Qué tipo de datos guarda Welltrack?",
      a: "Solo lo necesario para tu bienestar: tus hábitos, tus registros y tu usuario. Nunca compartimos datos.",
    },
    {
      q: "¿Puedo editar o eliminar mis hábitos?",
      a: "Sí, podés crear, editar o eliminar tus hábitos sin perder tu historial ni tu progreso.",
    },
    {
      q: "¿Quiénes desarrollaron Welltrack?",
      a: "Thiago y Sol 💚 — dos desarrolladores apasionados por el bienestar, la productividad y las buenas experiencias digitales.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <FaLeaf className="absolute top-10 left-12 text-green-300 text-6xl animate-float" />
        <FaHeart className="absolute top-1/3 right-1/4 text-green-300 text-5xl animate-float-slow" />
        <FaHeart className="absolute top-1/3 right-1/4 text-green-300 text-5xl animate-float-slow" />
      </div>

      {/* Contenido principal */}
      <div className="relative max-w-3xl mx-auto text-center mb-10">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-green-800 mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Preguntas frecuentes 🌿
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Todo lo que necesitás saber sobre Welltrack, explicado de forma simple.
        </motion.p>
      </div>

      {/* Preguntas */}
      <div className="relative max-w-2xl mx-auto space-y-4 z-10">
        {preguntas.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => toggle(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center p-5">
              <h3 className="text-green-800 font-semibold text-lg text-left">
                {item.q}
              </h3>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown className="text-green-600" />
              </motion.div>
            </div>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  className="px-5 pb-5 text-gray-700 text-left"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Pequeña animación global */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out infinite 2s; }
        .animate-float-slow { animation: float 9s ease-in-out infinite 1s; }
      `}</style>
    </section>
  );
}
