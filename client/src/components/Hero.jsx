import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[85vh]">
      
      {/* IMAGEN DE FONDO CON OVERLAY OSCURO */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
          alt="Oficina moderna" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-moss-deep/70 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-beige mb-6 tracking-tight leading-tight">
          Soporte técnico continuo,<br/>
          <span className="text-pastel-green">resultados increíbles.</span>
        </h1>
        
        <p className="text-lg md:text-xl font-body text-beige-dark mb-10 max-w-3xl mx-auto leading-relaxed">
          Gestiona, resuelve y escala. El SaaS diseñado para equipos que exigen control total y resoluciones en tiempo récord.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/registro')} 
            className="bg-beige text-moss font-heading font-bold text-lg px-8 py-4 rounded-full hover:bg-pastel-green transition-all duration-[800ms] shadow-lg transform hover:-translate-y-1"
          >
            Comenzar Prueba Gratis
          </button>
          <a 
            href="#planes" 
            className="bg-transparent border-2 border-beige text-beige font-heading font-bold text-lg px-8 py-4 rounded-full hover:bg-beige/10 transition-all duration-[800ms] backdrop-blur-sm"
          >
            Explorar Planes
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;