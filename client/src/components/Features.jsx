const Features = () => {
  // Lista de características. ¡Fácil de editar y expandir!
  const featuresList = [
    {
      title: "Gestión Centralizada",
      description: "Visualiza y prioriza tickets en tiempo real con nuestro tablero interactivo diseñado para la máxima eficiencia.",
      icon: "📊" // Usamos emojis por ahora para agilizar, luego podemos cambiarlos por íconos SVG elegantes
    },
    {
      title: "Resolución Ágil",
      description: "Comunicación fluida entre clientes y técnicos mediante historiales de comentarios detallados y precisos.",
      icon: "⚡"
    },
    {
      title: "Métricas y Control",
      description: "Automatización de cierres y reportes precisos para mantener los estándares de calidad de tu equipo de soporte.",
      icon: "⚙️"
    }
  ];

  return (
    <section id="caracteristicas" className="py-24 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-moss mb-4">
            El motor detrás de tu soporte
          </h2>
          <p className="text-lg font-body text-moss-light max-w-2xl mx-auto">
            Todo lo que necesitas para brindar una experiencia de usuario excepcional, sin la complejidad ni la saturación de los sistemas tradicionales.
          </p>
        </div>

        {/* Cuadrícula de Tarjetas (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-[800ms] border border-beige-dark transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-6 bg-pastel-green inline-flex justify-center items-center w-16 h-16 rounded-xl shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-moss mb-3">
                {feature.title}
              </h3>
              <p className="font-body text-moss-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;