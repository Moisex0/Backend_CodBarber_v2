const db = require('../config/db');

function saludo(req, res) {
    res.send("Catálogo de Servicios CodBarber listo");
}

// 1. GET: Obtener todos los servicios (Normalizado para el Frontend) :)
async function obtenerServicios(req, res) {
    const query = `
        SELECT id_servicio, nombre, descripcion, precio, duracion_estimada, id_barberia 
        FROM servicio 
        ORDER BY id_servicio DESC
    `;
    
    try {
        const result = await db.query(query);
        
        const serviciosLocal = result.rows || [];
        
        console.log("Servicios encontrados en BD:", serviciosLocal.length);
        
        res.json(serviciosLocal);
        
    } catch (err) {
        console.error("Error detallado en BD:", err);
        res.status(500).json({ error: "Error al obtener servicios", detalle: err.message });
    }
}

async function obtenerServicio(req, res) {
    const { id } = req.params;
    const query = "SELECT * FROM servicio WHERE id_servicio = $1";
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows[0]); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
}

async function insertar(req, res) {
    const { nombre, descripcion, precio, id_barberia } = req.body;
    const query = "INSERT INTO servicio (nombre, descripcion, precio, id_barberia) VALUES ($1, $2, $3, $4)";
    
    const barberiaId = (id_barberia === "" || id_barberia === undefined) ? null : id_barberia;

    try {
        await db.query(query, [nombre, descripcion, precio, barberiaId]);
        res.send("Servicio registrado correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al registrar servicio");
    }
}

async function actualizar(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, id_barberia } = req.body;
    const query = "UPDATE servicio SET nombre=$1, descripcion=$2, precio=$3, id_barberia=$4 WHERE id_servicio=$5";
    
    const barberiaId = (id_barberia === "" || id_barberia === undefined) ? null : id_barberia;

    try {
        await db.query(query, [nombre, descripcion, precio, barberiaId, id]);
        res.send("Servicio actualizado :)");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar servicio");
    }
}

async function actualizarPrecio(req, res) {
    const { id } = req.params;
    const { precio } = req.body;
    const query = "UPDATE servicio SET precio=$1 WHERE id_servicio=$2";
    
    try {
        await db.query(query, [precio, id]);
        res.send("Precio actualizado con éxito");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar precio");
    }
}

async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM servicio WHERE id_servicio=$1";
    
    try {
        await db.query(query, [id]);
        res.send("Servicio eliminado :(");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar servicio");
    }
}

async function obtenerPorSucursal(req, res) {
    const { id } = req.params;
    const query = `
        SELECT * FROM servicio 
        WHERE id_barberia = $1 OR id_barberia IS NULL 
        ORDER BY nombre ASC
    `;
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows || []);
    } catch (err) {
        console.error("Error en obtenerPorSucursal:", err);
        res.status(500).send("Error al filtrar servicios por sucursal");
    }
}

module.exports = {
    saludo,
    obtenerServicios,
    obtenerServicio,
    insertar,
    actualizar,
    actualizarPrecio,
    eliminar,
    obtenerPorSucursal 
};