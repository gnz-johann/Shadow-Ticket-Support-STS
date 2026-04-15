import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const { Pool } = pkg;

// Configuración Directa y Básica
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // Esta línea es la única regla obligatoria de Render para dejarte entrar desde tu computadora:
  ssl: { rejectUnauthorized: false } 
});

pool.connect()
  .then(() => console.log('🟢 Bóveda Conectada: STS (Conectado directamente a Oregon)'))
  .catch((err) => console.error('🔴 Error de conexión a la BD', err));

export default pool;