const db = require('../config/db'); 

function saludo(req, res) {
    res.send("Bienvenido al módulo de Barberías");
}

async function obtenerBarberias(req, res) {
    const query = "SELECT id_barberia, nombre, direccion FROM barberia ORDER BY id_barberia";
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener barberías");
    }
}

async function obtenerBarberia(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM barberia WHERE id_barberia = $1";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al buscar la barbería");
    }
}

async function insertar(req, res) {
    const { nombre, direccion } = req.body;
    const query = "INSERT INTO barberia (nombre, direccion) VALUES ($1, $2)";
    try {
        await db.query(query, [nombre, direccion]);
        res.send("Barbería registrada correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar barbería");
    }
}

async function actualizar(req, res) {
    const { id } = req.params;
    const { nombre, direccion } = req.body;
    const query = "UPDATE barberia SET nombre=$1, direccion=$2 WHERE id_barberia=$3";
    try {
        await db.query(query, [nombre, direccion, id]);
        res.send("Barbería actualizada :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar barbería");
    }
}

async function actualizarDireccion(req, res) {
    const { id } = req.params;
    const { direccion } = req.body;
    const query = "UPDATE barberia SET direccion=$1 WHERE id_barberia=$2";
    try {
        await db.query(query, [direccion, id]);
        res.send("Dirección actualizada :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar dirección");
    }
}

async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM barberia WHERE id_barberia=$1";
    try {
        await db.query(query, [id]);
        res.send("Barbería eliminada :(");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar barbería ");
    }
}

module.exports = {
    saludo,
    obtenerBarberias,
    obtenerBarberia,
    insertar,
    actualizar,
    actualizarDireccion,
    eliminar
};