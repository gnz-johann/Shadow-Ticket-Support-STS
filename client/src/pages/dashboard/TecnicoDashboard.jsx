import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TecnicoDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  
  // NUEVO: Estado para guardar la prioridad que el técnico está eligiendo en cada fila
  const [prioridadesTemporales, setPrioridadesTemporales] = useState({});

  useEffect(() => {
    const obtenerTickets = async () => {
      try {
        const respuesta = await axios.get('https://shadow-ticket-support-backend-jace.onrender.com/api/tickets/disponibles');
        // Para probar nuestra nueva lógica, forzamos a que los tickets de la BD 
        // vengan con prioridad "Sin Asignar" si no la tienen definida.
        const ticketsFormateados = respuesta.data.map(t => ({
          ...t,
          prioridad: t.prioridad || 'Sin Asignar'
        }));
        setTickets(ticketsFormateados);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar la piscina de tickets", error);
        setCargando(false);
      }
    };
    obtenerTickets();
  }, []);

  // Función para capturar el cambio del selector en una fila específica
  const handleCambioPrioridad = (id_ticket, nuevaPrioridad) => {
    setPrioridadesTemporales({
      ...prioridadesTemporales,
      [id_ticket]: nuevaPrioridad
    });
  };

  const ticketsFiltrados = tickets.filter(ticket => {
    const textoBuscado = busqueda.toLowerCase();
    return ticket.cliente.toLowerCase().includes(textoBuscado) || 
           ticket.titulo.toLowerCase().includes(textoBuscado);
  });

  const handleTomarTicket = async (id_ticket) => {
    // Verificamos qué prioridad eligió en el selector
    const prioridadElegida = prioridadesTemporales[id_ticket];
    
    try {
      const token = localStorage.getItem('token_sts');
      if (!token){
        toast.error("Error: No hay sesión activa");
        return;
    } 
      
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const id_tecnico = payload.id;

      // Ahora enviamos la prioridad al backend también
      await axios.put(`https://shadow-ticket-support-backend-jace.onrender.com/api/tickets/tomar/${id_ticket}`, { 
        id_tecnico, 
        prioridad: prioridadElegida 
      });

      // Quitamos el ticket de la piscina
      setTickets(tickets.filter(t => t.id !== id_ticket));
      toast.success(`¡Ticket asignado exitosamente como prioridad ${prioridadElegida}!`);

    } catch (error) {
      toast.error("Hubo un error al intentar asignar el ticket.");
    }
  };

  if (cargando) {
    return <div className="p-8 text-moss font-heading font-bold animate-pulse">Cargando piscina de tickets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda Minimalista */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark">
        <input 
          type="text" 
          placeholder="Buscar un ticket pendiente..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm transition-colors"
        />
      </div>

      {/* Tabla de la Piscina */}
      <div className="bg-white rounded-2xl shadow-sm border border-beige-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-moss text-beige font-heading text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Asunto</th>
                <th className="p-4 font-semibold">Asignar Prioridad</th>
                <th className="p-4 font-semibold text-center">Acción</th>
              </tr>
            </thead>
            
            <tbody className="font-body text-sm divide-y divide-beige-dark/50">
              {ticketsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-moss-light italic">
                    La piscina está vacía. ¡Buen trabajo!
                  </td>
                </tr>
              ) : (
                ticketsFiltrados.map((ticket) => {
                  // Revisamos si ya seleccionó una prioridad en esta fila
                  const prioridadSeleccionada = prioridadesTemporales[ticket.id] || "";
                  // El botón solo se activa si hay una prioridad seleccionada
                  const botonActivo = prioridadSeleccionada !== "";

                  return (
                    <tr key={ticket.id} className="hover:bg-beige/30 transition-colors">
                      <td className="p-4 text-moss-light font-mono font-bold">#{ticket.id}</td>
                      <td className="p-4 text-moss font-semibold">{ticket.cliente}</td>
                      <td className="p-4 text-moss-light max-w-xs truncate" title={ticket.titulo}>{ticket.titulo}</td>
                      
                      {/* NUEVO: Selector de Prioridad Inline */}
                      <td className="p-4">
                        <select 
                          value={prioridadSeleccionada}
                          onChange={(e) => handleCambioPrioridad(ticket.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-bold focus:outline-none cursor-pointer transition-colors ${
                            prioridadSeleccionada === '' ? 'border-red-300 bg-red-50 text-red-700' : 'border-moss-satin bg-moss-satin/10 text-moss-satin'
                          }`}
                        >
                          <option value="" disabled>Requerido...</option>
                          <option value="Urgente">🚨 Urgente</option>
                          <option value="Alta">⬆️ Alta</option>
                          <option value="Media">➡️ Media</option>
                          <option value="Baja">⬇️ Baja</option>
                        </select>
                      </td>

                      {/* NUEVO: Botón Inteligente (Gris si está inactivo, Verde si está listo) */}
                      <td className="p-4 text-center">
                        <button 
                          disabled={!botonActivo}
                          onClick={() => handleTomarTicket(ticket.id)}
                          className={`font-heading font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all ${
                            botonActivo 
                              ? 'bg-moss-satin text-pastel-green hover:bg-moss cursor-pointer transform hover:-translate-y-0.5' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Tomar Ticket
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TecnicoDashboard;