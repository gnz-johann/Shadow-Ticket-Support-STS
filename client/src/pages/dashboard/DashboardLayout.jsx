import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ClienteDashboard from './ClienteDashboard';
import { Toaster, toast } from 'react-hot-toast'; 
import axios from 'axios';

const DashboardLayout = () => {
  const [usuario, setUsuario] = useState(null);

  // Estados para nuestra nueva lógica de suscripción
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // 2. Inicializamos el rastreador de URL

  useEffect(() => {
    const token = localStorage.getItem('token_sts');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      setUsuario({ 
        id: payload.id,
        nombre: payload.nombre, 
        rol: payload.rol,
        plan: 'Gratis' // Por defecto al iniciar, en una versión futura se leería del token
      });
    } catch (error) {
      localStorage.removeItem('token_sts');
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) return <div className="min-h-screen bg-beige flex justify-center items-center animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-moss"></div>;

  const rolNormalizado = usuario.rol.toUpperCase();
  const esAdmin = rolNormalizado === 'ADMIN';
  const esTecnico = rolNormalizado === 'TÉCNICO' || rolNormalizado === 'TECNICO'; 
  const accesoInterno = esAdmin || esTecnico;
  const esRutaRaiz = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  // Función de la jugada maestra (Simulador de PayPal)
  const handlePagoSuscripcion = async (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    const toastId = toast.loading('Conectando con la pasarela bancaria...');

    try {
      // Intentamos procesar el pago con la API
      await axios.put(`http://localhost:4000/api/cliente/${usuario.id}/suscripcion`, {
        id_plan: 2, // Plan Premium
        numero_tarjeta: numeroTarjeta.replace(/\s/g, '') // Quitamos espacios
      });

      toast.success('¡Pago exitoso! Bienvenido a Premium', { id: toastId });
      setUsuario({ ...usuario, plan: 'Premium' });
      setModalPagoAbierto(false);
      setMenuAbierto(false);
      setNumeroTarjeta('');
    } catch (error) {
      // Si el algoritmo de Luhn falla, el backend mandará este error
      toast.error(error.response?.data?.mensaje || 'Error en la transacción', { id: toastId });
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <div className="flex h-screen bg-beige font-body overflow-hidden">
      <Toaster position="top-right" />
      <Sidebar esAdmin={esAdmin} esTecnico={esTecnico} />
      
      <div className="flex-1 flex flex-col w-full h-full relative">
        <header className="bg-white shadow-sm border-b border-beige-dark px-10 py-5 flex justify-between items-center z-10 relative">
          <h1 className="text-2xl font-heading font-bold text-moss">Resumen General</h1>
          
          <div className="flex items-center gap-4 relative">
            <span className="text-moss font-semibold text-sm">Hola, {usuario.nombre}</span>
            
            {/* Botón del Perfil */}
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="w-11 h-11 rounded-full bg-pastel-green flex justify-center items-center text-moss font-bold font-heading shadow-inner border border-moss/10 hover:ring-2 hover:ring-moss-satin transition-all"
            >
              {usuario.nombre?.charAt(0) || 'U'}
            </button>

            {/* Menú Desplegable del Usuario */}
            {menuAbierto && (
              <div className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-beige-dark p-5 z-50 animate-fadeIn">
                <p className="text-xs font-bold text-moss-light uppercase tracking-wider">Tu Plan Actual</p>
                <div className="flex items-center gap-3 mt-2 mb-4">
                  <span className="text-2xl">{usuario.plan === 'Premium' ? '👑' : '🛡️'}</span>
                  <p className="font-bold text-lg text-moss">{usuario.plan}</p>
                </div>
                
                {usuario.plan === 'Gratis' && !accesoInterno && (
                  <button 
                    onClick={() => setModalPagoAbierto(true)}
                    className="w-full bg-moss-satin text-beige py-2.5 rounded-xl font-bold hover:bg-moss transition-colors shadow-md text-sm"
                  >
                    Mejorar a Premium
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-beige-dark/10 p-10">
          {accesoInterno ? <Outlet /> : (esRutaRaiz ? <ClienteDashboard /> : <Outlet />)}
        </main>
      </div>

      {/* Modal Simulador de Pago */}
      {modalPagoAbierto && (
        <div className="fixed inset-0 bg-moss-deep/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-beige-dark">
            <div className="bg-moss p-6 flex justify-between items-center text-beige">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2">
                💳 Pasarela Segura
              </h3>
              <button onClick={() => setModalPagoAbierto(false)} className="text-2xl hover:text-pastel-green transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handlePagoSuscripcion} className="p-8 space-y-5">
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-moss">$19.99 USD</p>
                <p className="text-sm text-moss-light">Plan Premium Anual</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-moss mb-2">Número de Tarjeta (Verificación Estructural)</label>
                <input 
                  type="text" 
                  required 
                  value={numeroTarjeta} 
                  onChange={(e) => setNumeroTarjeta(e.target.value.replace(/[^0-9\s]/g, ''))}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none font-mono text-center tracking-widest text-lg"
                />
              </div>

              <button 
                type="submit" 
                disabled={procesandoPago}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${procesandoPago ? 'bg-gray-300 text-gray-500' : 'bg-moss-satin text-beige hover:bg-moss hover:-translate-y-0.5'}`}
              >
                {procesandoPago ? 'Procesando...' : 'Confirmar Pago'}
              </button>
              <p className="text-[10px] text-center text-moss-light mt-2">
                Demostración académica. Se aplicará validación de Luhn.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;