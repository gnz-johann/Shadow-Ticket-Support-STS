import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TicketCard from '../../components/dashboard/TicketCard';

const MisTickets = () => {
  const [misTickets, setMisTickets] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para controlar el Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [comentarioCierre, setComentarioCierre] = useState('');
  const [ticketDetalle, setTicketDetalle] = useState(null);

  useEffect(() => {
    const obtenerMisTickets = async () => {
      try {
        const token = localStorage.getItem('token_sts');
        if (!token) return;
        
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const id_tecnico = payload.id;

        const respuesta = await axios.get(`https://shadow-ticket-support-backend-jace.onrender.com/tickets/mis-pendientes/${id_tecnico}`);
        setMisTickets(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar mis tickets", error);
        toast.error("No se pudieron cargar tus tickets pendientes.");
        setCargando(false);
      }
    };
    obtenerMisTickets();
  }, []);

  // Función para abrir el modal y preparar el ticket
  const abrirModal = (ticket) => {
    setTicketSeleccionado(ticket);
    setComentarioCierre(''); // Limpiamos el texto por si había algo antes
    setModalAbierto(true);
  };

  // Función que se ejecuta al darle "Confirmar Resolución" en el Modal
  const handleResolverTicket = async () => {
    if (comentarioCierre.trim().length < 10) {
      toast.error("El comentario debe ser más descriptivo (mínimo 10 caracteres).");
      return;
    }

    const toastId = toast.loading('Procesando resolución...');

    try {
      const token = localStorage.getItem('token_sts');
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const id_tecnico = payload.id;

      await axios.put(`https://shadow-ticket-support-backend-jace.onrender.com/tickets/resolver/${ticketSeleccionado.id}`, {
        id_tecnico,
        comentario: comentarioCierre
      });

      // Quitamos el ticket resuelto de la vista
      setMisTickets(misTickets.filter(t => t.id !== ticketSeleccionado.id));
      
      toast.success('¡Ticket resuelto exitosamente!', { id: toastId });
      setModalAbierto(false); // Cerramos el modal

    } catch (error) {
      console.error("Error al resolver", error);
      toast.error("Hubo un error al procesar la resolución.", { id: toastId });
    }
  };

  if (cargando) return <div className="p-8 text-moss animate-pulse font-bold">Cargando tu área de trabajo...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-moss">🛠️ Mi Área de Trabajo</h2>
        <span className="bg-moss-satin text-pastel-green px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
          {misTickets.length} Tickets Activos
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {misTickets.length === 0 ? (
          <div className="col-span-full p-10 bg-white rounded-2xl text-center text-moss-light italic border border-beige-dark">
            No tienes tickets pendientes. Ve a la Piscina para tomar uno.
          </div>
        ) : (
          misTickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-beige-dark hover:border-moss-satin transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-moss-light">#{ticket.id}</span>
                  <h3 className="font-heading font-bold text-lg text-moss mt-1">{ticket.titulo}</h3>
                </div>
                <span className="bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold">
                  {ticket.prioridad}
                </span>
              </div>
              
              <div className="mb-6 font-body text-sm text-moss-light">
                <p><strong>Cliente:</strong> {ticket.cliente}</p>
                <p><strong>Estado:</strong> {ticket.estado}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setTicketDetalle(ticket)}
                  className="px-4 py-2 text-sm font-bold text-moss border-2 border-beige-dark rounded-xl hover:bg-beige transition-colors duration-[1200ms]">
                    Ver Detalles
                </button>
                <button 
                  onClick={() => abrirModal(ticket)}
                  className="px-4 py-2 text-sm font-bold text-pastel-green bg-moss-satin rounded-xl hover:bg-moss transition-colors shadow-sm"
                >
                  ✅ Finalizar Soporte
                </button>
              </div>
                {ticketDetalle && (
                  <TicketCard 
                  ticket={ticketDetalle} 
                  onClose={() => setTicketDetalle(null)} 
                 />
                )}
            </div>
          ))
        )}
      </div>

      {/* --- EL MODAL DE CIERRE --- */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-moss-deep/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all">
            
            {/* Cabecera del Modal */}
            <div className="bg-moss p-6">
              <h3 className="text-xl font-heading font-bold text-beige">Documentar Resolución</h3>
              <p className="text-pastel-green text-sm mt-1 font-mono">Ticket #{ticketSeleccionado?.id} - {ticketSeleccionado?.cliente}</p>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-8">
              <label className="block text-sm font-bold text-moss mb-3 font-heading">
                ¿Cómo solucionaste el problema?
              </label>
              <textarea
                value={comentarioCierre}
                onChange={(e) => setComentarioCierre(e.target.value)}
                placeholder="Explica los pasos realizados para solucionar el ticket. Esta información será visible para el cliente."
                className="w-full h-32 px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm resize-none transition-colors"
              />
              <p className="text-xs text-moss-light mt-2 italic">
                * Mínimo 10 caracteres requeridos.
              </p>
            </div>

            {/* Botones del Modal */}
            <div className="bg-beige-dark/20 p-6 flex justify-end gap-4 border-t border-beige-dark">
              <button 
                onClick={() => setModalAbierto(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-moss hover:bg-beige-dark transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleResolverTicket}
                disabled={comentarioCierre.trim().length < 10}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                  comentarioCierre.trim().length >= 10 
                    ? 'bg-moss-satin text-pastel-green hover:bg-moss hover:-translate-y-0.5' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirmar Resolución
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default MisTickets;