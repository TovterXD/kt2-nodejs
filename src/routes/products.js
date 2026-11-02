const router = require('express').Router();
const Joi = require('joi');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const products = [];
let nextId = 1;
const category = Joi.string().valid('electronics', 'clothing', 'food', 'other');
const fields = {
  name: Joi.string().min(2).max(100),
  price: Joi.number().greater(0),
  category,
  stock: Joi.number().integer().min(0),
  description: Joi.string().max(500).allow(''),
};
const fullSchema = Joi.object({ ...fields, stock: fields.stock.default(0) })
  .fork(['name', 'price', 'category'], (field) => field.required());
const partialSchema = Joi.object(fields).min(1);
const querySchema = Joi.object({
  category,
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(Joi.ref('minPrice', { adjust: (value) => value ?? 0 })),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

router.get('/', validate(querySchema, 'query'), (req, res) => {
  const { category, minPrice, maxPrice, page, limit } = req.validated;
  const data = products.filter((product) =>
    (category === undefined || product.category === category) &&
    (minPrice === undefined || product.price >= minPrice) &&
    (maxPrice === undefined || product.price <= maxPrice));
  res.json({ data: data.slice((page - 1) * limit, page * limit), total: data.length, page, limit });
});

router.post('/', validate(fullSchema), (req, res) => {
  const product = { id: nextId++, ...req.validated, createdAt: new Date().toISOString() };
  products.push(product);
  res.status(201).json(product);
});

router.param('id', (req, res, next, id) => {
  req.product = products.find((product) => String(product.id) === id);
  if (!req.product) return res.status(404).json({ message: 'Товар не найден' });
  next();
});

router.get('/:id', (req, res) => res.json(req.product));

router.put('/:id', validate(fullSchema), (req, res) => {
  const { id, createdAt, imageUrl } = req.product;
  const product = { id, ...req.validated, createdAt, ...(imageUrl && { imageUrl }) };
  products[products.indexOf(req.product)] = product;
  res.json(product);
});

router.patch('/:id', validate(partialSchema), (req, res) => {
  Object.assign(req.product, req.validated);
  res.json(req.product);
});

router.delete('/:id', (req, res) => {
  products.splice(products.indexOf(req.product), 1);
  res.status(204).end();
});

router.post('/:id/image', upload, (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Требуется файл image' });
  req.product.imageUrl = `/uploads/products/${req.file.filename}`;
  res.json(req.product);
});

module.exports = router;