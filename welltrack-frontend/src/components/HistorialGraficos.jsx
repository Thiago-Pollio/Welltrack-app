// src/components/HistorialGraficos.jsx
// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Line } from "recharts";

// export default function HistorialGraficos({ historial }) {
//   const [datos, setDatos] = useState([]);

//   useEffect(() => {
//     if (!historial || historial.length === 0) return;

//     const hoy = new Date();
//     const ultimos7 = historial
//       .filter(r => {
//         const fecha = new Date(r.fecha);
//         const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
//         return diff <= 7;
//       })
//       .slice(-7)
//       .map(r => ({
//         fecha: new Date(r.fecha).toLocaleDateString("es-AR"),
//         sueño: r.horasSueño || 0,
//         agua: r.aguaTomada || 0,
//         estres: r.estresNivel || 5,
//       }));

//     setDatos(ultimos7);
//   }, [historial]);

//   if (!datos || datos.length === 0)
//     return <p className="text-center text-gray-500">No hay registros para mostrar gráficos.</p>;

//   return (
//     <div className="space-y-8 mt-6">
//       {/* Gráfico de Sueño */}
//       <div className="bg-gray-50 rounded-3xl p-6 shadow-sm">
//         <h3 className="text-lg font-semibold mb-2 text-center">Horas de Sueño 🛌</h3>
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart data={datos} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
//             <CartesianGrid  strokeDasharray="3 3" />
//             <XAxis dataKey="fecha" />
//             <YAxis />
//             <Tooltip
//   contentStyle={{
//     backgroundColor: "#F7F5EF",
//     border: "1px solid #E8E0D2",
//     borderRadius: "10px",
//   }}
// />

//             <Legend />
            
//             <Bar dataKey="sueño" fill="#FACC15" />
//           </BarChart>
          

//         </ResponsiveContainer>
//       </div>

//       {/* Gráfico de Agua */}
//       <div className="bg-gray-50 rounded-3xl p-6 shadow-sm">
//         <h3 className="text-lg font-semibold mb-2 text-center">Agua 💧</h3>
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart data={datos} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="fecha" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="agua" fill="#3B82F6" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Gráfico de Estrés */}
//       <div className="bg-gray-50 rounded-3xl p-6 shadow-sm">
//         <h3 className="text-lg font-semibold mb-2 text-center">Estrés 😓</h3>
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart data={datos} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="fecha" />
//             <YAxis domain={[0, 10]} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="estres" fill="#EF4444" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function HistorialGraficos({ historial }) {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    if (!historial || historial.length === 0) return;

    const hoy = new Date();
    const ultimos7 = historial
      .filter((r) => {
        const fecha = new Date(r.fecha);
        const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      })
      .slice(-7)
      .map((r) => ({
        fecha: new Date(r.fecha).toLocaleDateString("es-AR"),
        sueño: r.horasSueño || 0,
        agua: r.aguaTomada || 0,
        estres: r.estresNivel || 5,
      }));

    setDatos(ultimos7.reverse());
  }, [historial]);

  if (!datos || datos.length === 0)
    return (
      <p className="text-center text-gray-500">
        No hay registros para mostrar gráficos.
      </p>
    );

  return (
    <div className="space-y-10 mt-6">

      {/* ========== HORAS DE SUEÑO ========== */}
      <div className="p-6 rounded-3xl shadow-md border border-[#E8E0D2] bg-[#F7F5EF]">
        <h3 className="text-lg font-semibold text-[#3B7A55] flex items-center gap-2 mb-1">
          🌙 Horas de sueño
        </h3>
        <p className="text-xs text-[#6C6657] mb-4">Últimos 7 días</p>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E8E0D2" strokeDasharray="3 3" />
            <XAxis dataKey="fecha" tick={{ fill: "#3B7A55", fontSize: 12 }} />
            <YAxis tick={{ fill: "#3B7A55", fontSize: 12 }} />
            <Tooltip
  contentStyle={{
    backgroundColor: "#F7F5EF",
    border: "1px solid #E8DFC8",
    borderRadius: "12px",
    padding: "10px 12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  }}
  labelStyle={{ color: "#3B7A55", fontWeight: 600 }}
/>

            <Line
              type="monotone"
              dataKey="sueño"
              stroke="#6C9B72"
              strokeWidth={4}
              dot={{ r: 5, fill: "#6C9B72" }}
            />
          </LineChart>
          {/* <Bar dataKey="sueño" fill="#FACC15" radius={[6, 6, 0, 0]} animationDuration={900} /> */}

        </ResponsiveContainer>
      </div>

      {/* ========== AGUA ========= */}
      <div className="p-6 rounded-3xl shadow-md border border-[#E8E0D2] bg-[#F7F5EF]">
        <h3 className="text-lg font-semibold text-[#2B2417] flex items-center gap-2 mb-1">
          💧 Consumo de agua
        </h3>
        <p className="text-xs text-[#6C6657] mb-4">Últimos 7 días</p>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E8E0D2" strokeDasharray="3 3" />
            <XAxis dataKey="fecha" tick={{ fill: "#6C6657", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6C6657", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F7F5EF",
                border: "1px solid #E8E0D2",
                borderRadius: "12px",
              }}
            />
            <Bar dataKey="agua" fill="#3B7A55" radius={[12, 12, 12, 12]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========== ESTRÉS ========== */}
      <div className="p-6 rounded-3xl shadow-md border border-[#E8E0D2] bg-[#F7F5EF]">
        <h3 className="text-lg font-semibold text-[#2B2417] flex items-center gap-2 mb-1">
          😓 Estrés estimado
        </h3>
        <p className="text-xs text-[#6C6657] mb-4">Últimos 7 días</p>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={datos} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E8E0D2" strokeDasharray="3 3" />
            <XAxis dataKey="fecha" tick={{ fill: "#6C6657", fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fill: "#6C6657", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F7F5EF",
                border: "1px solid #E8E0D2",
                borderRadius: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="estres"
              stroke="#C26464"
              strokeWidth={4}
              dot={{ r: 5, fill: "#C26464" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   LineChart,
//   Line,
// } from "recharts";

// export default function HistorialGraficos({ historial }) {
//   const [datos, setDatos] = useState([]);
//   const [tab, setTab] = useState("sueno"); // ← NUEVO (tabs)

//   // ====== DATOS ======
//   useEffect(() => {
//     if (!historial || historial.length === 0) return;

//     const hoy = new Date();
//     const ultimos7 = historial
//       .filter((r) => {
//         const fecha = new Date(r.fecha);
//         const diff = (hoy - fecha) / (1000 * 60 * 60 * 24);
//         return diff <= 7;
//       })
//       .slice(-7)
//       .map((r) => ({
//         fecha: new Date(r.fecha).toLocaleDateString("es-AR"),
//         sueño: r.horasSueño || 0,
//         agua: r.aguaTomada || 0,
//         estres: r.estresNivel || 5,
//       }));

//     setDatos(ultimos7.reverse());
//   }, [historial]);

//   if (datos.length === 0)
//     return (
//       <p className="text-center text-gray-500">
//         No hay registros para mostrar gráficos.
//       </p>
//     );

//   // ====== ESTILOS BASE ======
//   const cardStyle =
//     "p-6 rounded-3xl shadow-md border border-[#E8E0D2] bg-[#F7F5EF] animate-fadeIn";

//   const iconSize = "w-6 h-6 object-contain opacity-80";

//   // ===== ICONOS (SVG / PNG) =====
//   const ICONS = {
//     sueno: "/Iconos/Luna.svg",
//     agua: "/Iconos/Agua.svg",
//     estres: "/Iconos/Estres.svg",
//   };

//   // ====== HEADER ======
//   const Header = () => (
//     <div className="mb-6 p-5 bg-[#F7F5EF] border border-[#E8E0D2] rounded-3xl shadow flex items-center gap-4">
//       <img src="/Iconos/Dashboard.svg" className="w-12 h-12 opacity-80" />
//       <div>
//         <h2 className="text-xl font-bold text-[#3B7A55]">
//           Dashboard de bienestar
//         </h2>
//         <p className="text-sm text-[#6C6657]">
//           Resumen visual de tus últimos 7 días
//         </p>
//       </div>
//     </div>
//   );

//   // ====== TABS ======
//   const Tabs = () => (
//     <div className="flex gap-2 mb-6">
//       {[
//         { key: "sueno", label: "Sueño" },
//         { key: "agua", label: "Agua" },
//         { key: "estres", label: "Estrés" },
//       ].map((t) => (
//         <button
//           key={t.key}
//           onClick={() => setTab(t.key)}
//           className={`px-4 py-2 rounded-xl text-sm font-medium transition
//             ${
//               tab === t.key
//                 ? "bg-[#3B7A55] text-white shadow"
//                 : "bg-[#F7F5EF] text-[#3B7A55] border border-[#E8E0D2]"
//             }
//           `}
//         >
//           {t.label}
//         </button>
//       ))}
//     </div>
//   );

//   // ====== GRÁFICOS ======
//   const ChartSueño = (
//     <div className={cardStyle}>
//       <div className="flex items-center gap-2 mb-1">
//         <img src={ICONS.sueno} className={iconSize} />
//         <h3 className="text-lg font-semibold text-[#3B7A55]">
//           Horas de sueño
//         </h3>
//       </div>
//       <p className="text-xs text-[#6C6657] mb-4">Últimos 7 días</p>

//       <ResponsiveContainer width="100%" height={220}>
//         <LineChart data={datos}>
//           <CartesianGrid stroke="#E8E0D2" strokeDasharray="3 3" />
//           <XAxis dataKey="fecha" tick={{ fill: "#3B7A55", fontSize: 12 }} />
//           <YAxis tick={{ fill: "#3B7A55", fontSize: 12 }} />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#F7F5EF",
//               border: "1px solid #E8DFC8",
//               borderRadius: "12px",
//               padding: "10px 12px",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//             }}
//             labelStyle={{ color: "#3B7A55", fontWeight: 600 }}
//           />
//           <Line
//             type="monotone"
//             dataKey="sueño"
//             stroke="#6C9B72"
//             strokeWidth={4}
//             dot={{ r: 5, fill: "#6C9B72" }}
//             animationDuration={900}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   const ChartAgua = (
//     <div className={cardStyle}>
//       <div className="flex items-center gap-2 mb-1">
//         <img src={ICONS.agua} className={iconSize} />
//         <h3 className="text-lg font-semibold text-[#2B2417]">
//           Consumo de agua
//         </h3>
//       </div>
//       <p className="text-xs text-[#6C6657] mb-4">Últimos 7 días</p>

//       <ResponsiveContainer width="100%" height={220}>
//         <BarChart data={datos}>
//           <CartesianGrid stroke="#E8E0D2" strokeDasharray="3 3" />
//           <XAxis dataKey="fecha" tick={{ fill: "#6C6657", fontSize: 12 }} />
//           <YAxis tick={{ fill: "#6C6657", fontSize: 12 }} />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#F7F5EF",
//               border: "1px solid #E8E0D2",
//               borderRadius: "12px",
//             }}
//           />
//           <Bar
//             dataKey="agua"
//             fill="#3B7A55"
//             radius={[12, 12, 12, 12]}
//             animationDuration={900}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   const ChartEstres = (
//     <div className={cardStyle}>
//       <div className="flex items-center gap-2 mb-1">
//         <img src={ICONS.estres} className={iconSize} />
//         <h3 className="text-lg font-semibold text-[#2B2417]">
//           Estrés estimado
//         </h3>
//       </div>

//       <p className="text-xs text-[#6C6657] mb-4">Últimos 7 días</p>

//       <ResponsiveContainer width="100%" height={220}>
//         <LineChart data={datos}>
//           <CartesianGrid stroke="#E8E0D2" strokeDasharray="3 3" />
//           <XAxis dataKey="fecha" tick={{ fill: "#6C6657", fontSize: 12 }} />
//           <YAxis domain={[0, 10]} tick={{ fill: "#6C6657", fontSize: 12 }} />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#F7F5EF",
//               border: "1px solid #E8E0D2",
//               borderRadius: "12px",
//             }}
//           />
//           <Line
//             type="monotone"
//             dataKey="estres"
//             stroke="#C27A77"
//             strokeWidth={4}
//             dot={{ r: 5, fill: "#C27A77" }}
//             animationDuration={900}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   // ====== SALIDA ======
//   return (
//     <div className="space-y-6">
//       <Header />
//       <Tabs />

//       {tab === "sueno" && ChartSueño}
//       {tab === "agua" && ChartAgua}
//       {tab === "estres" && ChartEstres}
//     </div>
//   );
// }


