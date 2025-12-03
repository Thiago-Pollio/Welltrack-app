import { createContext, useContext, useState } from "react";

const EventosContext = createContext();

export const useEventos = () => useContext(EventosContext);

export const EventosProvider = ({ children }) => {
  const [eventos, setEventos] = useState([]);

  return (
    <EventosContext.Provider value={{ eventos, setEventos }}>
      {children}
    </EventosContext.Provider>
  );
};