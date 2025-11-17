const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'nombre_base'
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
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(results);
  });
});

// Método POST: agregar producto
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  db.query('INSERT INTO productos (nombre, descripcion, precio) VALUES (?, ?, ?)',
    [nombre, descripcion, precio],
    (err, result) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({id: result.insertId, nombre, descripcion, precio});
    });
});

// Método PUT: actualizar producto
app.put('/productos/:id', (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const { id } = req.params;
  db.query('UPDATE productos SET nombre=?, descripcion=?, precio=? WHERE id=?',
    [nombre, descripcion, precio, id],
    (err) => {
      if (err) return res.status(500).json({error: err.message});
      res.json({id, nombre, descripcion, precio});
    });
});

// Método DELETE: eliminar producto
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({id});
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor backend escuchando en puerto', PORT);
});
