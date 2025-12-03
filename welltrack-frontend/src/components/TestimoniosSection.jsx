import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FaQuoteLeft } from "react-icons/fa6";

export default function TestimoniosCarousel() {
  const testimonios = [
    {
      nombre: "Lucía Fernández",
      texto:
        "Desde que uso Welltrack me organizo mejor y duermo más tranquila. Es como tener un asistente de bienestar personal 🌙",
      foto: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      nombre: "Martín Rojas",
      texto:
        "Al principio lo probé por curiosidad, pero ahora no paso un día sin revisar mis hábitos. ¡Motiva de verdad!",
      foto: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      nombre: "Sofía Ramírez",
      texto:
        "Me encantó el diseño y la simplicidad. Todo es claro, fluido y con una vibra muy positiva. 🌿",
      foto: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
      nombre: "Diego Torres",
      texto:
        "Nunca pensé que una app tan simple pudiera ayudarme tanto a mantener mis rutinas y reducir el estrés diario.",
      foto: "https://randomuser.me/api/portraits/men/58.jpg",
    },
  ];

  const scrollRef = useRef(null);

  // Animación automática del carrusel
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    let autoScroll;

    const startScroll = () => {
      autoScroll = setInterval(() => {
        scrollAmount += 1;
        if (scrollContainer) {
          scrollContainer.scrollLeft += 1;
          // Loop infinito
          if (
            scrollContainer.scrollLeft + scrollContainer.clientWidth >=
            scrollContainer.scrollWidth
          ) {
            scrollContainer.scrollLeft = 0;
            scrollAmount = 0;
          }
        }
      }, 20);
    };

    startScroll();

    // Pausa al pasar el mouse
    scrollContainer.addEventListener("mouseenter", () => clearInterval(autoScroll));
    scrollContainer.addEventListener("mouseleave", startScroll);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-green-50 via-white to-green-50 text-center overflow-hidden">
      <motion.h2
        className="text-3xl md:text-4xl font-extrabold text-green-800 mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Lo que dicen quienes usan Welltrack 💬
      </motion.h2>

      <motion.p
        className="text-gray-600 max-w-xl mx-auto mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Historias reales de usuarios que mejoraron su bienestar día a día.
      </motion.p>

      {/* Carrusel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 py-4 snap-x snap-mandatory"
      >
        {testimonios.map((t, i) => (
          <motion.div
            key={i}
            className="min-w-[300px] md:min-w-[350px] bg-white border border-green-100 rounded-2xl shadow-md p-6 snap-center flex-shrink-0 hover:shadow-lg transition relative"
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <FaQuoteLeft className="absolute top-4 left-4 text-green-200 text-3xl" />
            <img
              src={t.foto}
              alt={t.nombre}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-green-100 object-cover"
            />
            <p className="text-gray-700 italic mb-4 leading-relaxed">
              “{t.texto}”
            </p>
            <p className="text-green-800 font-semibold">{t.nombre}</p>
          </motion.div>
        ))}
      </div>

      {/* Ocultar scroll nativo */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
