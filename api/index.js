import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './src/models/connection.js';
import jwt from 'jsonwebtoken';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Permite que el Frontend (puerto 5173) hable con el Backend (puerto 4000)
app.use(express.json()); // Permite leer el correo y pass que manda Axios

// ===================
// == RUTA DE LOGIN ==
// ===================


app.post('/api/login', async (req, res) => {
  const { correo, pass } = req.body;

  try {
    // Buscamos al usuario en la BD (Por ahora lo hacemos directo aquí, luego lo pasaremos al controlador)
    const consulta = 'SELECT id_usuario, nombres, rol FROM usuario WHERE correo = $1 AND pass = $2';
    const resultado = await pool.query(consulta, [correo, pass]);

    // Si no encontró a nadie, el array de rows estará vacío (length === 0)
    if (resultado.rows.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Si lo encontró, extraemos sus datos y le damos la bienvenida
   const usuarioValidado = resultado.rows[0];

    // 1. Fabricamos la "pulsera" (Token)
    // Guardamos su ID y su Rol adentro para no tener que consultar la BD a cada rato
    const token = jwt.sign(
      { 
        id: usuarioValidado.id_usuario, 
        rol: usuarioValidado.rol 
      },
      process.env.JWT_SECRET, // Nuestra firma secreta del .env
      { expiresIn: '24h' }    // La pulsera caduca en 24 horas
    );

    // 2. Se la entregamos al Frontend junto con sus datos básicos
    res.status(200).json({
      mensaje: 'Autenticación exitosa',
      token: token, // <--- Aquí va el JWT
      usuario: {
        nombre: usuarioValidado.nombres,
        rol: usuarioValidado.rol
      }
    });

  } catch (error) {
    console.error('Error en el Login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: OBTENER TICKETS DISPONIBLES (Piscina)
// ==========================================
app.get('/api/tickets/disponibles', async (req, res) => {
  try {
    // Hacemos un JOIN para traer el nombre del cliente en lugar de solo su ID
    const consulta = `
      SELECT 
        t.id_ticket as id,
        u.nombres AS cliente,
        t.titulo,
        t.prioridad,
        t.estado
      FROM Ticket t
      JOIN Usuario u ON t.id_cliente = u.id_usuario
      WHERE t.id_tecnico IS NULL AND t.estado != 'Resuelto'
      ORDER BY t.fecha_apertura DESC;
    `;
    
    const resultado = await pool.query(consulta);
    res.status(200).json(resultado.rows);
    
  } catch (error) {
    console.error('Error obteniendo tickets:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: TOMAR UN TICKET (Asignación)
// ==========================================
app.put('/api/tickets/tomar/:id', async (req, res) => {
  const { id } = req.params; // El ID del ticket
  const { id_tecnico, prioridad } = req.body; // El ID del técnico que lo toma

  try {
    const consulta = `
      UPDATE Ticket 
      SET id_tecnico = $1, estado = 'En Proceso' 
      WHERE id_ticket = $2
      RETURNING *;
    `;
    const resultado = await pool.query(consulta, [id_tecnico, prioridad, id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    res.status(200).json({ mensaje: 'Ticket asignado con éxito', ticket: resultado.rows[0] });
  } catch (error) {
    console.error('Error al asignar ticket:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: OBTENER MIS TICKETS (Técnico)
// ==========================================
app.get('/api/tickets/mis-pendientes/:id_tecnico', async (req, res) => {
  const { id_tecnico } = req.params;
  
  try {
    const consulta = `
      SELECT 
        t.id_ticket as id,
        u.nombres AS cliente,
        t.titulo,
        t.prioridad,
        t.estado
      FROM Ticket t
      JOIN Usuario u ON t.id_cliente = u.id_usuario
      WHERE t.id_tecnico = $1 AND t.estado = 'En Proceso'
      ORDER BY t.prioridad DESC; -- (Opcional) Puedes ordenar por fecha también
    `;
    const resultado = await pool.query(consulta, [id_tecnico]);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error obteniendo mis tickets:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: RESOLVER TICKET (Llamando al SP)
// ==========================================
app.put('/api/tickets/resolver/:id', async (req, res) => {
  const { id } = req.params; // El ID del ticket
  const { id_tecnico, comentario } = req.body;

  try {
    // Usamos CALL para ejecutar tu Procedimiento Almacenado
    // Nota: Si en Postgres lo creaste como FUNCTION y no como PROCEDURE, 
    // tendrías que usar 'SELECT sp_resolver_ticket($1, $2, $3)' en lugar de CALL.
    const consulta = `CALL sp_resolver_ticket($1, $2, $3)`;
    
    await pool.query(consulta, [id, id_tecnico, comentario]);

    res.status(200).json({ mensaje: 'Ticket resuelto y documentado exitosamente' });
  } catch (error) {
    console.error('Error al resolver ticket:', error);
    res.status(500).json({ mensaje: 'Error al intentar resolver el ticket en la BD' });
  }
});


// ==========================================
// RUTA: CREAR NUEVO TICKET (Cliente)
// ==========================================
app.post('/api/tickets', async (req, res) => {
  // Recibimos los datos desde React
  const { id_cliente, titulo, descripcion } = req.body;

  try {
    // Insertamos el ticket. 
    // Nota: El estado inicial es 'Abierto' y la fecha se pone sola.
    const consulta = `
      INSERT INTO Ticket (id_cliente, titulo, descripcion, estado, fecha_apertura) 
      VALUES ($1, $2, $3, 'Abierto', CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    
    const resultado = await pool.query(consulta, [id_cliente, titulo, descripcion]);
    
    res.status(201).json({ 
      mensaje: 'Ticket creado exitosamente', 
      ticket: resultado.rows[0] 
    });
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ mensaje: 'Error interno al guardar el ticket' });
  }
});

// ==========================================
// RUTA: OBTENER HISTORIAL DEL CLIENTE
// ==========================================
app.get('/api/tickets/cliente/:id_cliente', async (req, res) => {
  const { id_cliente } = req.params;
  
  try {
    // Extraemos los tickets ordenados por fecha, del más nuevo al más viejo
    const consulta = `
      SELECT 
        id_ticket as id, 
        titulo, 
        estado, 
        fecha_apertura as fecha
      FROM Ticket
      WHERE id_cliente = $1
      ORDER BY fecha_apertura DESC;
    `;
    
    const resultado = await pool.query(consulta, [id_cliente]);
    res.status(200).json(resultado.rows);
    
  } catch (error) {
    console.error('Error al obtener el historial del cliente:', error);
    res.status(500).json({ mensaje: 'Error interno al cargar los tickets' });
  }
});

// ==========================================
// RUTA: HISTORIAL DE TICKETS RESUELTOS (Técnico)
// ==========================================
app.get('/api/tickets/historial-tecnico/:id_tecnico', async (req, res) => {
  const { id_tecnico } = req.params;
  
  try {
    const consulta = `
      SELECT 
        t.id_ticket as id,
        u.nombres AS cliente,
        t.titulo,
        t.prioridad,
        t.fecha_apertura
      FROM Ticket t
      JOIN Usuario u ON t.id_cliente = u.id_usuario
      WHERE t.id_tecnico = $1 AND t.estado = 'Resuelto'
      ORDER BY t.fecha_apertura DESC;
    `;
    const resultado = await pool.query(consulta, [id_tecnico]);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error obteniendo el historial del técnico:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: OBTENER LISTA DE PERSONAL (Solo Admin)
// ==========================================
app.get('/api/personal/tecnicos', async (req, res) => {
  try {
    const consulta = `
      SELECT id_usuario as id, nombres, correo, rol 
      FROM Usuario 
      WHERE rol = 'Técnico' OR rol = 'Admin'
      ORDER BY rol ASC, nombres ASC;
    `;
    const resultado = await pool.query(consulta);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ==========================================
// RUTA: DAR DE ALTA NUEVO TÉCNICO (Solo Admin)
// ==========================================
app.post('/api/personal/tecnicos', async (req, res) => {
  const { nombres, correo, pass } = req.body;

  try {
    // 1. Validar que el correo no exista ya en el sistema
    const validacion = await pool.query('SELECT id_usuario FROM Usuario WHERE correo = $1', [correo]);
    if (validacion.rows.length > 0) {
      return res.status(400).json({ mensaje: 'Este correo ya está registrado en el sistema.' });
    }

    // 2. Insertar al nuevo técnico
    const consulta = `
      INSERT INTO Usuario (nombres, correo, pass, rol) 
      VALUES ($1, $2, $3, 'Técnico')
      RETURNING id_usuario, nombres, correo, rol;
    `;
    
    const resultado = await pool.query(consulta, [nombres, correo, pass]);
    
    res.status(201).json({ 
      mensaje: 'Técnico dado de alta exitosamente', 
      tecnico: resultado.rows[0] 
    });
  } catch (error) {
    console.error('Error al crear técnico:', error);
    res.status(500).json({ mensaje: 'Error interno al guardar en la base de datos' });
  }
});

// Encender el servidor
app.listen(port, () => {
  console.log(`🚀 Cajero Backend corriendo en http://localhost:${port}`);
});