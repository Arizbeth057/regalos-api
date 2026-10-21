const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = Number(process.env.PORT || 3000);
const connectionString = process.env.DATABASE_URL || (process.env.POSTGRES_PASSWORD ? `postgres://tienda:${process.env.POSTGRES_PASSWORD}@localhost:5432/regalos` : undefined);
const pool = new Pool({ connectionString, ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false });
app.use(express.json());

const productosIniciales = [
  ['Oso de Peluche Gigante', 450.00, 15, 'Peluches'],
  ['Caja de Chocolates Artesanales', 220.50, 30, 'Dulces'],
  ['Taza Personalizada Mágica', 120.00, 50, 'Tazas'],
  ['Ramo de Rosas Eternas', 380.00, 20, 'Flores'],
  ['Lámpara LED Luna 3D', 299.99, 12, 'Decoración'],
  ['Portarretratos de Madera', 150.00, 25, 'Hogar'],
  ['Caja Sorpresa de Regalo', 500.00, 10, 'Kits'],
  ['Vela Aromática de Lavanda', 95.00, 40, 'Decoración'],
  ['Llavero de Pareja Grabado', 80.00, 60, 'Accesorios'],
  ['Álbum de Fotos Scrapbook', 210.00, 18, 'Papelería'],
];

async function initializeDatabase() {
  await pool.query(`CREATE TABLE IF NOT EXISTS productos (id SERIAL PRIMARY KEY, nombre VARCHAR(120) NOT NULL, precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0), stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), categoria VARCHAR(80) NOT NULL)`);
  const { rowCount } = await pool.query('SELECT 1 FROM productos LIMIT 1');
  if (rowCount === 0) {
    const values = [];
    const placeholders = productosIniciales.map((producto, index) => {
      const offset = index * 4;
      values.push(...producto);
      return `(${offset + 1}, ${offset + 2}, ${offset + 3}, ${offset + 4})`;
    });
    await pool.query(`INSERT INTO productos (nombre, precio, stock, categoria) VALUES ${placeholders.join(', ')}`, values);
  }
}

app.get('/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'OK', database: 'connected' }); }
  catch (error) { console.error('Health check failed:', error); res.status(503).json({ status: 'error', database: 'disconnected' }); }
});
app.get('/api/productos', async (_req, res) => {
  try { const { rows } = await pool.query('SELECT id, nombre, precio, stock, categoria FROM productos ORDER BY id'); res.json(rows); }
  catch (error) { console.error('Could not list products:', error); res.status(500).json({ error: 'No se pudieron consultar los productos' }); }
});
app.get('/api/productos/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'ID inválido' });
  try {
    const { rows } = await pool.query('SELECT id, nombre, precio, stock, categoria FROM productos WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(rows[0]);
  } catch (error) { console.error('Could not find product:', error); return res.status(500).json({ error: 'No se pudo consultar el producto' }); }
});

initializeDatabase().then(() => {
  app.listen(port, '0.0.0.0', () => console.log(`API de regalos disponible en el puerto ${port}`));
}).catch((error) => {
  console.error('No se pudo inicializar PostgreSQL:', error);
  process.exit(1);
});
