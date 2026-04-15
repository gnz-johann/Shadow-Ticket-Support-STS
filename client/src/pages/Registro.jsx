import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Registro = () => {
  const [datos, setDatos] = useState({ nombres: '', apellido_p: '', apellido_m: '', correo: '', pass: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Preparando entorno...');
    try {
      await axios.post('http://localhost:4000/api/registro', datos);
      toast.success('¡Registro exitoso! Bienvenido.', { id: toastId });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al crear la cuenta', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <Toaster position="top-right" />
      
      {/* 🖼️ EL MISMO FONDO DE LA LP PARA COHESIÓN */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Fondo" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-moss-deep/70 backdrop-blur-[4px]"></div>
      </div>

      <Link to="/" className="absolute top-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 text-beige font-bold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-pastel-green hover:text-moss transition-all duration-[1200ms] z-20 shadow-lg">
        <span>←</span> Volver a STS
      </Link>

      <div className="bg-white w-full max-w-2xl p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 border border-beige-dark/50">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-moss tracking-tight">Registro de Sistema</h2>
          <p className="text-moss-light text-sm mt-1">Habilita tu acceso corporativo</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-1">Nombre(s)</label>
            <input name="nombres" type="text" required onChange={(e) => setDatos({...datos, nombres: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="Ej. Carlos" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-1">Apellido Paterno</label>
            <input name="apellido_p" type="text" required onChange={(e) => setDatos({...datos, apellido_p: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="Primer apellido" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-1">Apellido Materno</label>
            <input name="apellido_m" type="text" required onChange={(e) => setDatos({...datos, apellido_m: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="Segundo apellido" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-1">Correo Electrónico</label>
            <input name="correo" type="email" required onChange={(e) => setDatos({...datos, correo: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="usuario@empresa.com" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-1">Contraseña</label>
            <input name="pass" type="password" required onChange={(e) => setDatos({...datos, pass: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="••••••••" />
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="submit" className="w-full bg-moss text-beige font-bold py-3.5 rounded-xl hover:bg-moss-satin transition-all duration-[1200ms] shadow-lg">
              Crear Cuenta
            </button>
            <p className="mt-5 text-center text-sm text-moss-light">
              ¿Ya tienes cuenta? <Link to="/login" className="font-bold text-moss hover:text-pastel-green transition-colors duration-[1200ms] underline decoration-2 underline-offset-4">Inicia sesión aquí</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;