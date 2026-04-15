import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';

const SoporteContacto = () => {
  const [datos, setDatos] = useState({ nombre: '', correo: '', mensaje: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tid = toast.loading('Enviando mensaje...');
    setTimeout(() => {
      toast.success('¡Mensaje enviado! Nos pondremos en contacto pronto.', { id: tid });
      setDatos({ nombre: '', correo: '', mensaje: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen relative font-body overflow-hidden">
      <Toaster position="top-right" />
    
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80" 
          alt="Soporte Técnico" 
          className="w-full h-full object-cover object-center" 
        />
        <div className="absolute inset-0 bg-moss-deep/70 backdrop-blur-[5px]"></div>
      </div>

      {/* Nuestro Navbar inteligente superpuesto */}
      <Navbar />

      {/* Contenido Principal */}
      <main className="relative z-10 pt-36 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center animate-fadeIn">
        
        {/* COLUMNA 1: FORMULARIO */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-beige-dark/50">
          <div className="mb-8">
            <h2 className="text-3xl font-heading font-bold text-moss tracking-tight">Reportar un problema</h2>
            <p className="text-moss-light text-sm mt-2">Llena el formulario y nuestro equipo se comunicará contigo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-moss-light uppercase tracking-widest mb-2">Nombre Completo</label>
              <input type="text" required value={datos.nombre} onChange={(e) => setDatos({...datos, nombre: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="Ej. Mioses Segura" />
            </div>
            <div>
              <label className="block text-xs font-bold text-moss-light uppercase tracking-widest mb-2">Correo Electrónico</label>
              <input type="email" required value={datos.correo} onChange={(e) => setDatos({...datos, correo: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" placeholder="moises@empresa.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-moss-light uppercase tracking-widest mb-2">¿Cómo podemos ayudarte?</label>
              <textarea required rows="5" value={datos.mensaje} onChange={(e) => setDatos({...datos, mensaje: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms] resize-none" placeholder="Escribe tu mensaje aquí..."></textarea>
            </div>
            <button type="submit" className="w-full bg-moss text-beige font-bold py-4 rounded-xl hover:bg-moss-satin transition-all duration-[1200ms] shadow-lg hover:-translate-y-1">
              Enviar Mensaje
            </button>
          </form>
        </div>

        {/* COLUMNA 2: DATOS DE CONTACTO (Ajustado para fondo oscuro) */}
        <div className="space-y-10">
          <div>
            <h2 className="text-4xl font-heading font-bold text-beige mb-4 tracking-tight">Estamos aquí para ti</h2>
            <p className="text-lg text-beige/80 leading-relaxed font-body">
              Shadow Ticket Support nació para resolver problemas de raíz. Ya sea que necesites escalar tu equipo o reportar una falla, nuestro canal está abierto.
            </p>
          </div>

          {/* Tarjeta translúcida estilo "Glassmorphism" */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-beige p-8 rounded-3xl shadow-2xl space-y-6 transition-all duration-[1200ms] hover:bg-white/15">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📍</span>
              <div>
                <h4 className="font-bold text-pastel-green">Oficinas Centrales</h4>
                <p className="text-sm">San Agustín, Jalisco, México</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">✉️</span>
              <div>
                <h4 className="font-bold text-pastel-green">Soporte Directo</h4>
                <p className="text-sm">contacto@shadowsupport.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-3xl">📞</span>
              <div>
                <h4 className="font-bold text-pastel-green">Atención Telefónica</h4>
                <p className="text-sm">+52 33 1234 5678</p>
                <p className="text-xs text-beige/70 mt-1">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SoporteContacto;