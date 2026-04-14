// Importar Express per crear el router de rutes
import express from 'express';
// Importar jsonwebtoken per generar i (més endavant) verificar el JWT
import jwt from 'jsonwebtoken';
// Importar el model Usuario per consultar i crear usuaris a la BD
import Usuario from '../models/UsuarioModel.js';
import upload from '../config/multer.js';
// Importar el middleware de protecció per a la ruta de perfil
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

// Crear un router d'Express; les rutes es muntaran sota /api/auth
const router = express.Router();

// POST /api/auth/registro — crear compte nou amb imatge obligatòria
router.post('/registro', upload.single('imatge'), async (req, res) => {
  try {
    // Extreure email i contrasenya del cos de la petició (req.body)
    const { email, password } = req.body;
    // Validar que s'han enviat tots dos camps; si no, 400 Bad Request
    if (!email || !password) {
      return res.status(400).json({ error: 'Email i contrasenya requerits' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'La imatge es obligatoria per registrar-se' });
    }
    // Comprovar si ja existeix un usuari amb aquest email a la BD
    const existent = await Usuario.findOne({ email });
    // Si existeix, no es pot registrar de nou; retornar 400
    if (existent) {
      return res.status(400).json({ error: 'Aquest email ja està registrat' });
    }
    // Crear el nou usuari sempre amb rol bàsic; no es permet autoassignar-se admin al registre
    const imatge = `/uploads/${req.file.filename}`;
    const usuari = await Usuario.create({ email, password, rol: 'usuari', imatge });
    // Generar el JWT: payload amb l'id de l'usuari, signat amb JWT_SECRET, vàlid 7 dies
    const token = jwt.sign(
      { id: usuari._id },           // payload: dades que viatjaran dins del token
      process.env.JWT_SECRET,       // clau secreta per signar (només el servidor la coneix)
      { expiresIn: '7d' }          // el token caduca en 7 dies
    );
    // Retornar 201 Created amb el token i les dades públiques de l'usuari (sense password)
    res.status(201).json({
      token,
      usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol, imatge: usuari.imatge }
    });
  } catch (err) {
    // Qualsevol error (p. ex. validació de Mongoose) es respon amb 400
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/login — validar email i contrasenya i retornar un JWT
router.post('/login', async (req, res) => {
  try {
    // Extreure credencials del cos de la petició
    const { email, password } = req.body;
    // Buscar l'usuari per email; select('+password') inclou el camp password (per defecte select: false al model)
    const usuari = await Usuario.findOne({ email }).select('+password');
    // Si no hi ha usuari o la contrasenya no coincideix amb el hash, 401 Unauthorized
    if (!usuari || !(await usuari.comprovarPassword(password))) {
      return res.status(401).json({ error: 'Credencials incorrectes' });
    }
    // Generar el JWT amb l'id de l'usuari, signat i amb caducitat de 7 dies
    const token = jwt.sign(
      { id: usuari._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Retornar el token i les dades de l'usuari (sense password) en format JSON
    res.json({ token, usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol, imatge: usuari.imatge } });
  } catch (err) {
    // Errors inesperats (BD, etc.) es responen amb 500
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/perfil — obtenir dades de l'usuari autenticat (requereix token)
router.get('/perfil', protegir, async (req, res) => {
  try {
    const usuari = req.usuari;  // usuari carregat pel middleware
    res.json({ usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol, imatge: usuari.imatge } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/auth/perfil — actualitzar dades de l'usuari autenticat (requereix token)
// protegir: middleware que verifica el JWT i posa l'usuari a req.usuari
router.put('/perfil', protegir, async (req, res) => {
  try {
    const usuari = req.usuari;  // usuari carregat pel middleware
    const { email, password } = req.body;

    // Si s'envia email, comprovar que no estigui en ús per un altre usuari
    if (email && email !== usuari.email) {
      const existent = await Usuario.findOne({ email });
      if (existent) {
        return res.status(400).json({ error: 'Aquest email ja està registrat' });
      }
      usuari.email = email;
    }
    // Si s'envia password, s'assigna; el pre('save') la hashejarà en fer save()
    if (password) {
      usuari.password = password;
    }

    await usuari.save();  // dispara pre('save') si s'ha modificat password

    // Retornar l'usuari actualitzat (sense password); opcionalment un nou token
    const token = jwt.sign(
      { id: usuari._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol, imatge: usuari.imatge } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/auth/usuaris/:id/rol — canviar el rol d'un usuari (només admin)
router.patch('/usuaris/:id/rol', protegir, autoritzar('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!['usuari', 'editor', 'admin'].includes(rol)) {
      return res.status(400).json({ error: 'Rol no vàlid. Usa "usuari", "editor" o "admin"' });
    }

    const usuariActualitzat = await Usuario.findByIdAndUpdate(
      id,
      { rol },
      { new: true, runValidators: true }
    );

    if (!usuariActualitzat) {
      return res.status(404).json({ error: 'Usuari no trobat' });
    }

    res.json({
      missatge: 'Rol actualitzat correctament',
      usuari: {
        id: usuariActualitzat._id,
        email: usuariActualitzat.email,
        rol: usuariActualitzat.rol,
        imatge: usuariActualitzat.imatge
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/usuaris — llistar usuaris autenticats (només admin)
router.get('/usuaris', protegir, autoritzar('admin'), async (req, res) => {
  try {
    const usuaris = await Usuario.find().select('_id email rol imatge createdAt updatedAt');
    res.json({ usuaris });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exportar el router per poder muntar-lo a l'app (p. ex. app.use('/api/auth', router))
export default router;