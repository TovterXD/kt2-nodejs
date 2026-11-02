const multer = require('multer');
const { randomUUID } = require('node:crypto');
const { mkdirSync } = require('node:fs');
const config = require('../config');

mkdirSync(config.uploads, { recursive: true });

module.exports = multer({
  storage: multer.diskStorage({
    destination: config.uploads,
    filename: (req, file, cb) => {
      cb(null, `${randomUUID()}${file.mimetype === 'image/png' ? '.png' : '.jpg'}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) return cb(null, true);
    cb(Object.assign(new Error('Разрешены только JPEG и PNG'), { status: 400 }));
  },
}).single('image');