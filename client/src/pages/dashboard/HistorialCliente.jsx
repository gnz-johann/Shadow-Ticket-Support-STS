import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TicketCard from '../../components/dashboard/TicketCard'; // Ajusta la ruta si es necesario

const HistorialCliente = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null); // Estado para abrir la tarjeta

  useEffect(() => {
    const cargarHistorialCompleto = async () => {
      try {
        const token = localStorage.getItem('token_sts');
        if (!token) return;
        
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const id_cliente = payload.id;

        const respuesta = await axios.get(`https://shadow-ticket-support-backend-jace.onrender.com/api/tickets/cliente/${id_cliente}`);
        setHistorial(respuesta.data);
      } catch (error) {
        toast.error("No se pudo cargar tu historial maestro.");
      } finally {
        setCargando(false);
      }
    };
    cargarHistorialCompleto();
  }, []);

  const formatearFecha = (cadenaFecha) => {
    return new Date(cadenaFecha).toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  if (cargando) return <div className="p-8 text-moss animate-pulse font-bold">Consultando archivos...</div>;

  return (
    <div className="space-y-6">
      
      {/* ENCABEZADO */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige-dark flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-heading font-bold text-moss">📁 Mi Historial Completo</h2>
          <p className="text-moss-light text-sm mt-1">Registro histórico de todas tus interacciones con soporte.</p>
        </div>
        <span className="bg-moss-satin text-beige px-4 py-2 rounded-xl font-bold shadow-sm">
          {historial.length} Reportes Totales
        </span>
      </div>

      {/* TABLA MAESTRA */}
      <div className="bg-white rounded-3xl shadow-sm border border-beige-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-moss-deep text-beige font-heading text-sm uppercase tracking-wider border-b border-beige-dark">
                <th className="p-5 font-bold">ID</th>
                <th className="p-5 font-bold">Asunto</th>
                <th className="p-5 font-bold">Estado</th>
                <th className="p-5 font-bold">Fecha</th>
                <th className="p-5 font-bold text-center">Acción</th>
              </tr>
            </thead>
            
            <tbody className="font-body text-sm divide-y divide-beige-dark/50">
              {historial.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-moss-light italic">
                    Aún no tienes un historial con nosotros.
                  </td>
                </tr>
              ) : (
                historial.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-beige/30 transition-colors">
                    <td className="p-5 text-moss-light font-mono font-bold">#{ticket.id}</td>
                    <td className="p-5 text-moss font-bold max-w-[200px] truncate">{ticket.titulo}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                        ticket.estado === 'Resuelto' ? 'bg-green-100 text-green-700 border-green-200' : 
                        ticket.estado === 'En Proceso' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td className="p-5 text-moss-light">{formatearFecha(ticket.fecha)}</td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => setTicketSeleccionado(ticket)}
                        className="text-moss-satin hover:text-moss font-bold underline decoration-2 underline-offset-4"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL */}
      {ticketSeleccionado && (
        <TicketCard 
          ticket={ticketSeleccionado} 
          onClose={() => setTicketSeleccionado(null)} 
        />
      )}
    </div>
  );
};

export default HistorialCliente;