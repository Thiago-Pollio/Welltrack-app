import { motion } from "framer-motion";

const ResumenHabitos = ({ habitos }) => {
  if (!habitos || habitos.length === 0) return null;

  // Si los hábitos tienen historial, combinarlo
 const historial = habitos.flatMap(h => h.historial || []);
  const completados = habitos.filter(h => h.progreso?.cumplido).length;
  const total = habitos.length;
  const porcentaje = Math.round((completados / total) * 100);

  const mensajes = [
    { limite: 0, texto: "¡A empezar el día! 🌞" },
    { limite: 25, texto: "Buen comienzo 💪" },
    { limite: 50, texto: "¡Vas por la mitad! ⚡" },
    { limite: 75, texto: "¡Casi lo lográs! 🌿" },
    { limite: 100, texto: "¡Increíble! 🎉 Completaste todos tus hábitos" },
  ];

  const mensaje =
    mensajes.find((m) => porcentaje <= m.limite)?.texto ||
    mensajes[mensajes.length - 1].texto;

  // Últimos 7 días del historial
  const diasCumplidos = historial
    .slice(-7)
    .map((d) => ({ cumplido: d.cumplido }));

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  console.log("📅 diasCumplidos:", diasCumplidos);

  return (
    <div className="flex flex-col items-center text-center bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-md border border-green-100 mb-8 w-33 max-w-3xl mx-auto">
      {/* 🧭 Donut */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e5f5e0"
            strokeWidth="10"
            fill="transparent"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{
              strokeDasharray: `${(porcentaje / 100) * circumference} ${circumference}`,
            }}
            transition={{ duration: 1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-green-700">
          {porcentaje}%
        </div>
      </div>

      {/* 💬 Texto motivacional */}
      <p className="text-lg text-green-800 font-semibold mb-6">{mensaje}</p>

      {/* 📅 Mini calendario semanal */}
      <div className="flex gap-2 justify-center">
        {diasCumplidos.map((d, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-md transition ${
              d.cumplido
 ? "bg-gradient-to-br from-green-400 to-green-600"
: "bg-gray-200 border border-green-200"
            }`}
          ></div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Últimos 7 días de hábitos 🌿
      </p>
    </div>
  );
};

export default ResumenHabitos;