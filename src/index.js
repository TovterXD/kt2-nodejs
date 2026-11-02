const express = require('express');
const config = require('./config');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

app.use(require('./middleware/logger'));
app.use(express.json());
app.use('/uploads/products', express.static(config.uploads));
app.use('/api/products', require('./routes/products'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res) => res.status(404).json({ message: 'Маршрут не найден' }));
app.use(require('./middleware/errorHandler'));

app.listen(config.port, () => console.log(`Сервер запущен: http://localhost:${config.port}`));