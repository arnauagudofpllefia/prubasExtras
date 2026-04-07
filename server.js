import dotenv from 'dotenv';
import router from "./routes/routesCervezas.js";
import express from 'express';
import routerVino from "./routes/routesVinos.js";
import {connectDB} from "./config/db.js";
import authRoutes from './routes/authRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

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




app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
})