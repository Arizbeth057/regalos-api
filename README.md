# API de tienda de regalos

API local en Node.js y PostgreSQL en Docker con volumen persistente `postgres_data`. En Render, el Blueprint crea la API y una instancia administrada de PostgreSQL; los 10 productos se insertan al arrancar si la tabla está vacía.

## Iniciar localmente

```powershell
Copy-Item .env.example .env
```

Edita `.env` y pon una contraseña local segura en `POSTGRES_PASSWORD`. Después ejecuta:

```powershell
docker compose up --build -d
```

## Rutas

- `GET http://localhost:3000/health` — estado de la API y PostgreSQL.
- `GET http://localhost:3000/api/productos` — lista los 10 productos.
- `GET http://localhost:3000/api/productos/1` — consulta un producto por ID.

## Desplegar en Render

Conecta el repositorio GitHub en Render como Blueprint y selecciona el archivo `render.yaml` en la raíz del repositorio. El Blueprint crea el servicio web y PostgreSQL, y conecta la API con la base mediante `DATABASE_URL`.

Los planes `free` de Render pueden tener límites de disponibilidad y retención. Revisa el plan antes de crear recursos para producción.
