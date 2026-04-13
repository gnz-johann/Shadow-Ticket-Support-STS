const TicketCard = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-moss-deep/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-beige-dark">
        
        {/* Cabecera del Modal */}
        <div className="bg-moss p-6 flex justify-between items-center text-beige">
          <div>
            <span className="text-pastel-green font-mono text-sm font-bold tracking-widest">TICKET #{ticket.id}</span>
            <h3 className="text-xl font-heading font-bold mt-1 truncate max-w-md" title={ticket.titulo}>
              {ticket.titulo}
            </h3>
          </div>
          <button onClick={onClose} className="text-3xl hover:text-pastel-green transition-colors">&times;</button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-8 space-y-6 bg-beige">
          
          <div>
            <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-2">Descripción del Problema</p>
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
              <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-1">Prioridad Asignada</p>
              <span className="px-3 py-1.5 bg-white border border-beige-dark rounded-full text-xs font-bold text-moss inline-block">
                {ticket.prioridad || 'Pendiente'}
              </span>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-xs font-bold text-moss-light uppercase tracking-wider mb-1">Fecha de Apertura</p>
              <p className="text-sm font-bold text-moss">{new Date(ticket.fecha).toLocaleDateString()}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TicketCard;