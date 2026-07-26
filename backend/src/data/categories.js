// Datos en memoria para arrancar rápido.
// Cuando se conecte una base de datos real (MongoDB/PostgreSQL), este archivo
// se reemplaza por un modelo/consulta sin tocar controllers ni routes,
// porque el acceso a datos está aislado en /models.
module.exports = [
  { id: 'tecnologia', name: 'Accesorios tecnológicos', slug: 'tecnologia' },
  { id: 'maquillaje', name: 'Maquillaje y cosméticos', slug: 'maquillaje' },
  { id: 'hogar', name: 'Artículos para el hogar', slug: 'hogar' },
  { id: 'cocina', name: 'Artículos de cocina', slug: 'cocina' },
  { id: 'juguetes', name: 'Juguetes', slug: 'juguetes' },
];
