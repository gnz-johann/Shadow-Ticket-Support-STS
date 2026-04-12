import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';

const Home = () => {
  return (
    <div className="bg-beige min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <footer className="bg-moss py-8 text-center text-beige-dark font-body text-sm">
        <p>© 2026 Shadow Ticket Support. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;