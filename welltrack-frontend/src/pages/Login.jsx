import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoWelltrack from '../assets/Welltrack-logo.png';

export default function Login() {
  const [formData, setFormData] = useState({
    usuarioEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "usuarioEmail":
        if (!value.trim()) error = "Por favor ingrese su usuario o correo";
        break;
      case "password":
        if (!value.trim()) error = "Por favor ingrese su contraseña";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (message) setMessage(""); 
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usuarioEmail.trim() || !formData.password.trim()) {
      setMessage("Por favor completá todos los campos para continuar.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: formData.usuarioEmail,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 422) {          
          setMessage("El correo electrónico o la contraseña son incorrectos.");
        } else if (response.status === 404) {
          setMessage("No encontramos una cuenta con ese correo.");
        } else if (response.status >= 500) {
          setMessage("Hubo un problema en nuestros servidores. Intentá más tarde.");
        } else {
          setMessage(data.mensaje || "Ocurrió un error inesperado.");
        }
        return;
      }

      localStorage.setItem("usuarioActual", JSON.stringify(data.usuario));
      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      setMessage("No se pudo conectar con el servidor. Revisá tu conexión.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center animate-gradient bg-gradient-to-br from-[#91b088] to-[#57a773] bg-[length:400%_400%]">
      <div className="relative bg-[#E8DCC9] border border-white/40 shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto overflow-hidden max-h-[600px]">

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-2xl" />

        <img
          src={logoWelltrack}
          alt="Welltrack Logo"
          className="mx-auto mb-2 h-16 object-contain drop-shadow-sm"
        />

        <h2 className="text-2xl font-bold text-center mb-4 text-[#5A534A] drop-shadow-sm">
          Iniciar sesión
        </h2>

        {message && (
          <div className="bg-red-100/50 border border-red-200 rounded-lg p-2 mb-4">
             <p className="text-red-700 text-sm text-center font-medium">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
              Usuario o correo electrónico
            </label>
            <input
              type="text"
              name="usuarioEmail"
              value={formData.usuarioEmail}
              onChange={handleChange}
              placeholder="Ej: usuario@correo.com"
              className="w-full border border-[#5A534A]/20 rounded-lg p-2 text-sm text-[#5A534A] placeholder-[#5A534A]/50 focus:outline-none focus:ring-2 focus:ring-[#5A534A]/50 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner"
            />
            <p className="text-red-600 text-xs mt-1 h-[16px]">
              {errors.usuarioEmail || ""}
            </p>
          </div>

          <div>
            <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-[#5A534A]/20 rounded-lg p-2 text-sm text-[#5A534A] placeholder-[#5A534A]/50 focus:outline-none focus:ring-2 focus:ring-[#5A534A]/50 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner"
            />
            <p className="text-red-600 text-xs mt-1 h-[16px]">
              {errors.password || ""}
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#5A534A] text-[#fcfaf4] py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[#4a443d] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#91B088] focus:ring-offset-2 focus:ring-offset-[#E8DCC9] transition-all transform hover:-translate-y-0.5"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-[#5A534A]/80 text-center text-sm">
          ¿No tenés cuenta?{" "}
          <Link
            to="/registro"
            className="text-[#57A773] font-extrabold hover:text-[#4a443d] hover:underline decoration-2 underline-offset-2"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}