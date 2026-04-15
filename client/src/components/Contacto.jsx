import { useState } from 'react';
import toast from 'react-hot-toast';

const Contacto = () => {
  const [datos, setDatos] = useState({ nombre: '', correo: '', mensaje: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tid = toast.loading('Enviando mensaje...');
    
    // Simulación de envío
    setTimeout(() => {
      toast.success('¡Mensaje enviado! Nos pondremos en contacto pronto.', { id: tid });
      setDatos({ nombre: '', correo: '', mensaje: '' });
    }, 1500);
  };

  return (
    <section id="contacto" className="py-24 bg-beige border-t border-beige-dark">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        
        {/* Columna Izquierda: Información */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-heading font-bold text-moss mb-4">Hablemos de tu soporte</h2>
            <p className="text-lg font-body text-moss-light leading-relaxed">
              ¿Tienes dudas sobre cómo implementar STS en tu equipo? Nuestro equipo de expertos está listo para ayudarte a escalar tus operaciones.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">📍</span>
              <div>
                <h4 className="font-bold text-moss">Oficinas Centrales</h4>
                <p className="text-sm text-moss-light">San Agustín, Jalisco, México</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✉️</span>
              <div>
                <h4 className="font-bold text-moss">Correo Electrónico</h4>
                <p className="text-sm text-moss-light">contacto@shadowsupport.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">⏰</span>
              <div>
                <h4 className="font-bold text-moss">Horario de Atención</h4>
                <p className="text-sm text-moss-light">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-beige-dark">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-moss-light uppercase tracking-widest mb-2">Nombre</label>
              <input 
                type="text" 
                required
                value={datos.nombre}
                onChange={(e) => setDatos({...datos, nombre: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" 
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-moss-light uppercase tracking-widest mb-2">Correo</label>
              <input 
                type="email" 
                required
                value={datos.correo}
                onChange={(e) => setDatos({...datos, correo: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" 
                placeholder="correo@empresa.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-moss-light uppercase tracking-widest mb-2">Mensaje</label>
              <textarea 
                required
                rows="4"
                value={datos.mensaje}
                onChange={(e) => setDatos({...datos, mensaje: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss outline-none transition-all duration-[1200ms]" 
                placeholder="¿Cómo podemos ayudarte?"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-moss text-beige font-bold py-4 rounded-xl hover:bg-moss-satin transition-all duration-[1200ms] shadow-lg hover:-translate-y-1"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contacto;