import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ClienteDashboard from './ClienteDashboard';
import { Toaster, toast } from 'react-hot-toast'; 
import axios from 'axios';

const DashboardLayout = () => {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  // Estados de Pago
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [procesandoPago, setProcesandoPago] = useState(false);

  // 🟢 NUEVOS ESTADOS DE SOPORTE 🟢
  const [modalSoporteAbierto, setModalSoporteAbierto] = useState(false);
  const [reporte, setReporte] = useState({ tipo: 'Bug', descripcion: '' });

  const navigate = useNavigate();
  const location = useLocation();

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
        plan: 'Gratis'
      });
    } catch (error) {
      localStorage.removeItem('token_sts');
      navigate('/login');
    }

    // 🟢 ESCUCHADOR PARA ABRIR EL MODAL DESDE EL SIDEBAR 🟢
    const abrirSoporte = () => setModalSoporteAbierto(true);
    window.addEventListener('abrir-soporte', abrirSoporte);
    return () => window.removeEventListener('abrir-soporte', abrirSoporte);

  }, [navigate]);

  if (!usuario) return <div className="min-h-screen bg-beige flex justify-center items-center animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-moss"></div>;

  const rolNormalizado = usuario.rol.toUpperCase();
  const esAdmin = rolNormalizado === 'ADMIN';
  const esTecnico = rolNormalizado === 'TÉCNICO' || rolNormalizado === 'TECNICO'; 
  const accesoInterno = esAdmin || esTecnico;
  const esRutaRaiz = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  const handleLogout = () => {
    localStorage.removeItem('token_sts');
    navigate('/login');
  };

  const handlePagoSuscripcion = async (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    const toastId = toast.loading('Conectando con la pasarela bancaria...');

    try {
      await axios.put(`http://localhost:4000/api/cliente/${usuario.id}/suscripcion`, {
        id_plan: 2,
        numero_tarjeta: numeroTarjeta.replace(/\s/g, '')
      });

      toast.success('¡Pago exitoso! Bienvenido a Premium', { id: toastId });
      setUsuario({ ...usuario, plan: 'Premium' });
      setModalPagoAbierto(false);
      setMenuAbierto(false);
      setNumeroTarjeta('');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error en la transacción', { id: toastId });
    } finally {
      setProcesandoPago(false);
    }
  };

  // 🟢 FUNCIÓN PARA ENVIAR EL REPORTE DE BUG 🟢
  const enviarReporte = async (e) => {
    e.preventDefault();
    const tid = toast.loading('Enviando reporte al equipo STS...');
    try {
      await axios.post('http://localhost:4000/api/soporte/reportar', {
        id_usuario: usuario.id,
        ...reporte
      });
      toast.success('¡Gracias! Reporte recibido.', { id: tid });
      setModalSoporteAbierto(false);
      setReporte({ tipo: 'Bug', descripcion: '' });
    } catch (e) { 
      toast.error('Error al enviar el reporte.', { id: tid }); 
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
            
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="w-11 h-11 rounded-full bg-pastel-green flex justify-center items-center text-moss font-bold font-heading shadow-inner border border-moss/10 hover:ring-2 hover:ring-moss-satin transition-all duration-[1200ms]"
            >
              {usuario.nombre?.charAt(0) || 'U'}
            </button>

            {menuAbierto && (
              <div className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-beige-dark p-5 z-50 animate-fadeIn">
                <p className="text-xs font-bold text-moss-light uppercase tracking-wider">Tu Plan Actual</p>
                <div className="flex items-center gap-3 mt-2 mb-4">
                  <span className="text-2xl">{usuario.plan === 'Premium' ? '👑' : '🛡️'}</span>
                  <p className="font-bold text-lg text-moss">{usuario.plan}</p>
                </div>
                
                {usuario.plan === 'Gratis' && !accesoInterno && (
                  <button 
                    onClick={() => {
                      setModalPagoAbierto(true);
                      setMenuAbierto(false);
                    }}
                    className="w-full bg-moss-satin text-beige py-2.5 rounded-xl font-bold hover:bg-moss transition-all duration-[1200ms] shadow-md text-sm mb-4"
                  >
                    Mejorar a Premium
                  </button>
                )}

                <div className="border-t border-beige-dark pt-4 space-y-3">
                  <button 
                    onClick={() => {
                      navigate('/dashboard/configuracion');
                      setMenuAbierto(false);
                    }}
                  className="w-full text-left text-sm font-bold text-moss hover:text-pastel-green transition-all duration-[1200ms] flex items-center gap-2"
                  >
                    ⚙️ Configuración
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-sm font-bold text-red-500 hover:text-red-700 transition-all duration-[1200ms] flex items-center gap-2"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-beige-dark/10 p-10">
          {accesoInterno ? <Outlet /> : (esRutaRaiz ? <ClienteDashboard /> : <Outlet />)}
        </main>
      </div>

      {/* MODAL DE PAGO */}
      {modalPagoAbierto && (
        <div className="fixed inset-0 bg-moss-deep/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-beige-dark">
            <div className="bg-moss p-6 flex justify-between items-center text-beige">
              <h3 className="text-xl font-bold font-heading flex items-center gap-2">💳 Pasarela Segura</h3>
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:border-moss-satin outline-none font-mono text-center tracking-widest text-lg transition-all duration-[1200ms]"
                />
              </div>

              <button 
                type="submit" 
                disabled={procesandoPago}
                className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-[1200ms] ${procesandoPago ? 'bg-gray-300 text-gray-500' : 'bg-moss-satin text-beige hover:bg-moss hover:-translate-y-0.5'}`}
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

      {/* 🟢 MODAL DE SOPORTE INTERNO (NUEVO) 🟢 */}
      {modalSoporteAbierto && (
        <div className="fixed inset-0 bg-moss-deep/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-beige-dark overflow-hidden">
            <div className="bg-moss p-6 flex justify-between items-center text-beige">
              <h3 className="text-xl font-bold font-heading">🐞 Reportar un Problema</h3>
              <button onClick={() => setModalSoporteAbierto(false)} className="text-2xl hover:text-pastel-green transition-all duration-[1200ms]">&times;</button>
            </div>
            <form onSubmit={enviarReporte} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-moss-light uppercase mb-2 tracking-widest">¿Qué detectaste?</label>
                <select 
                  value={reporte.tipo} 
                  onChange={(e) => setReporte({...reporte, tipo: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark outline-none focus:border-moss-satin transition-all duration-[1200ms]"
                >
                  <option value="Bug">Error del Sistema (Bug)</option>
                  <option value="Sugerencia">Sugerencia de Mejora</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-moss-light uppercase mb-2 tracking-widest">Descripción</label>
                <textarea 
                  required
                  rows="4"
                  value={reporte.descripcion}
                  onChange={(e) => setReporte({...reporte, descripcion: e.target.value})}
                  placeholder="Explícanos brevemente qué sucedió..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark outline-none focus:border-moss-satin transition-all duration-[1200ms]"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-moss text-beige py-4 rounded-xl font-bold shadow-lg hover:bg-moss-satin transition-all duration-[1200ms] hover:-translate-y-1">
                Enviar Reporte
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;