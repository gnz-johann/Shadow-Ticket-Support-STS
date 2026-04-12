import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ esAdmin, esTecnico }) => {
  // NIIVELES DE ACCESO //
  const navigate = useNavigate();
  const [expandido, setExpandido] = useState(false);

  // FUNCIÓN PARA DESTRUIR EL TOKEN Y CERRAR SESIÓN //
  const handleLogout = () => {
    localStorage.removeItem('token_sts');
    navigate('/login');
  };

  const menuAdmin = [
    { nombre: 'Piscina de Tickets', icono: '🌊', ruta: '/dashboard' },
    { nombre: 'Mis Tickets', icono: '🎫', ruta: '/dashboard/mis-tickets' },
    { nombre: 'Historial', icono: '✅', ruta: '/dashboard/historial' },
    { nombre: 'Gestión de Personal', icono: '👥', ruta: '/dashboard/personal' },  
  ];

  const menuTecnico = [
    { nombre: 'Piscina de Tickets', icono: '🌊', ruta: '/dashboard' },
    { nombre: 'Mis Tickets', icono: '🎫', ruta: '/dashboard/mis-tickets' },
    { nombre: 'Historial', icono: '✅', ruta: '/dashboard/historial' },
  ];

  const menuCliente = [
    { nombre: 'Panel Gneral', icono: '📊', ruta: '/dashboard' },
  ];

  const opciones = esAdmin ? menuAdmin : (esTecnico ? menuTecnico : menuCliente);
  const nombreRolLimpio = esAdmin ? 'Admin' : (esTecnico ? 'Técnico' : 'Cliente');

  return (
    <aside 
      onMouseEnter={() => setExpandido(true)}
      onMouseLeave={() => setExpandido(false)}
      // Transición suave del ancho (de 5rem/80px a 16rem/256px)
      className={`bg-moss text-beige flex flex-col h-full shadow-2xl z-20 transition-all duration-700 ease-in-out ${expandido ? 'w-64' : 'w-20'}`}
    > 
      {/* Logotipo y Navegación a LP */}
      <div className="p-6 border-b border-moss-light/30 flex flex-col items-center justify-center overflow-hidden">
        {/* Enlace hacia la ruta raíz (Landing Page) */}
        <Link 
          to="/" 
          title="Volver a la página principal"
          className="text-3xl font-heading font-bold tracking-widest cursor-pointer transition-all hover:scale-105"
        >
          {expandido ? <>STS<span className="text-pastel-green"></span></> : <>STS<span className="text-pastel-green"></span></>}
        </Link>
        
        {/* Etiqueta de Rol (Se oculta suavemente al colapsar) */}
        <div className={`mt-2 text-center transition-all duration-300 ${expandido ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <span className="inline-block bg-moss-satin text-pastel-green text-[10px] px-2 py-1 rounded-full font-mono font-bold uppercase tracking-wider shadow-inner">
            Portal {nombreRolLimpio}
          </span>
        </div>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-x-hidden">
        {opciones.map((item, index) => (
          <Link 
            key={index}
            to={item.ruta} 
            className="flex items-center px-3 py-3 rounded-xl hover:bg-moss-satin text-beige-dark hover:text-pastel-green font-body font-bold transition-all whitespace-nowrap"
            title={!expandido ? item.nombre : ""} 
          >
            <span className="text-xl flex-shrink-0">{item.icono}</span>
            {/* El secreto del ancho 0 para esconder limpiamente */}
            <span className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 ${expandido ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
              {item.nombre}
            </span>
          </Link>
        ))}
      </nav>

      {/* Cierre de Sesión */}
      <div className="p-3 border-t border-moss-light/30">
        <button 
          onClick={handleLogout} 
          className={`w-full flex items-center px-3 py-3 rounded-xl hover:bg-red-900/50 text-beige-dark hover:text-red-200 transition-colors font-body text-sm font-semibold whitespace-nowrap`}
          title="Cerrar Sesión"
        >
          <span className="text-xl flex-shrink-0">🚪</span>
          <span className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 ${expandido ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;