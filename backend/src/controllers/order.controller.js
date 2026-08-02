const { getPool, sql } = require('../config/db');

async function createOrder({ identificacion, entrega, items, total, metodoPago }) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    // 1. Buscar Cliente existente por DNI, o crearlo si no existe
    const clienteExistente = await new sql.Request(transaction)
      .input('dni', sql.NVarChar, identificacion.documento)
      .query('SELECT ClienteId FROM Clientes WHERE DNI = @dni');

    let clienteId;
    if (clienteExistente.recordset.length > 0) {
      clienteId = clienteExistente.recordset[0].ClienteId;
      // Actualizamos sus datos de contacto por si cambiaron desde la última compra
      await new sql.Request(transaction)
        .input('clienteId', sql.Int, clienteId)
        .input('nombre', sql.NVarChar, identificacion.nombre)
        .input('apellido', sql.NVarChar, identificacion.apellidos)
        .input('email', sql.NVarChar, identificacion.correo)
        .input('telefono', sql.NVarChar, identificacion.telefono)
        .query(`
          UPDATE Clientes
          SET Nombre = @nombre, Apellido = @apellido, Email = @email, Telefono = @telefono
          WHERE ClienteId = @clienteId
        `);
    } else {
      const nuevoCliente = await new sql.Request(transaction)
        .input('nombre', sql.NVarChar, identificacion.nombre)
        .input('apellido', sql.NVarChar, identificacion.apellidos)
        .input('email', sql.NVarChar, identificacion.correo)
        .input('telefono', sql.NVarChar, identificacion.telefono)
        .input('dni', sql.NVarChar, identificacion.documento)
        .query(`
          INSERT INTO Clientes (Nombre, Apellido, Email, Telefono, DNI, FechaCreacion)
          OUTPUT INSERTED.ClienteId
          VALUES (@nombre, @apellido, @email, @telefono, @dni, GETDATE())
        `);
      clienteId = nuevoCliente.recordset[0].ClienteId;
    }

    // 2. Insertar Dirección (si es "recojo en tienda", usamos datos fijos de la tienda)
    const esRecojo = entrega.metodo !== 'envio';
    const nuevaDireccion = await new sql.Request(transaction)
      .input('clienteId', sql.Int, clienteId)
      .input('departamento', sql.NVarChar, esRecojo ? 'La Libertad' : entrega.departamento)
      .input('provincia', sql.NVarChar, esRecojo ? 'Trujillo' : entrega.provincia)
      .input('distrito', sql.NVarChar, esRecojo ? 'Trujillo' : entrega.distrito)
      .input('direccionCompleta', sql.NVarChar, esRecojo ? 'Recojo en tienda - Trujillo' : entrega.direccion)
      .input('referencia', sql.NVarChar, entrega.referencia || null)
      .query(`
        INSERT INTO Direcciones (ClienteId, Departamento, Provincia, Distrito, DireccionCompleta, Referencia)
        OUTPUT INSERTED.DireccionId
        VALUES (@clienteId, @departamento, @provincia, @distrito, @direccionCompleta, @referencia)
      `);
    const direccionId = nuevaDireccion.recordset[0].DireccionId;

    // 3. Insertar Pedido
    const nuevoPedido = await new sql.Request(transaction)
      .input('clienteId', sql.Int, clienteId)
      .input('direccionId', sql.Int, direccionId)
      .input('total', sql.Decimal(10, 2), total)
      .query(`
        INSERT INTO Pedidos (ClienteId, DireccionId, Total, Estado, FechaPedido)
        OUTPUT INSERTED.PedidoId
        VALUES (@clienteId, @direccionId, @total, 'Confirmado', GETDATE())
      `);
    const pedidoId = nuevoPedido.recordset[0].PedidoId;

    // 4. Insertar una fila de DetallePedido por cada producto del carrito
    for (const item of items) {
      const subtotal = item.price * item.quantity;
      await new sql.Request(transaction)
        .input('pedidoId', sql.Int, pedidoId)
        .input('productoId', sql.Int, item.productId)
        .input('cantidad', sql.Int, item.quantity)
        .input('precioUnitario', sql.Decimal(10, 2), item.price)
        .input('subtotal', sql.Decimal(10, 2), subtotal)
        .query(`
          INSERT INTO DetallePedido (PedidoId, ProductoId, Cantidad, PrecioUnitario, Subtotal)
          VALUES (@pedidoId, @productoId, @cantidad, @precioUnitario, @subtotal)
        `);
    }

    // 5. Insertar Pago (ojo: la columna se llama "EstagoPago", con typo, tal como esta en la tabla real)
    await new sql.Request(transaction)
      .input('pedidoId', sql.Int, pedidoId)
      .input('metodoPago', sql.NVarChar, metodoPago === 'qr' ? 'QR/Yape/Plin' : 'Tarjeta')
      .input('montoPagado', sql.Decimal(10, 2), total)
      .input('estadoPago', sql.NVarChar, 'Pagado')
      .query(`
        INSERT INTO Pagos (PedidoId, MetodoPago, MontoPagado, EstagoPago, FechaPago)
        VALUES (@pedidoId, @metodoPago, @montoPagado, @estadoPago, GETDATE())
      `);

    await transaction.commit();

    return { pedidoId, total };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = { createOrder };