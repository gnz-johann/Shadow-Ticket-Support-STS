import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-[1200ms] ease-in-out ${
        isScrolled ? 'bg-moss shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logotipo */}
        <div className="text-beige font-heading font-bold text-2xl tracking-widest cursor-pointer">
          STS<span className="text-pastel-green"></span>
        </div>

        {/* Enlaces Centrales */}
        <div className="hidden md:flex space-x-10 text-beige font-heading text-sm font-semibold tracking-wide">
          <a href="#inicio" className="hover:text-pastel-green transition-colors">Inicio</a>
          <a href="#caracteristicas" className="hover:text-pastel-green transition-colors">Características</a>
          <a href="#planes" className="hover:text-pastel-green transition-colors">Planes</a>
        </div>

       {/* Botones de Acción */}
        <div className="flex space-x-6 items-center">
          
          <Link 
            to="/login"
            className="hidden md:block text-beige font-heading text-sm font-semibold hover:text-pastel-green transition-colors"
          >
            Iniciar Sesión
          </Link>
          
          {/* 🟢 ACTUALIZADO: Ahora manda a /registro 🟢 */}
          <Link 
            to="/registro"
            className="bg-beige text-moss font-heading font-bold text-sm px-6 py-2.5 rounded-full hover:bg-beige-dark transition-all duration-[800ms] shadow-md transform hover:scale-105"
          >
            Prueba Gratis
          </Link>
          
        </div>

      </div>
    </nav>
  );
};

export default Navbar;