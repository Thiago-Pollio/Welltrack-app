
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'

import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Home from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
