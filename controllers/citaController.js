const db = require('../config/db');

function saludo(req, res) {
    res.send("Módulo de Citas CodBarber activo");
}

async function obtenerCitas(req, res) {
    // Extraemos los datos del token
    const { rol, id_barberia, id_cliente, id_barbero } = req.user;

    let query = `
        SELECT 
            c.id_cita, 
            c.id_cliente,
            cl.nombre AS cliente, 
            b.nombre AS barbero,
            s.nombre AS servicio_nombre, 
            c.fecha, 
            c.hora, 
            c.precio, 
            c.estado,
            c.id_servicio,
            b.id_barberia
        FROM cita c
        LEFT JOIN cliente cl ON c.id_cliente = cl.id_cliente
        LEFT JOIN barbero b ON c.id_barbero = b.id_barbero
        LEFT JOIN servicio s ON c.id_servicio = s.id_servicio
    `;

    const params = [];
    
    if (rol === 'barbero' && id_barbero) {
        query += ` WHERE c.id_barbero = $1::integer `;
        params.push(parseInt(id_barbero));
    } 
    else if (rol === 'admin' && id_barberia) {
        query += ` WHERE b.id_barberia = $1::integer `;
        params.push(parseInt(id_barberia));
    } 
    else if (rol === 'cliente' && id_cliente) {
        query += ` WHERE c.id_cliente = $1::integer `;
        params.push(parseInt(id_cliente));
    }

    query += ` ORDER BY c.fecha DESC, c.hora DESC `;

    try {
        const result = await db.query(query, params);
        res.json(result.rows || []);
    } catch (err) {
        console.error("Error en obtenerCitas:", err);
        res.status(500).send("Error en el servidor al obtener citas");
    }
}

async function obtenerCita(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM cita WHERE id_cita = $1";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows[0]); 
    } catch (err) {
        console.error("Error al obtener cita:", err);
        res.status(500).send("Error en el servidor al buscar cita");
    }
}

async function insertar(req, res) {
    const { id_cliente, id_barbero, id_servicio, fecha, hora, precio, estado } = req.body;
    const query = `
        INSERT INTO cita (id_cliente, id_barbero, id_servicio, fecha, hora, precio, estado) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    try {
        if (!id_cliente || !id_barbero || !id_servicio) {
            return res.status(400).send("Faltan datos obligatorios");
        }
        await db.query(query, [id_cliente, id_barbero, id_servicio, fecha, hora, precio, estado || 'Pendiente']);
        res.send("Cita agendada correctamente :)");
    } catch (err) {
        res.status(500).send("Error al agendar cita: " + err.message);
    }
}

async function actualizar(req, res) {
    const { id } = req.params;
    const { id_cliente, id_barbero, id_servicio, fecha, hora, precio, estado } = req.body;
    const query = `
        UPDATE cita SET id_cliente=$1, id_barbero=$2, id_servicio=$3, fecha=$4, hora=$5, precio=$6, estado=$7 
        WHERE id_cita=$8
    `;
    try {
        await db.query(query, [id_cliente, id_barbero, id_servicio, fecha, hora, precio, estado, id]);
        res.send("Cita actualizada :)");
    } catch (err) {
        res.status(500).send("Error al actualizar cita");
    }
}

async function actualizarEstado(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    const query = "UPDATE cita SET estado=$1 WHERE id_cita=$2";
    try {
        await db.query(query, [estado, id]);
        res.send("Estado actualizado :)");
    } catch (err) {
        res.status(500).send("Error al actualizar estado");
    }
}

async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM cita WHERE id_cita=$1";
    try {
        await db.query(query, [id]);
        res.send("Cita eliminada :)");
    } catch (err) {
        res.status(500).send("Error al eliminar cita");
    }
}

module.exports = {
    saludo, 
    obtenerCitas, 
    obtenerCita, 
    insertar, 
    actualizar, 
    actualizarEstado, 
    eliminar
};