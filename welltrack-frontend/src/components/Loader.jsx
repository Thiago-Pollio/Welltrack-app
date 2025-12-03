import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ loading }) {
  if (!loading) return null;

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
        {/* 🌿 Logo + texto */}
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

        {/* 🍃 Hojas cayendo */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 100}px`,
              fontSize: `${24 + Math.random() * 12}px`,
            }}
            animate={{
              y: ["-10vh", "120vh"],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              opacity: [0.9, 0.7, 0.9],
            }}
            transition={{
              duration: 2 + Math.random() * 2, // 🔹 más rápido
              delay: Math.random() * 3,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
              ease: "easeInOut",
            }}
          >
            🍃
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}