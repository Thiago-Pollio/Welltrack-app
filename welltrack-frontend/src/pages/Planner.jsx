import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PanelNotas from "../components/PanelNotas";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventoModal from "../components/EventoModal";
import { useEventos } from "../context/EventosContext";
import EtiquetaFilter from "../components/EtiquetaFilter";

import esLocale from '@fullcalendar/core/locales/es';

// === ICONOS LUCIDE ===
import {
  Smile,
  SmilePlus,
  Meh,
  Frown,
  Angry,
  AlertTriangle,
  Moon,
  HelpCircle,
  Ban,
  CheckCircle,
  Sparkles
} from "lucide-react";

import { renderToString } from "react-dom/server";

export default function Planner() {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const { eventos, setEventos } = useEventos();
  const [modalEvento, setModalEvento] = useState({
    abierto: false,
    evento: null,
    diaSeleccionado: null,
  });
  const [filtroEtiqueta, setFiltroEtiqueta] = useState("todas");

  // ==================== SESIÓN ====================
  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioActual");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ==================== CARGAR EVENTOS ====================
  useEffect(() => {
    if (!token) return;

    const fetchEventos = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/eventos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar eventos");
        const data = await res.json();
        setEventos(
          data.map((e) => ({
            idEvento: e.idEvento,
            title: e.titulo,
            start: e.fecha_inicio,
            end: e.fecha_fin,
            backgroundColor: e.color,
            borderColor: e.color,
            extendedProps: {
              descripcion: e.descripcion,
              etiqueta: e.etiqueta,
              color: e.color,
            },
          }))
        );
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    fetchEventos();
  }, [token]);

  // ==================== MODAL ====================
  const abrirModal = (evento = null, diaSeleccionado = null) => {
    setModalEvento({ abierto: true, evento, diaSeleccionado });
  };

  const cerrarModal = () => {
    setModalEvento({ abierto: false, evento: null, diaSeleccionado: null });
  };

  // ==================== GUARDAR / ELIMINAR ====================
  const guardarEvento = (evento) => {
    setEventos((prev) => {
      if (evento.eliminar) {
        return prev.filter((e) => e.idEvento !== evento.idEvento);
      }
      const sinEl = prev.filter((e) => e.idEvento !== evento.idEvento);

      return [
        ...sinEl,
        {
          idEvento: evento.idEvento,
          title: evento.titulo,
          start: evento.fecha_inicio,
          end: evento.fecha_fin,
          backgroundColor: evento.color,
          borderColor: evento.color,
          color: evento.color,
          extendedProps: {
            descripcion: evento.descripcion,
            etiqueta: evento.etiqueta,
            color: evento.color,
          },
        },
      ];
    });
  };

  // ==================== REGISTRO DIARIO ====================
  const [registroDiario, setRegistroDiario] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchRegistro = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/registro-diario", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setRegistroDiario(Array.isArray(data.registros) ? data.registros : []);

      } catch (err) {
        console.error("Error al cargar registro diario:", err);
        setRegistroDiario([]);
      }
    };

    fetchRegistro();
  }, [token]);

  // === MAPA ESTADO -> ICONO SVG ===
  const estadoAnimoToIcon = {
    "Feliz": renderToString(<Smile size={18} strokeWidth={2} />),
    "Bien": renderToString(<SmilePlus size={18} strokeWidth={2} />),
    "Indiferente": renderToString(<Meh size={18} strokeWidth={2} />),
    "Triste": renderToString(<Frown size={18} strokeWidth={2} />),
    "Enojo": renderToString(<Angry size={18} strokeWidth={2} />),
    "Ansiedad": renderToString(<AlertTriangle size={18} strokeWidth={2} />),
    "Apática": renderToString(<Moon size={18} strokeWidth={2} />),
    "Insegura": renderToString(<HelpCircle size={18} strokeWidth={2} />),
    "Irritable": renderToString(<Ban size={18} strokeWidth={2} />),
    "Seguridad": renderToString(<CheckCircle size={18} strokeWidth={2} />),
    "Entusiasmo": renderToString(<Sparkles size={18} strokeWidth={2} />),
    "Sensible": renderToString(<Frown size={18} strokeWidth={2} />),
  };

  const registrosPorFecha = {};

  registroDiario.forEach((reg) => {
    if (!reg.fecha || !reg.estadoAnimo) return;

    const primerEstado = reg.estadoAnimo.split(",")[0].trim();
    const iconSvg = estadoAnimoToIcon[primerEstado];

    if (iconSvg) {
      registrosPorFecha[reg.fecha] = iconSvg;
    }
  });

  // ==================== SIN SESIÓN ====================
  if (!usuario || !token) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-600 text-center">
          <h2 className="text-3xl font-semibold mb-2 text-green-700">
            Debes iniciar sesión
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PanelNotas
        abierto={panelAbierto}
        usuario={usuario}
        token={token}
        onToggle={() => setPanelAbierto(!panelAbierto)}
      />

      <div className="fixed inset-0 w-full h-full bg-[#F9F7F2] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        Poner texto

        <div className="flex flex-col lg:flex-row gap-10 justify-center">

          {/* Calendario */}
          <div className="flex-1 bg-[#F1EADE] border border-[#E8DCC9] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-semibold text-[#5A534A] mb-6">
              Calendario
            </h3>

            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              events={
                filtroEtiqueta === "todas"
                  ? eventos
                  : eventos.filter(
                      (e) => e.extendedProps.etiqueta === filtroEtiqueta
                    )
              }
              height="calc(130vh - 350px)"
              selectable={true}
              eventClick={(info) => {
                const eventoEncontrado = eventos.find(
                  (e) => e.idEvento === parseInt(info.event.id)
                );
                if (eventoEncontrado)
                  abrirModal({ ...eventoEncontrado, modo: "detalle" }, null);
              }}
              select={(selectionInfo) => {
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                const dia = new Date(selectionInfo.start);
                dia.setHours(0, 0, 0, 0);

                if (dia < hoy) {
                  alert("No podés agregar eventos en días pasados.");
                  return;
                }

                abrirModal(null, selectionInfo.start);
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              buttonText={{
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
              }}

              dayCellDidMount={(info) => {
  info.el.style.position = "relative";
}}

              
              dayCellContent={(arg) => {
  const fechaStr = arg.date.toISOString().split("T")[0];
  const iconSvg = registrosPorFecha[fechaStr];

  return {
    html: `
      <div class="dia-contenedor">
        <span>${arg.dayNumberText}</span>
        ${
          iconSvg
            ? `<span style="
                position:absolute;
                right:4px;
                top:4px;
                width:18px;
                height:18px;
              ">${iconSvg}</span>`
            : ""
        }
      </div>
    `
  };
}}

            />
          </div>

          {/* Próximos eventos */}
          <aside className="w-full lg:w-[350px] flex-shrink-0 bg-[#F1EADE] border border-[#E8DCC9] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-semibold text-[#5A534A] mb-5 text-center">
              Próximos eventos
            </h3>
            <EtiquetaFilter 
              filtroEtiqueta={filtroEtiqueta} 
              setFiltroEtiqueta={setFiltroEtiqueta} 
            />

            {eventos.length === 0 ? (
              <p className="text-[#7A7266] text-sm text-center mt-6">
                No hay eventos programados
              </p>
            ) : (
              <ul className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#CBB89D] scrollbar-track-[#F1EADE]">
                {eventos
                  .filter((e) =>
                    filtroEtiqueta === "todas"
                      ? true
                      : e.extendedProps.etiqueta === filtroEtiqueta
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.start).getTime() - new Date(b.start).getTime()
                  )
                  .map((e) => (
                    <li
                      key={e.idEvento}
                      className="p-3 rounded-xl border border-[#E8DCC9] bg-[#FFFDF9] hover:bg-[#F6F0E6] hover:border-[#91B088] transition-all duration-200 cursor-pointer shadow-sm"
                      onClick={() => abrirModal({ ...e, modo: "detalle" })}
                    >
                      <h4 className="font-semibold text-[#5A534A] text-sm">
                        {e.title}
                      </h4>
                      <p className="text-xs text-[#7A7266]">
                        {new Date(e.start).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </aside>
        </div>

        {/* Modal */}
        {modalEvento.abierto && (
          <EventoModal
            token={token}
            evento={modalEvento.evento}
            diaSeleccionado={modalEvento.diaSeleccionado}
            onClose={cerrarModal}
            onGuardar={guardarEvento}
          />
        )}
      </div>
    </Layout>
  );
}