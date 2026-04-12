import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import ClienteDashboard from './ClienteDashboard';
import { Toaster } from 'react-hot-toast'; // Se borró la importación que no se usaba

const DashboardLayout = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token_sts');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      setUsuario({ 
        nombre: payload.nombre, 
        rol: payload.rol 
      });
    } catch (error) {
      console.error("Error leyendo el token", error);
      localStorage.removeItem('token_sts');
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) {
    return (
      <div className="min-h-screen bg-beige flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-moss"></div>
      </div>
    );
  }

  // VALIDACIÓN ROBUSTA DE 3 NIVELES
  const rolNormalizado = usuario.rol.toUpperCase();
  const esAdmin = rolNormalizado === 'ADMIN';
  const esTecnico = rolNormalizado.includes('T'); 
  // Permitimos el paso al panel interno si es Admin o Técnico
  const accesoInterno = esAdmin || esTecnico;

  return (
    <div className="flex h-screen bg-beige font-body overflow-hidden">
        <Toaster position="top-right" reverseOrder={false} />
        
      {/* 2. Le pasamos la variable inteligente al Sidebar */}
     <Sidebar esAdmin={esAdmin} esTecnico={esTecnico} />
      
      <div className="flex-1 flex flex-col w-full h-full">
        
        <header className="bg-white shadow-sm border-b border-beige-dark px-10 py-5 flex justify-between items-center z-10">
          <h1 className="text-2xl font-heading font-bold text-moss">Resumen General</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-moss font-semibold text-sm">Hola, {usuario.nombre}</span>
            <div className="w-11 h-11 rounded-full bg-pastel-green flex justify-center items-center text-moss font-bold font-heading shadow-inner border border-moss/10">
              {usuario.nombre?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-beige-dark/10 p-10">
          {accesoInterno ? <Outlet /> : <ClienteDashboard />}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;