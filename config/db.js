import mongoose from "mongoose";
import dns from "node:dns";

function configureDnsForMongoSrv() {
    const uri = process.env.MONGODB_URI || "";
    if (!uri.startsWith("mongodb+srv://")) {
        return;
    }

    const currentDns = dns.getServers();
    const usingLocalResolver = currentDns.includes("127.0.0.1") || currentDns.includes("::1");

    if (usingLocalResolver) {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    }
}

export async function connectDB() {
    try {
        configureDnsForMongoSrv();
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("✓ Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }

}
