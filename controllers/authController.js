const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "CodBarber_Secret_Key_2026_@Pro"; 

async function login(req, res) {
    const { nombre_usuario, contrasena } = req.body;
    
    console.log("1. Intento de login para:", nombre_usuario);

    try {
        const query = `
            SELECT 
                u.id_usuario, 
                u.nombre_usuario, 
                u.rol, 
                u.id_barberia, 
                c.id_cliente, 
                b.id_barbero,
                (u.contrasena = crypt($2, u.contrasena)) AS clave_valida 
            FROM usuario u
            LEFT JOIN cliente c ON u.id_usuario = c.id_usuario
            LEFT JOIN barbero b ON u.id_usuario = b.id_usuario
            WHERE u.nombre_usuario = $1
        `;
        
        const result = await db.query(query, [nombre_usuario, contrasena]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        const usuario = result.rows[0];

        if (usuario.clave_valida) {
            console.log("3. ¡LOGIN EXITOSO! Generando Token para rol:", usuario.rol);
            
            const token = jwt.sign(
                { 
                    id_usuario: usuario.id_usuario, 
                    rol: usuario.rol,
                    id_cliente: usuario.id_cliente,
                    id_barbero: usuario.id_barbero, 
                    id_barberia: usuario.id_barberia 
                }, 
                JWT_SECRET, 
                { expiresIn: '24h' } 
            );

            return res.json({
                mensaje: "¡Bienvenido a CodBarber!",
                token: token, 
                user: {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre_usuario,
                    rol: usuario.rol,
                    id_cliente: usuario.id_cliente,
                    id_barbero: usuario.id_barbero, 
                    id_barberia: usuario.id_barberia 
                }
            });
        } else {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

    } catch (err) {
        console.error("ERROR CRÍTICO EN LOGIN:", err.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = { login };