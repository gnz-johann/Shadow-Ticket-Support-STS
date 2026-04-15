import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TicketCard = ({ ticket, onClose }) => {
  const [esCliente, setEsCliente] = useState(false);
  const [mostrarReabrir, setMostrarReabrir] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    // Verificamos quién está viendo la tarjeta
    const token = localStorage.getItem('token_sts');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.rol.toUpperCase() === 'CLIENTE') setEsCliente(true);
    }
  }, []);

  if (!ticket) return null;

  const handleReabrir = async () => {
    if (motivo.trim().length < 10) {
      toast.error('Por favor, explica detalladamente por qué reabres el ticket.');
      return;
    }
    
    setProcesando(true);
    const tid = toast.loading('Reabriendo ticket...');

    try {
      await axios.put(`https://shadow-ticket-support-backend-jace.onrender.com/tickets/reabrir/${ticket.id}`, { motivo });
      toast.success('Ticket reabierto. Lo revisaremos pronto.', { id: tid });
      setTimeout(() => {
        onClose();
        window.location.reload(); // Recargamos para actualizar las tablas maestras
      }, 1500);
    } catch (error) {
      toast.error('Hubo un error al reabrir el ticket.', { id: tid });
      setProcesando(false);
    }
  };

  const puedeReabrirse = esCliente && ticket.estado === 'Resuelto';

  return (
    <div className="fixed inset-0 bg-moss-deep/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn duration-[1200ms]">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-beige-dark transition-all duration-[1200ms]">
        
        <div className="bg-moss p-6 flex justify-between items-center text-beige">
          <div>
            <span className="text-pastel-green font-mono text-sm font-bold tracking-widest">TICKET #{ticket.id}</span>
            <h3 className="text-xl font-heading font-bold mt-1 truncate max-w-md" title={ticket.titulo}>
              {ticket.titulo}
            </h3>
          </div>
          <button onClick={onClose} className="text-3xl hover:text-pastel-green transition-colors duration-[1200ms]">&times;</button>
        </div>

        <div className="p-8 space-y-6 bg-beige">
          <div>
            <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-2">Descripción del Problema e Historial</p>
            <div className="bg-white p-5 rounded-2xl shadow-inner border border-beige-dark text-moss font-body text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {ticket.descripcion || "El usuario no proporcionó una descripción detallada."}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-beige-dark pt-6">
            <div>
              <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-1">Estado</p>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                ticket.estado === 'Resuelto' ? 'bg-green-100 text-green-700 border-green-200' : 
                ticket.estado === 'En Proceso' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {ticket.estado}
              </span>
            </div>
            
            <div>
              <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-1">Prioridad</p>
              <span className="px-3 py-1.5 bg-white border border-beige-dark rounded-full text-xs font-bold text-moss inline-block">
                {ticket.prioridad || 'Pendiente'}
              </span>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-1">Fecha</p>
              <p className="text-sm font-bold text-moss">{new Date(ticket.fecha).toLocaleDateString()}</p>
            </div>
          </div>

          {/* 🔴 SECCIÓN DE REAPERTURA PARA CLIENTES 🔴 */}
          {puedeReabrirse && !mostrarReabrir && (
             <div className="border-t border-beige-dark pt-4 flex justify-end">
                <button 
                  onClick={() => setMostrarReabrir(true)}
                  className="text-red-500 font-bold text-sm hover:text-red-700 underline decoration-2 underline-offset-4 transition-colors duration-[1200ms]"
                >
                  ¿El problema persiste? Reabrir ticket
                </button>
             </div>
          )}

          {mostrarReabrir && (
            <div className="border-t border-red-200 pt-6 mt-4 animate-fadeIn duration-[1200ms]">
              <label className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
                Motivo de Reapertura
              </label>
              <textarea 
                rows="3"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Explica a los técnicos qué es lo que sigue fallando..."
                className="w-full px-4 py-3 rounded-xl border-2 border-red-200 focus:border-red-500 outline-none transition-colors duration-[1200ms] text-sm"
              ></textarea>
              <div className="flex justify-end gap-3 mt-3">
                <button 
                  onClick={() => setMostrarReabrir(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-moss-light hover:bg-beige-dark transition-colors duration-[1200ms]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleReabrir}
                  disabled={procesando}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-md transition-all duration-[1200ms]"
                >
                  {procesando ? 'Procesando...' : 'Confirmar Reapertura'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TicketCard;