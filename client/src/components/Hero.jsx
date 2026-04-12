const Hero = () => {
  return (
    <section className="relative bg-moss min-h-screen flex items-center justify-center">
      {/* Contenedor Principal */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20">
        
        {/* Etiqueta superior (Opcional, da un toque muy SaaS) */}
        <div className="inline-block bg-moss-light text-pastel-green font-mono text-xs px-4 py-1.5 rounded-full mb-6 tracking-wide border border-pastel-green/30">
          STS v1.0 - Próximamente
        </div>

        {/* Gran Titular (Nuestro Lema) */}
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-beige mb-6 leading-tight">
          Soporte técnico invisible, <br/>
          <span className="text-pastel-green">resultados brillantes.</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl font-body text-beige-dark mb-10 max-w-2xl mx-auto leading-relaxed">
          Gestiona, resuelve y escala. El HelpDesk en la nube diseñado para equipos ágiles que exigen control total y resoluciones en tiempo récord.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="bg-pastel-green text-moss font-heading font-bold text-base px-8 py-3.5 rounded-full hover:bg-beige transition-all shadow-lg transform hover:-translate-y-1 w-full sm:w-auto">
            Comenzar Prueba Gratis
          </button>
          <button className="border-2 border-beige-dark text-beige font-heading font-bold text-base px-8 py-3.5 rounded-full hover:bg-beige hover:text-moss transition-all w-full sm:w-auto">
            Explorar Planes
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;