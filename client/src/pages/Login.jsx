import { useState } from 'react';
import axios from 'axios'; // Importamos a nuestro cartero
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const [mensaje, setMensaje] = useState(''); // Para mostrar errores o éxitos

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Verificando credenciales...');
    
    try {
      const respuesta = await axios.post('http://localhost:4000/api/login', { correo, pass });
      
      // 1. Tomamos la pulsera que nos dio el Backend y la guardamos en el navegador
      localStorage.setItem('token_sts', respuesta.data.token);
      
      // 2. Damos un mensaje de éxito personalizado
      setMensaje(`¡Bienvenido ${respuesta.data.usuario.nombre}! Preparando tu espacio...`);
      
      // 3. Redirección al Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      // Si el backend nos rechaza (401) o hay error de servidor (500)
      setMensaje(error.response?.data?.mensaje || 'Error al conectar con el servidor');
    }
  };

  return (
    // Usamos el nuevo verde ultra profundo para un contraste dramático
    <div className="min-h-screen bg-moss-deep flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Efecto de luz satinada en el fondo (Opcional, pero muy elegante) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-moss-satin rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse"></div>

      <div className="bg-beige w-full max-w-md p-10 rounded-3xl shadow-2xl relative z-10 border border-moss-light/20">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-moss mb-2">Bienvenido de vuelta</h2>
          <p className="font-body text-moss-light text-sm">Ingresa tus credenciales para acceder al portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-heading text-sm font-bold text-moss mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-beige-dark bg-white text-moss font-body focus:outline-none focus:border-moss-satin transition-colors"
              placeholder="usuario@soporte.com"
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

          {/* Aquí aplicamos el nuevo color Satinado que pediste */}
          <button 
            type="submit" 
            className="w-full bg-moss-satin text-beige font-heading font-bold text-lg py-3.5 rounded-xl hover:bg-moss transition-all shadow-lg transform hover:-translate-y-1"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#" className="font-body text-sm text-moss-satin hover:text-moss underline decoration-2 underline-offset-4 transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;