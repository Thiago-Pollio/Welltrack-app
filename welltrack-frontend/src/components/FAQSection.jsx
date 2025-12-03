import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaChevronDown, FaLeaf, FaHeart } from "react-icons/fa6";


export default function FAQSection() {
  const preguntas = [
    {
      q: "¿Welltrack es gratis?",
      a: "Sí 🌿. Podés registrarte y usar las funciones principales sin costo: planner, hábitos y registro diario.",
    },
    {
      q: "¿Puedo usar Welltrack desde el celular?",
      a: "Sí, está pensada para funcionar desde cualquier dispositivo —solo necesitás conexión a internet.",
    },
    {
      q: "¿Qué tipo de datos guarda Welltrack?",
      a: "Solo lo esencial: tus hábitos, tus registros y tu usuario. Nunca compartimos ni vendemos datos.",
    },
    {
      q: "¿Puedo editar o eliminar mis hábitos?",
      a: "Claro. Podés crear, editar o eliminar hábitos cuando quieras, sin perder tu progreso anterior.",
    },
    {
      q: "¿Quiénes desarrollaron Welltrack?",
      a: "Thiago y Sol 💚 —dos estudiantes apasionados por la tecnología, el bienestar y las buenas experiencias digitales.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
<section id="faq" className="relative py-20 px-6 overflow-hidden animate-bgSmooth">
  {/* Fondo decorativo */}
  <div className="absolute inset-0 -z-10 opacity-35">
    <div className="absolute w-[500px] h-[500px] bg-green-300/30 rounded-full blur-3xl top-16 left-[-200px] animate-pulse-slow"></div>
    <div className="absolute w-[450px] h-[450px] bg-yellow-200/20 rounded-full blur-2xl bottom-10 right-[-150px] animate-pulse-slower"></div>
    <FaLeaf className="absolute top-20 right-24 text-green-300 text-7xl opacity-20 animate-float" />
    <FaHeart className="absolute bottom-20 left-24 text-green-400 text-6xl opacity-20 animate-float-delayed" />
  </div>

  <div className="max-w-3xl mx-auto text-center mb-10">
    <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-3">
      Preguntas frecuentes 🌿
    </h2>
    <p className="text-gray-600">
      Todo lo que querías saber sobre Welltrack, en un solo lugar.
    </p>
  </div>

  <div className="max-w-2xl mx-auto space-y-4">
    {preguntas.map((item, i) => (
      <motion.div
        key={i}
        className="bg-white/80 backdrop-blur-sm border border-green-100 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
        onClick={() => toggle(i)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center p-4">
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
              className="px-4 pb-4 text-gray-700 text-left"
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

  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    .animate-float { animation: float 7s ease-in-out infinite; }
    .animate-float-delayed { animation: float 9s ease-in-out infinite 2s; }
    .animate-pulse-slow { animation: pulse 6s ease-in-out infinite; }
    .animate-pulse-slower { animation: pulse 10s ease-in-out infinite; }

    /* Fondo animado más fluido */
    @keyframes bgSmooth {
      0% { background: linear-gradient(120deg, #ecfdf5, #fefce8); }
      25% { background: linear-gradient(120deg, #dcfce7, #fef9c3); }
      50% { background: linear-gradient(120deg, #bbf7d0, #fde68a); }
      75% { background: linear-gradient(120deg, #d9f99d, #fef3c7); }
      100% { background: linear-gradient(120deg, #ecfdf5, #fefce8); }
    }
    .animate-bgSmooth {
      background-size: 300% 300%;
      animation: bgSmooth 60s ease-in-out infinite;
      transition: background 3s ease-in-out;
    }
  `}</style>
</section>


  );
}

