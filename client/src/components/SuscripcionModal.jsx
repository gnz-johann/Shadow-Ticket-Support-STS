import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// 1. Quitamos 'usuarioId' de aquí arriba, ya no lo necesitamos
const SubscriptionModal = ({ isOpen, onClose, plan }) => {
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [procesando, setProcesando] = useState(false);

  if (!isOpen) return null;

  const handlePago = async (e) => {
    e.preventDefault();
    setProcesando(true);
    const toastId = toast.loading('Procesando pago con PayPal...');

    try {
      // Sacamos el ID del usuario directamente de su token
      const token = localStorage.getItem('token_sts');
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const idRealDelCliente = payload.id;

      // Enviamos el pago a nuestra ruta validadora
      await axios.put(`https://shadow-ticket-support-backend-jace.onrender.com/cliente/${idRealDelCliente}/suscripcion`, {
        id_plan: plan.name === 'Premium' ? 2 : (plan.name === 'Enterprise' ? 3 : 1), 
        numero_tarjeta: numeroTarjeta.replace(/\s/g, '')
      });

      toast.success(`¡Pago exitoso! Bienvenido al Plan ${plan.name}`, { id: toastId });
      
      // Cerramos el modal y recargamos la página para actualizar el dashboard
      setTimeout(() => {
        onClose();
        window.location.reload(); 
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error en la transacción', { id: toastId });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-pop">
        {/* Cabecera estilo PayPal */}
        <div className="bg-[#003087] p-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tighter italic">
            Pay<span className="text-[#009cde]">Pal</span>
          </h2>
        </div>

        <form onSubmit={handlePago} className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-moss-light text-sm uppercase font-bold">Pago de Suscripción</p>
            <h3 className="text-2xl font-bold text-moss mt-1">Plan {plan?.name}</h3>
            <p className="text-3xl font-heading font-bold text-moss-satin mt-2">${plan?.price} USD</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-moss uppercase mb-2">Número de Tarjeta</label>
              <input 
                type="text"
                required
                maxLength="19"
                value={numeroTarjeta}
                onChange={(e) => setNumeroTarjeta(e.target.value.replace(/[^0-9\s]/g, ''))}
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-[#0070ba] outline-none font-mono text-lg text-center tracking-widest"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-moss uppercase mb-2">Vencimiento</label>
                <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark outline-none focus:border-[#0070ba]" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-moss uppercase mb-2">CVC</label>
                <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark outline-none focus:border-[#0070ba]" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={procesando}
            className="w-full bg-[#ffc439] hover:bg-[#f2ba36] text-[#003087] font-bold py-3.5 rounded-full shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2"
          >
            {procesando ? 'Validando...' : 'Pagar ahora'}
          </button>
          
          <button type="button" onClick={onClose} className="w-full text-xs text-moss-light hover:text-moss underline decoration-dotted">
            Cancelar y volver a Shadow Ticket Support
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. ¡LA PUERTA DE SALIDA! Esto es lo que faltaba para que Home.jsx lo pueda leer
export default SubscriptionModal;