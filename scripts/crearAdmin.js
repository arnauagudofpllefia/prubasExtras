import 'dotenv/config';
import mongoose from 'mongoose';
import Usuario from '../models/UsuarioModel.js';

// Script per crear un usuari admin (només desenvolupament; la contrasenya es hasheja amb pre('save'))
async function crearAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'admin@api.com';
  const existent = await Usuario.findOne({ email });

  if (existent) {
    if (existent.rol !== 'admin') {
      existent.rol = 'admin';
      await existent.save();
      console.log('Usuari promocionat a admin:', existent.email);
    } else {
      console.log('Ja existeix un admin amb aquest email:', existent.email);
    }
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await Usuario.create({
    email,
    password: 'admin123',
    rol: 'admin'
  });
  console.log('Admin creat:', admin.email);
  await mongoose.disconnect();
  process.exit(0);
}
crearAdmin().catch(err => { console.error(err); process.exit(1); });