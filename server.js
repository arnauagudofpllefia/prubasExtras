import dotenv from 'dotenv';
import router from "./routes/routesCervezas.js";
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routerVino from "./routes/routesVinos.js";
import {connectDB} from "./config/db.js";
import authRoutes from './routes/authRoutes.js';

dotenv.config();

connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.use("/api/cervezas", router);

app.use("/api/vinos", routerVino);

app.get("/", (req, res) => {
    console.log("Petición GET");
    
})


app.get("/saludo", (req, res) => {
    console.log("Petición GET a /saludo");
    res.send("<h1 style='color: blue;'>Bienvenido a mi API de prueba</h1>");
})

app.get("/api", (req, res) => {
    res.json({
        mensaje: "Hola desde la API"
        
    });
});

app.use((err, req, res, next) => {
    if (err?.message?.includes('Tipus de fitxer no permes')) {
        return res.status(400).json({ error: err.message });
    }
    if (err?.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Fitxer massa gran. Maxim 5MB' });
    }
    next(err);
});




app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
})