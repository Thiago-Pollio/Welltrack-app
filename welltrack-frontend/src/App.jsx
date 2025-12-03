import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RegistroDiario from "./pages/RegistroDiario";

import PerfilUsuario from "./pages/PerfilUsuario";

import Planner from "./pages/Planner";
import PlannerMini from "./pages/PlannerMini";

import MarcarHabito from "./pages/MarcarHabito";

import Habitos from "./pages/Habitos";
import Landing from "./pages/Landing";
import HabitosPage2 from "./pages/HabitosIntegrado";
import PomodoroPage from "./pages/Pomodoro";
import Comunidad from "./pages/Comunidad";
import PerfilPublico from "./pages/PerfilPublico";
import PostDetalle from "./pages/PostDetalle";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/registro-diario" element={<RegistroDiario />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/planner-mini" element={<PlannerMini />} />
        <Route path="/habitos" element={<Habitos />} />        
        <Route path="/habitos/:id" element={<MarcarHabito />} />
        <Route path="/habitosIntegrado" element={<HabitosPage2 />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />  
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/comunidad/usuario/:idUsuario" element={<PerfilPublico />} /> 
        <Route path="/comunidad/posts/:idPost" element={<PostDetalle />} /> 
              
      </Routes>
    </BrowserRouter>
  );
}

export default App;
