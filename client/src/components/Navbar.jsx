import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem('token_sts');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario(payload);
      } catch (e) {
        localStorage.removeItem('token_sts');
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-[1200ms] ease-in-out ${isScrolled ? 'bg-moss shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        <Link to="/" className="text-beige font-heading font-bold text-2xl tracking-widest cursor-pointer transition-transform duration-[1200ms] hover:scale-105">
          STS<span className="text-pastel-green"></span>
        </Link>

        <div className="hidden md:flex space-x-10 text-beige font-heading text-sm font-semibold tracking-wide">
          <Link to="/" className="hover:text-pastel-green transition-colors duration-[1200ms]">Inicio</Link>
          <a href="/#caracteristicas" className="hover:text-pastel-green transition-colors duration-[1200ms]">Características</a>
          <a href="/#planes" className="hover:text-pastel-green transition-colors duration-[1200ms]">Planes</a>
          <Link to="/contacto" className="hover:text-pastel-green transition-colors duration-[1200ms]">Contacto</Link>
        </div>

        <div className="flex space-x-6 items-center">
          {usuario ? (
            /* 🟢 SI HAY SESIÓN: Mostramos Texto + Avatar 🟢 */
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="hidden md:block text-beige font-heading text-sm font-bold hover:text-pastel-green transition-colors duration-[1200ms]"
              >
                Mi Espacio de Trabajo
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-pastel-green flex justify-center items-center text-moss font-bold font-heading shadow-inner border border-moss/10 hover:ring-2 hover:ring-beige transition-all duration-[1200ms]"
                title="Ir a mi área de trabajo"
              >
                {usuario.nombre?.charAt(0) || 'U'}
              </button>
            </div>
          ) : (
            /* 🔴 SI NO HAY SESIÓN: Mostrar botones clásicos 🔴 */
            <>
              <Link to="/login" className="hidden md:block text-beige font-heading text-sm font-semibold hover:text-pastel-green transition-colors duration-[1200ms]">
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="bg-beige text-moss font-heading font-bold text-sm px-6 py-2.5 rounded-full hover:bg-beige-dark transition-all duration-[1200ms] shadow-md transform hover:scale-105">
                Prueba Gratis
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;