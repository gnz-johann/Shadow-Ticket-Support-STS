import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Registro = () => {
  const [datos, setDatos] = useState({
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    pass: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Preparando tu espacio de soporte...');

    try {
      await axios.post('http://localhost:4000/api/registro', datos);
      toast.success('¡Registro exitoso! Bienvenido a STS.', { id: toastId });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al crear la cuenta', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-moss-deep flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Botón Volver al Inicio */}
      <Link to="/" className="absolute top-8 left-8 text-beige font-bold flex items-center gap-2 hover:text-pastel-green transition-colors z-10">
        <span>←</span> Volver a STS
      </Link>

      <div className="bg-white w-full max-w-3xl p-10 md:p-14 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-heading font-bold text-moss italic tracking-tight">Comienza a usar STS</h2>
          <p className="text-moss-light font-bold mt-2">Acceso instantáneo. Optimiza tu soporte hoy.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-moss-light mb-1">Nombre(s)</label>
            <input name="nombres" type="text" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-colors" placeholder="Tus nombres" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-moss-light mb-1">Apellido Paterno</label>
            <input name="apellido_p" type="text" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-colors" placeholder="Primer apellido" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-moss-light mb-1">Apellido Materno</label>
            <input name="apellido_m" type="text" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-colors" placeholder="Segundo apellido" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-moss-light mb-1">Correo Electrónico</label>
            <input name="correo" type="email" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-colors" placeholder="ejemplo@empresa.com" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-moss-light mb-1">Contraseña</label>
            <input name="pass" type="password" required onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-colors" placeholder="••••••••" />
          </div>

          <div className="md:col-span-2 pt-6">
            <button type="submit" className="w-full bg-moss text-beige font-heading font-bold text-lg py-4 rounded-xl hover:bg-moss-satin transition-transform hover:-translate-y-1 shadow-xl">
              Comienza ahora
            </button>
            <p className="mt-6 text-center text-sm font-body text-moss">
              ¿Ya tienes cuenta? <Link to="/login" className="font-bold underline decoration-2 underline-offset-4 hover:text-pastel-green transition-colors">Inicia sesión aquí</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;