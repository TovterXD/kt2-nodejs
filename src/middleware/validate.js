module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.required().validate(req[source], { abortEarly: false });
  if (error) {
    return res.status(400).json({ details: error.details.map((detail) => detail.message) });
  }
  req.validated = value;
  next();
};