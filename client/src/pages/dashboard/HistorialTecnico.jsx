import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HistorialTecnico = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // ESTADOS DEL FILTRO
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const token = localStorage.getItem('token_sts');
        if (!token) return;
        
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const id_tecnico = payload.id;

        const respuesta = await axios.get(`https://shadow-ticket-support-backend-jace.onrender.com/api/tickets/historial-tecnico/${id_tecnico}`);
        setHistorial(respuesta.data);
      } catch (error) {
        toast.error("No se pudo cargar tu historial de resoluciones.");
      } finally {
        setCargando(false);
      }
    };
    obtenerHistorial();
  }, []);

  const formatearFecha = (cadenaFecha) => {
    return new Date(cadenaFecha).toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  // LA MAGIA DEL FILTRO: Filtramos el array antes de dibujarlo
  const historialFiltrado = historial.filter((ticket) => {
    const coincideTexto = ticket.cliente.toLowerCase().includes(busqueda.toLowerCase()) || 
                          ticket.titulo.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincidePrioridad = filtroPrioridad === 'Todas' || ticket.prioridad === filtroPrioridad;

    return coincideTexto && coincidePrioridad;
  });

  if (cargando) return <div className="p-8 text-moss animate-pulse font-bold">Cargando tu registro de victorias...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-moss">🏆 Mi Historial de Resoluciones</h2>
          <p className="text-moss-light text-sm mt-1">Aquí se muestran todos los tickets que has cerrado exitosamente.</p>
        </div>
        <span className="bg-pastel-green/20 text-moss-deep px-4 py-2 rounded-xl font-bold text-lg shadow-sm border border-pastel-green">
          {historialFiltrado.length} Resueltos
        </span>
      </div>

      {/* LA BARRA DE FILTROS */}
      <div className="flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Buscar por cliente o asunto..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin text-sm"
        />
        <select 
          value={filtroPrioridad}
          onChange={(e) => setFiltroPrioridad(e.target.value)}
          className="px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin text-sm bg-white"
        >
          <option value="Todas">Todas las Prioridades</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
          <option value="Urgente">Urgente</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-beige-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-moss-satin/10 text-moss font-heading text-sm uppercase tracking-wider border-b border-beige-dark">
                <th className="p-5 font-bold">ID</th>
                <th className="p-5 font-bold">Cliente</th>
                <th className="p-5 font-bold">Asunto Resuelto</th>
                <th className="p-5 font-bold text-center">Prioridad Atendida</th>
                <th className="p-5 font-bold">Fecha</th>
              </tr>
            </thead>
            
            <tbody className="font-body text-sm divide-y divide-beige-dark/50">
              {historialFiltrado.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-moss-light italic">
                    {historial.length === 0 ? 'Aún no has resuelto ningún ticket.' : 'No hay resultados para tu búsqueda.'}
                  </td>
                </tr>
              ) : (
                historialFiltrado.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-beige/30 transition-colors">
                    <td className="p-5 text-moss-light font-mono font-bold">#{ticket.id}</td>
                    <td className="p-5 text-moss font-semibold">{ticket.cliente}</td>
                    <td className="p-5 text-moss-light truncate max-w-xs">{ticket.titulo}</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        ticket.prioridad === 'Urgente' ? 'bg-red-100 text-red-700 border-red-200' :
                        ticket.prioridad === 'Alta' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {ticket.prioridad}
                      </span>
                    </td>
                    <td className="p-5 text-moss-light">{formatearFecha(ticket.fecha_apertura)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialTecnico;