const db = require('../config/db');

function saludo(req, res) {
    res.send("Módulo de Finanzas y Pagos CodBarber (Listo para PayPal)");
}

async function obtenerPagos(req, res) {
    const query = `
        SELECT p.id_pago, p.monto, p.fecha, c.id_cita, cl.nombre AS cliente, p.metodo_pago, p.id_transaccion_paypal
        FROM pago p
        INNER JOIN cita c ON p.id_cita = c.id_cita
        INNER JOIN cliente cl ON c.id_cliente = cl.id_cliente
        ORDER BY p.id_pago DESC
    `;
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener historial de pagos");
    }
}

async function obtenerPago(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM pago WHERE id_pago = $1";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al buscar el pago");
    }
}

async function insertar(req, res) {
    const { id_cita, monto, metodo_pago, id_transaccion_paypal } = req.body;
    const query = `
        INSERT INTO pago (id_cita, monto, fecha, metodo_pago, id_transaccion_paypal) 
        VALUES ($1, $2, NOW(), $3, $4)
    `;
    try {
        await db.query(query, [
            id_cita, 
            monto, 
            metodo_pago || 'efectivo', 
            id_transaccion_paypal || null
        ]);
        res.send("Pago registrado y transacción guardada en el historial");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error crítico al registrar el pago");
    }
}

async function actualizar(req, res) {
    const { id } = req.params;
    const { id_cita, monto, metodo_pago } = req.body;
    const query = "UPDATE pago SET id_cita=$1, monto=$2, metodo_pago=$3 WHERE id_pago=$4";
    try {
        await db.query(query, [id_cita, monto, metodo_pago, id]);
        res.send("Registro de pago actualizado");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar el registro de pago");
    }
}

async function actualizarReferencia(req, res) {
    const { id } = req.params;
    const { id_transaccion_paypal } = req.body;
    const query = "UPDATE pago SET id_transaccion_paypal=$1 WHERE id_pago=$2";
    try {
        await db.query(query, [id_transaccion_paypal, id]);
        res.send("Referencia de pago actualizada :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al vincular referencia de PayPal");
    }
}

async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM pago WHERE id_pago=$1";
    try {
        await db.query(query, [id]);
        res.send("Registro eliminado del historial");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar el registro del historial");
    }
}

module.exports = {
    saludo,
    obtenerPagos,
    obtenerPago,
    insertar,
    actualizar,
    actualizarReferencia,
    eliminar
};