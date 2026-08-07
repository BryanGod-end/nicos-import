const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Proteccion simple anti fuerza-bruta: bloquea despues de 5 intentos fallidos
// por 15 minutos, por IP. Se guarda en memoria (se reinicia si el server reinicia,
// suficiente para un proyecto de este tamano).
const intentosFallidos = new Map();
const MAX_INTENTOS = 5;
const BLOQUEO_MS = 15 * 60 * 1000;

function estaBloqueado(ip) {
  const registro = intentosFallidos.get(ip);
  if (!registro) return false;
  if (registro.count < MAX_INTENTOS) return false;
  if (Date.now() - registro.ultimoIntento > BLOQUEO_MS) {
    intentosFallidos.delete(ip);
    return false;
  }
  return true;
}

function registrarFallo(ip) {
  const registro = intentosFallidos.get(ip) || { count: 0, ultimoIntento: 0 };
  registro.count += 1;
  registro.ultimoIntento = Date.now();
  intentosFallidos.set(ip, registro);
}

function limpiarIntentos(ip) {
  intentosFallidos.delete(ip);
}

async function login(req, res, next) {
  try {
    const ip = req.ip;

    if (estaBloqueado(ip)) {
      return res.status(429).json({
        error: { message: 'Demasiados intentos fallidos. Intenta de nuevo en unos minutos.' },
      });
    }

    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
      return res.status(400).json({ error: { message: 'Usuario y clave son requeridos' } });
    }

    const usuarioValido = usuario === process.env.ADMIN_USER;
    const claveValida = usuarioValido
      ? await bcrypt.compare(clave, process.env.ADMIN_PASSWORD_HASH)
      : false;

    if (!usuarioValido || !claveValida) {
      registrarFallo(ip);
      return res.status(401).json({ error: { message: 'Usuario o clave incorrectos' } });
    }

    limpiarIntentos(ip);

    const token = jwt.sign(
      { role: 'admin', usuario },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ data: { token } });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };