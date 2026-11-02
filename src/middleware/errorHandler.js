const multer = require('multer');

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err instanceof multer.MulterError ? 400 : err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? 'Внутренняя ошибка сервера' : err.message,
  });
};