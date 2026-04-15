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
      const respuesta = await axios.post('http://localhost:4000/api/login', { correo, pass });
      localStorage.setItem('token_sts', respuesta.data.token);
      navigate('/dashboard'); 
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-moss-deep flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* 🟢 EL BOTÓN DE VOLVER QUE PEDISTE 🟢 */}
      <Link to="/" className="absolute top-8 left-8 text-beige font-bold flex items-center gap-2 hover:text-pastel-green transition-colors z-10">
        <span>←</span> Volver a STS
      </Link>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-moss-satin rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>

      <div className="bg-beige w-full max-w-md p-10 rounded-3xl shadow-2xl relative z-10 border border-moss-light/20 transition-all duration-900">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-moss mb-2">
            Bienvenido de vuelta
          </h2>
          <p className="font-body text-moss-light text-sm">
            Ingresa tus credenciales para acceder al portal
          </p>
        </div>

        {mensaje && (
          <div className="mb-6 p-3 rounded-xl text-sm font-bold text-center bg-red-100 text-red-600">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-heading text-sm font-bold text-moss mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark bg-white text-moss font-body focus:outline-none focus:border-moss-satin transition-colors"
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          <div>
            <label className="block font-heading text-sm font-bold text-moss mb-2">Contraseña</label>
            <input 
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark bg-white text-moss font-body focus:outline-none focus:border-moss-satin transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-moss-satin text-beige font-heading font-bold text-lg py-3.5 rounded-xl hover:bg-moss transition-all shadow-lg transform hover:-translate-y-1 mt-4"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 text-center">
          {/* Ahora este botón manda a la pantalla de Registro nueva */}
          <Link 
            to="/registro"
            className="font-body text-sm font-bold text-moss hover:text-moss-satin transition-colors"
          >
            ¿No tienes cuenta? Regístrate aquí
          </Link>
          
          <a href="#" className="font-body text-xs text-moss-light hover:text-moss underline decoration-2 underline-offset-4 transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;