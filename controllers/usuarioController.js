const db = require('../config/db');

function saludo(req, res) {
    res.send("Módulo de Gestión de Usuarios CodBarber Pro configurado");
}

async function obtenerUsuarios(req, res) {
    const query = `
        SELECT DISTINCT ON (u.id_usuario)
            u.id_usuario, 
            u.nombre_usuario, 
            u.rol, 
            u.id_barberia, 
            c.id_cliente 
        FROM usuario u
        LEFT JOIN cliente c ON u.id_usuario = c.id_usuario
        ORDER BY u.id_usuario, c.id_cliente DESC
    `;
    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error en Postgres obtenerUsuarios:", err);
        res.status(500).send("Error al obtener la lista de usuarios");
    }
}

async function obtenerUsuario(req, res) {
    const { id } = req.params;
    const query = `
        SELECT u.id_usuario, u.nombre_usuario, u.rol, u.id_barberia, c.id_cliente 
        FROM usuario u
        LEFT JOIN cliente c ON u.id_usuario = c.id_usuario 
        WHERE u.id_usuario = $1
        LIMIT 1
    `;
    try {
        const result = await db.query(query, [id]);
        res.json(result.rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al buscar usuario");
    }
}

async function insertar(req, res) {
    const { nombre_usuario, contrasena, rol, id_barberia } = req.body;
    
    try {
        await db.query('BEGIN'); 

        const nuevoRol = rol || 'cliente';
        const sucursal = id_barberia || 1;

        const queryUser = `
            INSERT INTO usuario (nombre_usuario, contrasena, rol, id_barberia) 
            VALUES ($1, crypt($2, gen_salt('bf')), $3, $4)
            RETURNING id_usuario
        `;
        const resultUser = await db.query(queryUser, [nombre_usuario, contrasena, nuevoRol, sucursal]);
        const nuevoIdUsuario = resultUser.rows[0].id_usuario;

        if (nuevoRol === 'cliente') {
            await db.query('INSERT INTO cliente (nombre, id_usuario) VALUES ($1, $2)', [nombre_usuario, nuevoIdUsuario]);
        } 
        else if (nuevoRol === 'barbero') {
            const queryBarbero = `
                INSERT INTO barbero (nombre, id_usuario, id_barberia) 
                VALUES ($1, $2, $3)
            `;
            await db.query(queryBarbero, [nombre_usuario, nuevoIdUsuario, sucursal]);
        }

        await db.query('COMMIT'); 
        res.send(`Usuario ${nuevoRol} creado y vinculado automáticamente :)`);
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).send("Error al crear usuario");
    }
}

async function actualizar(req, res) {
    const { id } = req.params;
    const { nombre_usuario, contrasena, rol, id_barberia } = req.body;
    let query;
    let params;
    const sucursal = id_barberia || null;
    
    if (contrasena && contrasena.trim() !== "") {
        query = `UPDATE usuario SET nombre_usuario=$1, contrasena=crypt($2, gen_salt('bf')), rol=$3, id_barberia=$4 WHERE id_usuario=$5`;
        params = [nombre_usuario, contrasena, rol, sucursal, id];
    } else {
        query = `UPDATE usuario SET nombre_usuario=$1, rol=$2, id_barberia=$3 WHERE id_usuario=$4`;
        params = [nombre_usuario, rol, sucursal, id];
    }
    try {
        await db.query(query, params);
        res.send("Usuario actualizado correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar usuario");
    }
}

async function actualizarRol(req, res) {
    const { id } = req.params;
    const { rol } = req.body;
    const query = "UPDATE usuario SET rol=$1 WHERE id_usuario=$2";
    try {
        await db.query(query, [rol, id]);
        res.send("Rol del usuario actualizado correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al cambiar el privilegio");
    }
}

async function eliminar(req, res) {
    const { id } = req.params;
    const query = "DELETE FROM usuario WHERE id_usuario=$1";
    try {
        await db.query(query, [id]);
        res.send("Usuario eliminado del sistema");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar cuenta");
    }
}

async function resetearBD(req, res) {
    const query = `TRUNCATE TABLE pago, cita, cliente, barbero, servicio, barberia RESTART IDENTITY CASCADE;`;
    try {
        await db.query(query);
        res.send("Base de datos reseteada correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al resetear la base de datos");
    }
}

module.exports = {
    saludo, 
    obtenerUsuarios, 
    obtenerUsuario, 
    insertar, 
    actualizar, 
    actualizarRol, 
    eliminar, 
    resetearBD
};