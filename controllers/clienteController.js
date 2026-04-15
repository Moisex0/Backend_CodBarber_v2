const db = require('../config/db');

// Saludo :)
function saludo(req, res) {
    res.send("Bienvenido al módulo de Clientes de CodBarber :)");
}

// 1. GET: Obtener todos los clientes :)
async function obtenerClientes(req, res) {
    // Agregamos id_usuario a la consulta para asegurar la relación en Postgres
    const query = "SELECT id_cliente, nombre, telefono, correo, id_usuario FROM cliente ORDER BY id_cliente";
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener los clientes :(");
    }
}

// 2. GET: Obtener un cliente por ID :)
async function obtenerCliente(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM cliente WHERE id_cliente = $1";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor al buscar cliente :(");
    }
}

// 3. POST: Insertar un cliente :)
async function insertar(req, res) {
    // IMPORTANTE: Ahora recibimos id_usuario para vincularlo con la cuenta de login
    const { nombre, telefono, correo, id_usuario } = req.body;
    
    // Si no viene id_usuario, Postgres dejará el campo nulo y el usuario no verá sus datos
    const query = "INSERT INTO cliente (nombre, telefono, correo, id_usuario) VALUES ($1, $2, $3, $4)";
    try {
        await db.query(query, [nombre, telefono, correo, id_usuario || null]);
        res.send("Cliente registrado con éxito :)");
    } catch (err) {
        console.error("Error al insertar en Postgres:", err);
        res.status(500).send("Error al registrar cliente :(");
    }
}

// 4. PUT: Actualizar cliente completo :)
async function actualizar(req, res) {
    const { id } = req.params;
    const { nombre, telefono, correo } = req.body;
    const query = "UPDATE cliente SET nombre=$1, telefono=$2, correo=$3 WHERE id_cliente=$4";
    try {
        await db.query(query, [nombre, telefono, correo, id]);
        res.send("Datos del cliente actualizados :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar cliente :(");
    }
}

// 5. PATCH: Actualizar solo el correo del cliente :)
async function actualizarCorreo(req, res) {
    const { id } = req.params;
    const { correo } = req.body;
    const query = "UPDATE cliente SET correo=$1 WHERE id_cliente=$2";
    try {
        await db.query(query, [correo, id]);
        res.send("Correo actualizado correctamente :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar correo :(");
    }
}

// 6. DELETE: Eliminar un cliente :)
async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM cliente WHERE id_cliente=$1";
    try {
        await db.query(query, [id]);
        res.send("Cliente eliminado del sistema :(");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar cliente :(");
    }
}

module.exports = {
    saludo,
    obtenerClientes,
    obtenerCliente,
    insertar,
    actualizar,
    actualizarCorreo,
    eliminar
};