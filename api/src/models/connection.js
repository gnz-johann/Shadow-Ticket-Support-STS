import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); 

const { Pool } = pkg;

// Configuración Híbrida
const pool = new Pool({
  // Si existe DATABASE_URL (en Render), la usa. Si no, usa las variables locales del .env
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  // CRITICO: SSL es obligatorio para conectar con Render desde afuera
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('🟢 Bóveda Conectada: STS (Entorno detectado correctamente)'))
  .catch((err) => console.error('🔴 Error de conexión a la BD', err));

export default pool;