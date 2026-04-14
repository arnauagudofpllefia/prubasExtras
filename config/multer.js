import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dest = path.join(__dirname, '../uploads');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + (file.originalname || 'fitxer');
    cb(null, unique.replace(/\s/g, '-'));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/i.test(file.mimetype);
  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error('Tipus de fitxer no permes. Nomes imatges.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
