import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Lee el archivo .env

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Prueba de conexión rápida al arrancar
pool.connect()
  .then(() => console.log('🟢 Bóveda Conectada: shadow-ticket-support'))
  .catch((err) => console.error('🔴 Error de conexión a la BD', err));

export default pool;