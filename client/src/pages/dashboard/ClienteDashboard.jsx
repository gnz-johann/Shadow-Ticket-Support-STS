import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ClienteDashboard = () => {
  // 1. Iniciamos el historial totalmente vacío (esperando los datos reales)
  const [misTickets, setMisTickets] = useState([]);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  // 2. Función maestra para traer los tickets del backend
  const cargarHistorial = async () => {
    try {
      const token = localStorage.getItem('token_sts');
      if (!token) return;
      
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const id_cliente = payload.id;

      const respuesta = await axios.get(`https://shadow-ticket-support-backend-jace.onrender.com/tickets/cliente/${id_cliente}`);
      setMisTickets(respuesta.data); // Guardamos los tickets reales
    } catch (error) {
      toast.error("No se pudo cargar tu historial de tickets.");
    }
  };

  // 3. El Hook que ejecuta la carga al entrar a la pantalla
  useEffect(() => {
    cargarHistorial();
  }, []);

  // 4. ¡Métricas Dinámicas! Calculamos las cantidades al vuelo
  const ticketsAbiertos = misTickets.filter(t => t.estado === 'Abierto').length;
  const ticketsEnProceso = misTickets.filter(t => t.estado === 'En Proceso').length;
  const ticketsResueltos = misTickets.filter(t => t.estado === 'Resuelto').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const toastId = toast.loading('Enviando tu solicitud...');

    try {
      // 1. Extraemos el ID real del usuario desde su Token
      const token = localStorage.getItem('token_sts');
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const idRealDelCliente = payload.id;

      // 2. Enviamos la petición con el ID dinámico
      await axios.post('https://shadow-ticket-support-backend-jace.onrender.com/tickets', {
        id_cliente: idRealDelCliente, // <--- ¡Aquí estaba el error!
        titulo,
        descripcion
        // Recuerda que quitamos la 'prioridad' porque el cliente ya no la elige
      });

      setTitulo('');
      setDescripcion('');
      toast.success('¡Ticket enviado a soporte con éxito!', { id: toastId });
      
      // 5. ¡El Toque Final! Recargamos la lista para ver el ticket nuevo
      cargarHistorial();

    } catch (error) {
      console.error("Error al enviar ticket", error);
      toast.error('Hubo un problema al enviar el ticket.', { id: toastId });
    } finally {
      setEnviando(false);
    }
  };

  // Función auxiliar para dar formato bonito a la fecha
  const formatearFecha = (cadenaFecha) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(cadenaFecha).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="space-y-8">
      
      {/* --- ZONA 1: TARJETAS DE MÉTRICAS CONECTADAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex items-center justify-between">
          <div>
            <p className="text-moss-light font-heading text-sm font-bold uppercase tracking-wider">Abiertos</p>
            <p className="text-3xl font-bold text-moss mt-1">{ticketsAbiertos}</p>
          </div>
          <div className="text-4xl">📬</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex items-center justify-between">
          <div>
            <p className="text-moss-light font-heading text-sm font-bold uppercase tracking-wider">En Proceso</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{ticketsEnProceso}</p>
          </div>
          <div className="text-4xl">⚙️</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige-dark flex items-center justify-between">
          <div>
            <p className="text-moss-light font-heading text-sm font-bold uppercase tracking-wider">Resueltos</p>
            <p className="text-3xl font-bold text-pastel-green mt-1">{ticketsResueltos}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* --- ZONA 2: FORMULARIO DE NUEVO TICKET --- */}
        <div className="xl:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-beige-dark h-fit">
          <h2 className="text-2xl font-heading font-bold text-moss mb-6">Levantar Ticket</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-moss mb-2 font-heading">Asunto del Problema</label>
              <input 
                type="text" 
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Mi computadora no enciende..."
                className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-moss mb-2 font-heading">Descripción Detallada</label>
              <textarea 
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe qué estabas haciendo cuando ocurrió el error..."
                className="w-full h-32 px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss-satin font-body text-sm resize-none transition-colors"
              />
            </div>

            {/* Agregado el disabled=enviando para bloquear el botón */}
            <button 
              type="submit" 
              disabled={enviando}
              className={`w-full font-heading font-bold py-3.5 rounded-xl shadow-md transition-all ${
                enviando 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-moss-satin text-pastel-green hover:bg-moss transform hover:-translate-y-0.5'
              }`}
            >
              {enviando ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>

        {/* --- ZONA 3: HISTORIAL DE TICKETS CONECTADO --- */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-beige-dark overflow-hidden flex flex-col">
          <div className="p-6 border-b border-beige-dark bg-beige-dark/10">
            <h2 className="text-xl font-heading font-bold text-moss">Mi Historial Reciente</h2>
          </div>
          
          <div className="p-6 flex-1 h-[500px] overflow-y-auto">
            {misTickets.length === 0 ? (
              <div className="h-full flex items-center justify-center text-moss-light italic">
                Aún no has creado ningún ticket.
              </div>
            ) : (
              <div className="space-y-4">
                {misTickets.map(ticket => (
                  <div key={ticket.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border-2 border-beige-dark hover:border-moss-satin transition-colors">
                    <div>
                      <span className="text-xs font-mono font-bold text-moss-light">#{ticket.id}</span>
                      <h3 className="font-heading font-bold text-moss">{ticket.titulo}</h3>
                      <p className="text-xs font-body text-moss-light mt-1">Abierto el: {formatearFecha(ticket.fecha)}</p>
                    </div>
                    
                    {/* Estilos dinámicos dependiendo del estado del ticket */}
                    <span className={`mt-3 sm:mt-0 px-3 py-1 rounded-full text-xs font-bold border ${
                      ticket.estado === 'Resuelto' ? 'bg-green-100 text-green-700 border-green-200' : 
                      ticket.estado === 'En Proceso' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {ticket.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClienteDashboard;