# Nico's Import — tienda virtual

Proyecto base (frontend + backend) para una tienda virtual multicategoría:
tecnología, maquillaje, hogar, cocina y juguetes.

## Estructura

```
nicos-import/
├── backend/     API REST en Node.js + Express
└── frontend/    Interfaz en React + Vite
```

## ¿Por qué esta estructura? (escalabilidad y mantenimiento)

**Backend**
- `data/` guarda los datos de ejemplo. `models/` es la única capa que los toca.
  El día que conectes una base de datos real (MongoDB, PostgreSQL), solo
  reescribes los archivos de `models/`; controllers y routes no cambian.
- `controllers/` contiene la lógica de cada endpoint. `routes/` solo define
  las URLs. Mantenerlos separados facilita agregar endpoints nuevos sin
  romper los existentes.
- `middlewares/errorHandler.js` centraliza el manejo de errores: si algo
  falla en cualquier controller, termina ahí, se registra en consola (log)
  y el cliente recibe un mensaje claro en vez de que el servidor se caiga.
- El carrito **calcula el total en el servidor**, nunca confía en el precio
  que manda el navegador — evita que se pueda manipular el total desde el
  cliente.
- Rutas versionadas (`/api/v1/...`): permite sacar una v2 en el futuro sin
  romper integraciones existentes.

**Frontend**
- `services/api.js` es el único archivo que habla con el backend. Si cambia
  la URL de la API o el formato de las respuestas, solo se toca ese archivo.
- `context/CartContext.jsx` centraliza el estado del carrito y lo persiste en
  `localStorage`, para que no se pierda al recargar la página.
- `pages/` son las vistas completas (Home, Categoría, Detalle, Carrito).
  `components/` son piezas reutilizables (Navbar, ProductCard, Footer).
- Manejo de errores en cada página (`try/catch` vía `.catch()`), mostrando
  mensajes claros en vez de pantallas rotas si el backend falla.

## Cómo correrlo localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
La API queda en `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
La tienda queda en `http://localhost:5173`.

## Logo

El logo se dejó como texto de marcador ("Nico's Import") en
`frontend/src/components/Navbar.jsx`. Cuando tengas el archivo final del
logo, colócalo en `frontend/src/assets/logo.png` (o .svg) y reemplaza ese
texto por una etiqueta `<img src="/src/assets/logo.png" alt="Nico's Import" />`.

## Próximos pasos sugeridos

1. Conectar una base de datos real (MongoDB o PostgreSQL) en `backend/src/models`.
2. Agregar autenticación de usuarios (registro/login) y checkout con pasarela de pago.
3. Agregar tests (Jest para backend, Vitest/React Testing Library para frontend).
4. Desplegar backend (Render/Railway) y frontend (Vercel/Netlify).
