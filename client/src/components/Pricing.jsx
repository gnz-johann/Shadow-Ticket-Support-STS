const Pricing = ({onSelectPlan}) => {
  // Estructura de nuestros 3 planes estratégicos
  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Perfecto para probar el sistema.",
      features: [
        "1 Técnico en el sistema",
        "Hasta 50 tickets al mes",
        "Gestión básica de estados",
        "Comentarios simples"
      ],
      buttonText: "Empezar Gratis",
      isPopular: false
    },
    {
      name: "Business",
      price: "19.99",
      description: "Para equipos ágiles y PYMES.",
      features: [
        "Hasta 5 Técnicos",
        "Tickets ilimitados",
        "Priorización de tickets",
        "Automatización de cierre (Triggers)",
        "Reportes básicos SQL"
      ],
      buttonText: "Suscribirse - PayPal",
      isPopular: true // Este valor hará que la tarjeta resalte
    },
    {
      name: "Enterprise",
      price: "49.99",
      description: "Control corporativo total.",
      features: [
        "Técnicos ilimitados",
        "Soporte prioritario 24/7",
        "Acceso directo a la API",
        "Métricas avanzadas",
        "SLA garantizado"
      ],
      buttonText: "Contactar Ventas",
      isPopular: false
    }
  ];

  return (
    <section id="planes" className="py-24 bg-beige-dark/20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-moss mb-4">
            Planes diseñados para escalar
          </h2>
          <p className="text-lg font-body text-moss-light max-w-2xl mx-auto">
            Elige el plan que mejor se adapte al tamaño de tu equipo. Sin contratos forzosos, cancela cuando quieras.
          </p>
        </div>

        {/* Cuadrícula de Precios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-8 shadow-lg transition-transform duration-[800ms] relative ${
                plan.isPopular 
                  ? 'bg-moss text-beige transform md:-translate-y-4 border-2 border-pastel-green' 
                  : 'bg-white text-moss border border-beige-dark hover:-translate-y-2'
              }`}
            >
              {/* Etiqueta de Recomendado */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pastel-green text-moss font-heading font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider">
                  Más Popular
                </div>
              )}


              <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
              <p className={`font-body text-sm mb-6 ${plan.isPopular ? 'text-beige-dark' : 'text-moss-light'}`}>
                {plan.description}
              </p>
              
              <div className="mb-8">
                <span className="font-mono text-5xl font-bold">${plan.price}</span>
                <span className={`font-body text-sm ${plan.isPopular ? 'text-beige-dark' : 'text-moss-light'}`}> / USD mes</span>
              </div>

              <ul className="space-y-4 mb-8 font-body">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className={`mr-3 ${plan.isPopular ? 'text-pastel-green' : 'text-moss'}`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onSelectPlan(plan)} // 2. AÑADIMOS EL EVENTO CLIC AQUÍ
                className={`w-full py-3 rounded-full font-heading font-bold transition-colors ${
                  plan.isPopular ? 'bg-pastel-green text-moss hover:bg-beige' : 'bg-moss text-beige hover:bg-moss-light'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Pricing;