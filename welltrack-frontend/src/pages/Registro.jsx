import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoWelltrack from '../assets/Welltrack-logo.png'; 

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreApellido: "",
    nombreUsuario: "",
    email: "",
    password: "",
    password_confirmation: "",
    fechaNac: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState(""); 

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "nombreApellido":
        if (!value.trim()) error = "Por favor ingrese su nombre completo";
        break;
      case "nombreUsuario":
        if (!value.trim()) error = "Por favor ingrese un nombre de usuario";
        break;
      case "email":
        if (!value.trim()) error = "Por favor ingrese su correo electrónico";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "El correo electrónico no es válido";
        break;
      case "password":
        if (!value.trim()) error = "Por favor ingrese una contraseña";
        else if (value.length < 6)
          error = "La contraseña debe tener al menos 6 caracteres";
        break;
      case "password_confirmation":
        if (value !== formData.password)
          error = "Las contraseñas no coinciden";
        break;
      case "fechaNac":
        if (!value) error = "Por favor seleccione su fecha de nacimiento";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (generalError) setGeneralError("");
    
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    let valid = true;
    const validationErrors = {};
    
    Object.keys(formData).forEach((key) => {
      let error = "";
      if (!formData[key]) valid = false; 
    });

    const hasVisualErrors = Object.values(errors).some(err => err !== "");
    if (hasVisualErrors || !valid) {
        setGeneralError("Por favor completá correctamente todos los campos.");
        return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {

        if (response.status === 422 && data.errors) {
            const newBackendErrors = {};

            if (data.errors.email) {
                newBackendErrors.email = "Este correo ya está registrado. ¿Querés iniciar sesión?";
            }

            if (data.errors.nombreUsuario) {
                newBackendErrors.nombreUsuario = "Este nombre de usuario ya no está disponible.";
            }

            if (data.errors.password) {
                 newBackendErrors.password = "La contraseña no cumple los requisitos.";
            }

            setErrors((prev) => ({ ...prev, ...newBackendErrors }));
        } else {
            setGeneralError("Hubo un problema al crear la cuenta. Intentá más tarde.");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);

    } catch (error) {
      console.error("Error en el registro:", error);
      setGeneralError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center animate-gradient bg-gradient-to-br from-[#91b088] to-[#57a773] bg-[length:400%_400%]">
      <div className="relative bg-[#E8DCC9] border border-white/40 shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto flex flex-col max-h-[90vh]">
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-2xl" />

        <div className="flex-shrink-0 text-center relative z-10">
          <img
            src={logoWelltrack}
            alt="Welltrack Logo"
            className="mx-auto mb-2 h-16 object-contain drop-shadow-sm"
          />
          <h2 className="text-2xl font-bold mb-4 text-[#5A534A] drop-shadow-sm">
            Crear cuenta
          </h2>
        </div>

        <div className="overflow-y-auto pr-2 relative z-10 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {success && (
              <div className="bg-green-100/80 border border-green-200 rounded-lg p-2 text-center shadow-sm mb-2">
                <p className="text-green-800 text-sm font-medium"> Usuario registrado con éxito. Redirigiendo...</p>
              </div>
            )}

            {generalError && (
               <div className="bg-red-100/50 border border-red-200 rounded-lg p-2 text-center mb-2">
                  <p className="text-red-700 text-sm font-medium">{generalError}</p>
               </div>
            )}

            <div>
              <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombreApellido"
                value={formData.nombreApellido}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="w-full border border-[#5A534A]/20 rounded-lg p-2 text-sm text-[#5A534A] placeholder-[#5A534A]/50 focus:outline-none focus:ring-2 focus:ring-[#5A534A]/50 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner"
              />
              {errors.nombreApellido && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.nombreApellido}</p>
              )}
            </div>

            <div>
              <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                className={`w-full border rounded-lg p-2 text-sm text-[#5A534A] placeholder-[#5A534A]/50 focus:outline-none focus:ring-2 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner ${errors.nombreUsuario ? 'border-red-500 focus:ring-red-300' : 'border-[#5A534A]/20 focus:ring-[#5A534A]/50'}`}
              />
              {errors.nombreUsuario && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.nombreUsuario}</p>
              )}
            </div>

            <div>
              <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej: correo@ejemplo.com"
                className={`w-full border rounded-lg p-2 text-sm text-[#5A534A] placeholder-[#5A534A]/50 focus:outline-none focus:ring-2 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-[#5A534A]/20 focus:ring-[#5A534A]/50'}`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>
              )}
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
              {errors.password && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Repetir contraseña"
                className="w-full border border-[#5A534A]/20 rounded-lg p-2 text-sm text-[#5A534A] placeholder-[#5A534A]/50 focus:outline-none focus:ring-2 focus:ring-[#5A534A]/50 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner"
              />
              {errors.password_confirmation && (
                <p className="text-red-600 text-xs mt-1 font-medium">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#5A534A] mb-1 text-sm font-bold tracking-wide">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fechaNac"
                value={formData.fechaNac}
                onChange={handleChange}
                className="w-full border border-[#5A534A]/20 rounded-lg p-2 text-sm text-[#5A534A] focus:outline-none focus:ring-2 focus:ring-[#5A534A]/50 focus:border-transparent bg-[#fcfaf4]/60 transition-all shadow-inner"
              />
              {errors.fechaNac && (
                <p className="text-red-600 text-xs mt-1 font-medium">{errors.fechaNac}</p>
              )}
            </div>

            <button
              type="submit"
              
              className="w-full mt-4 bg-[#5A534A] text-[#fcfaf4] py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[#4a443d] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#91B088] focus:ring-offset-2 focus:ring-offset-[#E8DCC9] transition-all transform hover:-translate-y-0.5"
            >
              Registrarse
            </button>
            
            <div className="h-2"></div>
          </form>
        </div>

        <div className="flex-shrink-0 mt-4 text-center relative z-10 border-t border-[#5A534A]/10 pt-4">
          <p className="text-[#5A534A]/80 text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-[#57A773] font-extrabold hover:text-[#4a443d] hover:underline decoration-2 underline-offset-2"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
}
