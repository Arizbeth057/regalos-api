CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria VARCHAR(80) NOT NULL
);

INSERT INTO productos (nombre, precio, stock, categoria) VALUES
  ('Oso de Peluche Gigante', 450.00, 15, 'Peluches'),
  ('Caja de Chocolates Artesanales', 220.50, 30, 'Dulces'),
  ('Taza Personalizada Magica', 120.00, 50, 'Tazas'),
  ('Ramo de Rosas Eternas', 380.00, 20, 'Flores'),
  ('Lampara LED Luna 3D', 299.99, 12, 'Decoracion'),
  ('Portarretratos de Madera', 150.00, 25, 'Hogar'),
  ('Caja Sorpresa de Regalo', 500.00, 10, 'Kits'),
  ('Vela Aromatica de Lavanda', 95.00, 40, 'Decoracion'),
  ('Llavero de Pareja Grabado', 80.00, 60, 'Accesorios'),
  ('Album de Fotos Scrapbook', 210.00, 18, 'Papeleria');
