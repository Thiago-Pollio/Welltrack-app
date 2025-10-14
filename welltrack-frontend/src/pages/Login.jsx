import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    usuarioEmail: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /*const handleSubmit = (e) => {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = usuarios.find(
      (u) =>
        (formData.usuarioEmail === u.email ||
          formData.usuarioEmail === u.nombreUsuario) &&
        formData.password === u.password
    );

    if (!usuarioEncontrado) {
      setMessage("Usuario o contraseña incorrectos");
      return;
    }*/


    const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: formData.usuarioEmail,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
      setMessage(data.mensaje || "Error al iniciar sesión");
      return;
    }

    localStorage.setItem("usuarioActual",JSON.stringify(data.usuario));
    localStorage.setItem("token", data.token);

    navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      setMessage("Hubo un problema con la conexión");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-12 rounded-3xl shadow-xl w-[500px] flex flex-col items-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="text"
            name="usuarioEmail"
            placeholder="Usuario / Email"
            value={formData.usuarioEmail}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-300 text-lg"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white py-4 rounded-xl shadow hover:scale-105 transition transform font-semibold text-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-lg">
          ¿No tenés cuenta?{" "}
          <Link
            to="/registro"
            className="text-green-500 font-semibold hover:underline"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
