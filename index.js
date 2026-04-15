const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const barberiaRoutes = require('./routes/barberiaRoutes');
const barberoRoutes = require('./routes/barberoRoutes');
const citaRoutes = require('./routes/citaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/barberias', barberiaRoutes);
app.use('/api/barberos', barberoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/pagos', pagoRoutes);

app.get('/', (req, res) => {
    res.send(`
        <div style="text-align:center; font-family: Montserrat, sans-serif; padding-top:50px; background-color: #04121F; color: white; height: 100vh;">
            <h1 style="color: #1E90FF;"> API de CodBarber Funcionando Correctamente :)</h1>
            <p>El Backend está listo para recibir peticiones de React.</p>
            <hr style="width:50%; border:1px solid #1e90ff33;">
            <p style="color: #888;">CodBarber v2.0 - Node.js Edition (Security Patched)</p>
        </div>
    `);
});

const db = require('./config/db'); 
app.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({
            estado: "¡Conexión Exitosa con Render! :)",
            hora_servidor: result.rows[0].now,
            mensaje: "La base de datos PostgreSQL está respondiendo correctamente."
        });
    } catch (err) {
        res.status(500).json({ error: "No se pudo conectar a la base de datos :(", detalle: err.message });
    }
});

app.listen(port, () => {
    console.log(`---------------------------------------------------------`);
    console.log(` CodBarber Server listo en http://localhost:${port}`);
    console.log(` Protocolo de Seguridad: Sucursales e ID de Usuario Activos`);
    console.log(` Todas las rutas han sido cargadas correctamente :)`);
    console.log(`---------------------------------------------------------`);
});