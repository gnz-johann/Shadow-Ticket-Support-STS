import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Configuracion = () => {
  const [usuario, setUsuario] = useState({
    nombres: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    empresa: 'Shadow Corp (Simulado)', // Solo visual
    foto: null
  });

  useEffect(() => {
    // Extraemos datos iniciales del token para mostrar en la tabla
    const token = localStorage.getItem('token_sts');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Aquí idealmente harías un fetch al backend para traer apellidos
      setUsuario(prev => ({ ...prev, nombres: payload.nombre }));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn duration-[1200ms]">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-heading font-bold text-moss mb-8">Configuración de Cuenta</h2>

      <div className="bg-white rounded-3xl shadow-xl border border-beige-dark overflow-hidden">
        {/* Tabla de Información Actual */}
        <div className="p-8 border-b border-beige-dark bg-beige-dark/5">
          <h3 className="text-lg font-bold text-moss mb-4 flex items-center gap-2">
            👤 Información de Identidad
          </h3>
          <table className="w-full text-sm text-left text-moss">
            <tbody>
              <tr className="border-b border-beige-dark/50">
                <td className="py-3 font-bold text-moss-light uppercase tracking-wider text-[10px]">Nombre Completo</td>
                <td className="py-3 font-body">{usuario.nombres} {usuario.apellido_p}</td>
              </tr>
              <tr className="border-b border-beige-dark/50">
                <td className="py-3 font-bold text-moss-light uppercase tracking-wider text-[10px]">Compañía</td>
                <td className="py-3 font-body italic text-gray-400">{usuario.empresa}</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-moss-light uppercase tracking-wider text-[10px]">Correo Electrónico</td>
                <td className="py-3 font-body">{usuario.correo || 'cargando...'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formulario de Edición */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-pastel-green flex items-center justify-center text-4xl border-4 border-white shadow-lg overflow-hidden">
                {usuario.foto ? <img src={usuario.foto} alt="Perfil" /> : '👤'}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-moss/60 text-beige opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms] rounded-full cursor-pointer text-xs font-bold">
                Editar Foto
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-moss-light mb-1 uppercase">Nombre(s)</label>
                  <input type="text" defaultValue={usuario.nombres} className="w-full px-4 py-2.5 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-all duration-[1200ms]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-moss-light mb-1 uppercase">Compañía (Visual)</label>
                  <input type="text" placeholder="Shadow Ticket Support" className="w-full px-4 py-2.5 rounded-xl border-2 border-beige-dark bg-gray-50 italic outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-xs font-bold text-moss-light mb-1 uppercase">Nueva Contraseña</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-all duration-[1200ms]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-moss-light mb-1 uppercase">Confirmar Contraseña</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none transition-all duration-[1200ms]" />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              onClick={() => toast.success('Cambios guardados (Simulación)')}
              className="bg-moss text-beige px-10 py-3.5 rounded-2xl font-bold hover:bg-moss-satin transition-all duration-[1200ms] shadow-lg hover:-translate-y-1"
            >
              Actualizar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;