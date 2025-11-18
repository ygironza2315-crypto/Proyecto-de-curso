const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu API Key de SendGrid (usa variables de entorno en producción)
sgMail.setApiKey('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');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tienda_pc'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
  } else {
    console.log('Conectado a MySQL');
  }
});

// Método GET: listar productos
app.get('/productos', (req, res) => {
  const { nombre, descripcion, precio } = req.query;
  let sql = 'SELECT * FROM productos WHERE 1=1';
  const params = [];

  if (nombre) {
    sql += ' AND nombre LIKE ?';
    params.push(`%${nombre}%`);
  }
  if (descripcion) {
    sql += ' AND descripcion LIKE ?';
    params.push(`%${descripcion}%`);
  }
  if (precio) {
    sql += ' AND precio = ?';
    params.push(precio);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// Método POST: agregar producto
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, img } = req.body;
  const rutaImagen = (img && img.trim() !== '') ? img : 'Images/default.png';
  db.query(
    'INSERT INTO productos (nombre, descripcion, precio, img) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, precio, rutaImagen],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nombre, descripcion, precio, img: rutaImagen });
    }
  );
});

// Método PUT: actualizar producto
app.put('/productos/:id', (req, res) => {
  const { nombre, descripcion, precio, img } = req.body;
  const { id } = req.params;
  const rutaImagen = (img && img.trim() !== '') ? img : 'Images/default.png';
  db.query(
    'UPDATE productos SET nombre=?, descripcion=?, precio=?, img=? WHERE id=?',
    [nombre, descripcion, precio, rutaImagen, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nombre, descripcion, precio, img: rutaImagen });
    }
  );
});

// Método DELETE: eliminar producto
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({id});
  });
});

// GET - Listar contactos
app.get('/contactos', (req, res) => {
  db.query('SELECT * FROM contactos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/contactos', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  if (!nombre || !email || !mensaje)
    return res.status(400).json({ error: 'Faltan datos' });

  // Insertar contacto en la base de datos
  db.query('INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)', [nombre, email, mensaje], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // Configura el email con SendGrid
    const msg = {
      to: email,
      from: 'ygironza2315@gmail.com', // Asegúrate de que este email esté autorizado en SendGrid
      subject: 'Gracias por contactarnos',
      text: `Hola ${nombre},\n\nGracias por tu mensaje:\n${mensaje}\n\nNos pondremos en contacto pronto.`,
    };

    // Envía el email
    sgMail
      .send(msg)
      .then(() => {
        res.status(201).json({ 
          id: result.insertId,
          nombre,
          email,
          mensaje,
          aviso: 'Contacto creado y email enviado.'
        });
      })
      .catch(error => {
        console.error('Error enviando email:', error);
        res.status(201).json({ 
          id: result.insertId,
          nombre,
          email,
          mensaje,
          aviso: 'Contacto creado, pero no se pudo enviar email.'
        });
      });
  });
});

// PUT - Actualizar contacto
app.put('/contactos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, mensaje } = req.body;
  db.query('UPDATE contactos SET nombre=?, email=?, mensaje=? WHERE id=?', [nombre, email, mensaje, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, nombre, email, mensaje, mensaje: 'Contacto actualizado' });
  });
});

// DELETE - Eliminar contacto
app.delete('/contactos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM contactos WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Contacto eliminado', id });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor backend escuchando en puerto', PORT);
});
