const db = require('../config/db');

function saludo(req, res) {
    res.send("Módulo de Barberos listo");
}

async function obtenerBarberos(req, res) {
    const query = `
        SELECT b.id_barbero, b.nombre, b.telefono, b.correo, br.nombre AS barberia 
        FROM barbero b 
        LEFT JOIN barberia br ON b.id_barberia = br.id_barberia 
        ORDER BY b.id_barbero
    `;
    try {
        const result = await db.query(query); 
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

async function obtenerBarbero(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM barbero WHERE id_barbero = $1";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

async function insertar(req, res) {
    const { nombre, telefono, correo, id_barberia } = req.body;
    const query = "INSERT INTO barbero (nombre, telefono, correo, id_barberia) VALUES ($1, $2, $3, $4)";
    try {
        await db.query(query, [nombre, telefono, correo, id_barberia]);
        res.send("Barbero registrado correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar barbero");
    }
}

async function actualizar(req, res) {
    const { id } = req.params;
    const { nombre, telefono, correo, id_barberia } = req.body;
    const query = "UPDATE barbero SET nombre=$1, telefono=$2, correo=$3, id_barberia=$4 WHERE id_barbero=$5";
    try {
        await db.query(query, [nombre, telefono, correo, id_barberia, id]);
        res.send("Barbero actualizado :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar");
    }
}

async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM barbero WHERE id_barbero=$1";
    try {
        await db.query(query, [id]);
        res.send("Barbero eliminado :(");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar");
    }
}

async function obtenerPorSucursal(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM barbero WHERE id_barberia = $1 ORDER BY nombre";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener barberos por sucursal:", err);
        res.status(500).send("Error al filtrar barberos");
    }
}

module.exports = {
    saludo,
    obtenerBarberos,
    obtenerBarbero,
    insertar,
    actualizar,
    eliminar,
    obtenerPorSucursal
};