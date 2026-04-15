import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ esAdmin, esTecnico }) => {
  const [expandido, setExpandido] = useState(false);
  
  const menuAdmin = [
    { nombre: 'Piscina de Tickets', icono: '🌊', ruta: '/dashboard' },
    { nombre: 'Mis Tickets', icono: '🎫', ruta: '/dashboard/mis-tickets' },
    { nombre: 'Historial', icono: '✅', ruta: '/dashboard/historial' },
    { nombre: 'Gestión de Personal', icono: '👥', ruta: '/dashboard/personal' },
    { nombre: 'Configuración', icono: '⚙️', ruta: '/dashboard/configuracion' },
  ];

  const menuTecnico = [
    { nombre: 'Piscina de Tickets', icono: '🌊', ruta: '/dashboard' },
    { nombre: 'Mis Tickets', icono: '🎫', ruta: '/dashboard/mis-tickets' },
    { nombre: 'Historial', icono: '✅', ruta: '/dashboard/historial' },
    { nombre: 'Configuración', icono: '⚙️', ruta: '/dashboard/configuracion' },
  ];

  const menuCliente = [
    { nombre: 'Panel General', icono: '📊', ruta: '/dashboard' },
    { nombre: 'Mi Historial', icono: '📁', ruta: '/dashboard/historial-cliente' },
    { nombre: 'Configuración', icono: '⚙️', ruta: '/dashboard/configuracion' },
  ];

  const opciones = esAdmin ? menuAdmin : (esTecnico ? menuTecnico : menuCliente);
  const nombreRolLimpio = esAdmin ? 'Admin' : (esTecnico ? 'Técnico' : 'Cliente');

  return (
    <aside 
      onMouseEnter={() => setExpandido(true)}
      onMouseLeave={() => setExpandido(false)}
      className={`bg-moss text-beige flex flex-col h-full shadow-2xl z-20 transition-all duration-[1200ms] ease-in-out ${expandido ? 'w-64' : 'w-20'}`}
    > 
      {/* Logotipo y Navegación a LP */}
      <div className="p-6 border-b border-moss-light/30 flex flex-col items-center justify-center overflow-hidden">
        <Link 
          to="/" 
          title="Volver a la página principal"
          className="text-3xl font-heading font-bold tracking-widest cursor-pointer transition-all hover:scale-105"
        >
          STS<span className="text-pastel-green"></span>
        </Link>
        
        <div className={`mt-2 text-center transition-all duration-[1200ms] ${expandido ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0 overflow-hidden'}`}>
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
            <span className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-[1200ms] ${expandido ? 'w-48 opacity-100' : 'w-0 opacity-0'}`}>
              {item.nombre}
            </span>
          </Link>
        ))}
      </nav>
      {/* Botón de Soporte/Bug al fondo */}
      <div className="p-4 border-t border-moss-light/30">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('abrir-soporte'))}
          className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl bg-moss-satin/30 hover:bg-pastel-green hover:text-moss text-pastel-green transition-all duration-[1200ms] group`}
          title={!expandido ? "Reportar Bug" : ""}
        >
          <span className="text-xl group-hover:rotate-12 transition-transform duration-[1200ms]">🐞</span>
          <span className={`font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-[1200ms] ${expandido ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
            Reportar Bug
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;