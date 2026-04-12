import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HistorialTecnico = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const token = localStorage.getItem('token_sts');
        if (!token) return;
        
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const id_tecnico = payload.id;

        const respuesta = await axios.get(`http://localhost:4000/api/tickets/historial-tecnico/${id_tecnico}`);
        setHistorial(respuesta.data);
      } catch (error) {
        console.error("Error al cargar el historial", error);
        toast.error("No se pudo cargar tu historial de resoluciones.");
      } finally {
        setCargando(false);
      }
    };
    obtenerHistorial();
  }, []);

  // Función para dar formato a la fecha
  const formatearFecha = (cadenaFecha) => {
    return new Date(cadenaFecha).toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  if (cargando) return <div className="p-8 text-moss animate-pulse font-bold">Cargando tu registro de victorias...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-moss">🏆 Mi Historial de Resoluciones</h2>
          <p className="text-moss-light text-sm mt-1">Aquí se muestran todos los tickets que has cerrado exitosamente.</p>
        </div>
        <span className="bg-pastel-green/20 text-moss-deep px-4 py-2 rounded-xl font-bold text-lg shadow-sm border border-pastel-green">
          {historial.length} Resueltos
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-beige-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-moss-satin/10 text-moss font-heading text-sm uppercase tracking-wider border-b border-beige-dark">
                <th className="p-5 font-bold">ID</th>
                <th className="p-5 font-bold">Cliente</th>
                <th className="p-5 font-bold">Asunto Resuelto</th>
                <th className="p-5 font-bold">Prioridad Atendida</th>
                <th className="p-5 font-bold">Fecha</th>
              </tr>
            </thead>
            
            <tbody className="font-body text-sm divide-y divide-beige-dark/50">
              {historial.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-moss-light italic">
                    Aún no has resuelto ningún ticket. ¡Ve a tu Área de Trabajo!
                  </td>
                </tr>
              ) : (
                historial.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-beige/30 transition-colors">
                    <td className="p-5 text-moss-light font-mono font-bold">#{ticket.id}</td>
                    <td className="p-5 text-moss font-semibold">{ticket.cliente}</td>
                    <td className="p-5 text-moss-light truncate max-w-xs">{ticket.titulo}</td>
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">
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