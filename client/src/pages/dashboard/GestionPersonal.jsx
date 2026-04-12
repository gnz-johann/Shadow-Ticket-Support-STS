import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GestionPersonal = () => {
  const [personal, setPersonal] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // 1. ESTADOS PARA EL MODAL
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoCorreo, setNuevoCorreo] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');
  const [creando, setCreando] = useState(false);

  // Función para traer la lista de la BD
  const obtenerPersonal = async () => {
    try {
      const respuesta = await axios.get('http://localhost:4000/api/personal/tecnicos');
      setPersonal(respuesta.data);
    } catch (error) {
      console.error("Error al cargar personal", error);
      toast.error("No se pudo cargar la lista de técnicos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPersonal();
  }, []);

  // 2. FUNCIÓN PARA ENVIAR EL FORMULARIO
  const handleCrearTecnico = async (e) => {
    e.preventDefault();
    setCreando(true);
    const toastId = toast.loading('Registrando nuevo técnico...');

    try {
      await axios.post('http://localhost:4000/api/personal/tecnicos', {
        nombres: nuevoNombre,
        correo: nuevoCorreo,
        pass: nuevoPass
      });

      toast.success('¡Técnico dado de alta exitosamente!', { id: toastId });
      
      // Limpiamos los campos y cerramos el modal
      setNuevoNombre('');
      setNuevoCorreo('');
      setNuevoPass('');
      setModalAbierto(false);
      
      // Recargamos la lista para ver al nuevo integrante
      obtenerPersonal();

    } catch (error) {
      console.error("Error al crear", error);
      // Mostramos el mensaje exacto que mandamos desde Node si el correo ya existe
      const mensajeError = error.response?.data?.mensaje || 'Hubo un error al registrar al técnico.';
      toast.error(mensajeError, { id: toastId });
    } finally {
      setCreando(false);
    }
  };

  const personalFiltrado = personal.filter(persona => 
    persona.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    persona.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) return <div className="p-8 text-moss animate-pulse font-bold">Cargando base de datos de personal...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-moss">👥 Gestión de Personal</h2>
          <p className="text-moss-light text-sm mt-1">Administra los accesos y visualiza el rendimiento de tus técnicos.</p>
        </div>
        
        {/* 3. CONECTAMOS EL BOTÓN PARA ABRIR EL MODAL */}
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-moss-satin text-pastel-green px-6 py-3 rounded-xl font-bold hover:bg-moss transition-all shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          + Dar de Alta Técnico
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark">
        <input 
          type="text" 
          placeholder="Buscar por nombre o correo electrónico..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm transition-colors"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-beige-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             {/* ... (Todo tu THEAD queda igual) ... */}
            <thead>
              <tr className="bg-moss-satin/10 text-moss font-heading text-sm uppercase tracking-wider border-b border-beige-dark">
                <th className="p-5 font-bold">ID</th>
                <th className="p-5 font-bold">Nombre Completo</th>
                <th className="p-5 font-bold">Correo Electrónico</th>
                <th className="p-5 font-bold">Rol</th>
                <th className="p-5 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="font-body text-sm divide-y divide-beige-dark/50">
              {personalFiltrado.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-moss-light italic">
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                personalFiltrado.map((persona) => (
                  <tr key={persona.id} className="hover:bg-beige/30 transition-colors">
                    <td className="p-5 text-moss-light font-mono font-bold">#{persona.id}</td>
                    <td className="p-5 text-moss font-semibold">{persona.nombres}</td>
                    <td className="p-5 text-moss-light">{persona.correo}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        persona.rol === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {persona.rol}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button className="text-moss-satin font-bold text-sm hover:text-moss underline decoration-2 underline-offset-4 transition-colors">
                        Ver Tickets Asignados
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 4. EL MODAL DE REGISTRO --- */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-moss-deep/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
            
            <div className="bg-moss p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-heading font-bold text-beige">Nuevo Integrante</h3>
                <p className="text-pastel-green text-sm mt-1">Registrar credenciales de Técnico</p>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-beige hover:text-pastel-green text-2xl font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleCrearTecnico} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-bold text-moss mb-2 font-heading">Nombre Completo</label>
                <input 
                  type="text" required
                  value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Ana Martínez"
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-moss mb-2 font-heading">Correo Corporativo</label>
                <input 
                  type="email" required
                  value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)}
                  placeholder="ana@sts.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-moss mb-2 font-heading">Contraseña Inicial</label>
                <input 
                  type="text" required
                  value={nuevoPass} onChange={(e) => setNuevoPass(e.target.value)}
                  placeholder="Asigna una contraseña temporal"
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm transition-colors"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-moss hover:bg-beige-dark transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={creando}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                    creando ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-moss-satin text-pastel-green hover:bg-moss hover:-translate-y-0.5'
                  }`}
                >
                  {creando ? 'Creando...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default GestionPersonal;