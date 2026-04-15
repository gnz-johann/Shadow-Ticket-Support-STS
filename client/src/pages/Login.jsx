import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Verificando credenciales...');
    
    try {
      const respuesta = await axios.post('https://shadow-ticket-support-backend-jace.onrender.com/api/login', { correo, pass });
      localStorage.setItem('token_sts', respuesta.data.token);
      navigate('/dashboard'); 
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      
      {/* 🖼️ FONDO FOTOGRÁFICO HOMOGÉNEO CON LA LP */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Fondo" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-moss-deep/70 backdrop-blur-[4px]"></div>
      </div>

      {/* BOTÓN "VOLVER" REDISEÑADO: MÁS SÓLIDO Y VISIBLE */}
      <Link to="/" className="absolute top-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 text-beige font-bold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-pastel-green hover:text-moss transition-all duration-[1200ms] z-20 shadow-lg">
        <span>←</span> Volver a STS
      </Link>

      <div className="bg-white w-full max-w-sm p-10 rounded-3xl shadow-2xl relative z-10 border border-beige-dark/50">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-moss tracking-tight">Acceso STS</h2>
          <p className="font-body text-moss-light text-sm mt-1">Ingresa para gestionar tus tickets</p>
        </div>

        {mensaje && (
          <div className="mb-6 p-3 rounded-xl text-xs font-bold text-center bg-red-50 text-red-600 border border-red-100">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-2">Correo Corporativo</label>
            <input 
              type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss transition-all duration-[1200ms]"
              placeholder="usuario@empresa.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-moss-light mb-2">Contraseña</label>
            <input 
              type="password" value={pass} onChange={(e) => setPass(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark focus:outline-none focus:border-moss transition-all duration-[1200ms]"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full bg-moss text-beige font-bold py-3.5 rounded-xl hover:bg-moss-satin transition-all duration-[1200ms] shadow-lg mt-2">
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center border-t border-beige-dark pt-6">
          <p className="text-sm text-moss-light">
            ¿No tienes cuenta? <Link to="/registro" className="font-bold text-moss hover:text-pastel-green transition-colors duration-[1200ms] underline decoration-2 underline-offset-4">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;