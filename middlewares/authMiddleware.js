const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'CodBarber_Secret_Key_2026_@Pro';

const verificarToken = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(401).json({ mensaje: "Token inválido" });
    }
};

const esAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ mensaje: "Acceso denegado: No eres administrador" });
    }
};

module.exports = { verificarToken, esAdmin };