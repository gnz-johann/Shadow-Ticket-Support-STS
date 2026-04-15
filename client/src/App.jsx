import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout'; // Importamos el Cascarón
import TecnicoDashboard from './pages/dashboard/TecnicoDashboard';
import MisTickets from './pages/dashboard/MisTickets';
import HistorialTecnico from './pages/dashboard/HistorialTecnico';
import GestionPersonal from './pages/dashboard/GestionPersonal';
import HistorialCliente from './pages/dashboard/HistorialCliente';
import Registro from './pages/Registro';
import Configuracion from './pages/dashboard/Configuracion';
import SoporteContacto from './pages/SoporteContacto';
// (Asegúrate de tener también importado MisTickets si ya lo pusiste en las rutas)
// Un componente temporal muy sencillo para nuestro Dashboard

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        {/* Ruta pública: La Landing Page */}
        <Route path="/" element={<Home />} />
        {/* Ruta pública: El Formulario de Login */}
        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Registro />} />

         <Route path='/contacto' element={<SoporteContacto />} />
        
        {/* RUTAS PRIVADAS (DASHBOARD) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Este es el componente que se muestra por defecto en el <Outlet /> */}
          <Route index element={<TecnicoDashboard />} /> 
          {/* ESTE MUESTRA EL DASHBOARD DE "MIS TICKETS" PARA TÉCNICOS */}
          <Route path="mis-tickets" element={<MisTickets />} /> 
           {/* ESTE MUESTRA EL DASHBOARD DE "MIS TICKETS" PARA CLIENTES */}
          <Route path="historial" element={<HistorialTecnico />} />
           {/* ESTE MUESTRA MUESTRA DONDE LOS ADMINISTRADORES DARÁN DE ALTA A TÉCNICOS */}
          <Route path="personal" element={<GestionPersonal />} />
          {/* ESTE MUESTRA EL HISTORIAL COMPLETO PARA CLIENTES */}
          <Route path="historial-cliente" element={<HistorialCliente />} />

          <Route path="configuracion" element={<Configuracion />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;