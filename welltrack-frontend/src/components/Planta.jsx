import { motion } from "framer-motion";

export default function GrowingPlant({ progress }) {
  const pct = Math.min(Math.max(progress, 0), 100);

  // Elegir imagen según progreso
  let stage = 1;
  if (pct >= 80) stage = 5;
  else if (pct >= 60) stage = 4;
  else if (pct >= 40) stage = 3;
  else if (pct >= 20) stage = 2;

  const imgSrc = `/Plantas/Fase${stage}.png`;

  // Movimiento de balanceo continuo
  const swayAnimation = {
    rotate: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Pulso suave (latido)
  const pulseAnimation = {
    scale: [1, 1.04, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Glow que aparece solo cuando queda poco para terminar (95–100%)
  const glow = pct >= 95 ? "drop-shadow-[0_0_8px_#22c55e80]" : "";

  return (
    <motion.div
      key={stage} // fuerza animación al cambiar de planta
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center mt-6"
    >
      <motion.img
        src={imgSrc}
        alt="Planta creciendo"
        className={`w-28 h-28 md:w-32 md:h-32 ${glow}`}
        animate={{
          ...swayAnimation,
          ...pulseAnimation,
        }}
      />
    </motion.div>
  );
}