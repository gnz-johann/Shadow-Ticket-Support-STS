import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import SuscripcionModal from '../components/SuscripcionModal'; // Ajusta la ruta si es necesario

const Home = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const navigate = useNavigate();

  const manejarSeleccionPlan = (plan) => {
    // 1. Verificamos si hay un usuario logueado
    const token = localStorage.getItem('token_sts');
    if (!token) {
      toast.error('Debes iniciar sesión o registrarte para contratar un plan.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // 2. Si está logueado, abrimos la pasarela de pago
    setPlanSeleccionado(plan);
    setModalAbierto(true);
  };

  return (
    <div className="bg-beige min-h-screen relative">
      <Toaster position="top-right" />
      <Navbar />
      <Hero />
      <Features />
      
      {/* 3. Le pasamos la función a nuestros precios */}
      <Pricing onSelectPlan={manejarSeleccionPlan} />

      {/* 4. Nuestro Modal Simulador escondido */}
      <SuscripcionModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        plan={planSeleccionado} 
      />

      <footer className="bg-moss py-8 text-center text-beige-dark font-body text-sm">
        <p>© 2026 Shadow Ticket Support. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;